// src/lib/api.ts
import type { UserData } from "@/contexts/AppContext";

export interface LimitationFactor {
  factor: string;
  impacto: number;
}

export interface CreditPathResponse {
  prob_actual: number;
  prob_mejorada: number;
  limitations: LimitationFactor[];
  narrative: string;
}

export interface ProductoPreApproval {
  producto: string;
  prob: string;
}

export interface PreApprovalResponse {
  productos: ProductoPreApproval[];
  narrative: string;
}

export interface SimulationResponse {
  before: number;
  after: number;
  narrative: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

/* ============================================================
   Demo mock data — returned when VITE_DEMO_MODE=true
============================================================ */
const MOCK_CREDIT_PATH: CreditPathResponse = {
  prob_actual: 72,
  prob_mejorada: 85,
  limitations: [
    { factor: "Ratio deuda/ingresos", impacto: 18 },
    { factor: "Antigüedad de empleo", impacto: 10 },
    { factor: "Historial de pagos", impacto: 7 },
  ],
  narrative:
    "**Análisis de tu perfil crediticio**\n\nBasado en tus ingresos y perfil financiero, tienes una probabilidad de aprobación del **72%**. Tu ratio deuda/ingresos es el principal factor limitante.\n\n**Pasos recomendados para mejorar:**\n\nReducir tu deuda actual en un **20%** podría elevar tu probabilidad hasta el **85%**.",
};

const MOCK_PRE_APPROVAL: PreApprovalResponse = {
  productos: [
    { producto: "Tarjeta WiZink Plus", prob: "alta" },
    { producto: "Préstamo Personal WiZink", prob: "media" },
    { producto: "Cuenta WiZink Remunerada", prob: "alta" },
  ],
  narrative:
    "**Productos disponibles para tu perfil**\n\nTu perfil financiero te da acceso a varios productos WiZink. La **Tarjeta WiZink Plus** es tu mejor opción con alta probabilidad de aprobación.",
};

const MOCK_SIMULATION: SimulationResponse = {
  before: 68,
  after: 83,
  narrative:
    "**Simulación: Reducción de deuda**\n\nSi reduces tu deuda según los parámetros indicados, tu puntuación crediticia mejoraría de **68** a **83** puntos en aproximadamente 6 meses.\n\nEste cambio abriría el acceso a productos premium de WiZink con mejores condiciones de interés.",
};

const MOCK_COACH_REPLY =
  "**Modo Demo activo.** En producción, este agente está conectado a AWS Bedrock AgentCore y proporciona análisis crediticio personalizado en tiempo real.\n\nPuedo ayudarte con:\n- **Productos WiZink** adaptados a tu perfil\n- **Simulaciones** de escenarios financieros\n- **Estrategias** para mejorar tu scoring\n\n¿En qué aspecto financiero puedo asistirte?";

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status} en ${path}`);
  }
  return res.json() as Promise<T>;
}

/* ============================================================
   1) CREDIT PATH ADVISOR — usa strands_claude agent
============================================================ */
export function callCreditPath(userData: UserData): Promise<CreditPathResponse> {
  if (DEMO_MODE) {
    return delay(1200).then(() => ({
      ...MOCK_CREDIT_PATH,
      prob_actual: userData.retrasos > 0 ? 0 : MOCK_CREDIT_PATH.prob_actual,
      prob_mejorada: userData.retrasos > 0 ? 0 : MOCK_CREDIT_PATH.prob_mejorada,
    }));
  }

  const message = `Analiza mi situación crediticia: ingresos ${userData.ingresos}€, deuda ${userData.deuda}€, retrasos ${userData.retrasos}, importe solicitado ${userData.importe}€. IMPORTANTE: Si tengo retrasos en pagos (${userData.retrasos}), no puedo optar a ningún crédito.`;

  return postJSON<{ reply: string }>("/coach_financiero", { message }).then(response => ({
    prob_actual: userData.retrasos > 0 ? 0 : 70,
    prob_mejorada: userData.retrasos > 0 ? 0 : 80,
    limitations: [{ factor: "Análisis completo", impacto: 0 }],
    narrative: response.reply,
  }));
}

/* ============================================================
   2) PREAPPROVAL FINDER — usa strands_claude agent
============================================================ */
export function callPreApproval(userData: UserData): Promise<PreApprovalResponse> {
  if (DEMO_MODE) {
    return delay(1000).then(() =>
      userData.retrasos > 0
        ? { productos: [], narrative: MOCK_PRE_APPROVAL.narrative }
        : MOCK_PRE_APPROVAL
    );
  }

  const score = Math.max(30, 85 - (userData.deuda / userData.ingresos) * 50 - userData.retrasos * 10);
  const message = `Recomiéndame productos WiZink para mis ingresos de ${userData.ingresos}€ y score crediticio de ${Math.round(score)}. IMPORTANTE: Si tengo retrasos en pagos (${userData.retrasos}), no puedo optar a ningún crédito.`;

  return postJSON<{ reply: string }>("/coach_financiero", { message }).then(response => ({
    productos: userData.retrasos > 0
      ? []
      : [
          { producto: "Tarjeta WiZink", prob: "Alta" },
          { producto: "Préstamo Personal", prob: "Media" },
        ],
    narrative: response.reply,
  }));
}

/* ============================================================
   3) SIMULACIÓN WHAT-IF — usa strands_claude agent
============================================================ */
export function callSimulateScenario(
  probActual: number,
  tipo: string,
  monto: number,
  userData?: UserData,
): Promise<SimulationResponse> {
  if (DEMO_MODE) {
    return delay(1400).then(() => ({
      ...MOCK_SIMULATION,
      before: probActual,
      after: userData?.retrasos && userData.retrasos > 0 ? 0 : MOCK_SIMULATION.after,
    }));
  }

  const message = `Simula el impacto de ${tipo} por ${monto}€ en mi probabilidad actual de ${probActual}%. IMPORTANTE: Si tengo retrasos en pagos, no puedo optar a ningún crédito hasta resolverlos.`;

  return postJSON<{ reply: string }>("/coach_financiero", { message }).then(response => {
    const mejora = tipo === "reducir_deuda" ? 15 : tipo === "aumentar_ingresos" ? 10 : 20;
    return {
      before: probActual,
      after: userData?.retrasos && userData.retrasos > 0 ? 0 : Math.min(95, probActual + mejora),
      narrative: response.reply,
    };
  });
}

/* ============================================================
   4) COACH FINANCIERO
   Routes through the backend proxy — AWS credentials stay server-side.
============================================================ */
export function callCoachFinanciero(message: string): Promise<{ reply: string }> {
  if (DEMO_MODE) {
    return delay(1500).then(() => ({ reply: MOCK_COACH_REPLY }));
  }
  return postJSON<{ reply: string }>("/coach_financiero", { message });
}
