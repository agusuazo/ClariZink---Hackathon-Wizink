// src/lib/api.ts
import type { UserData } from "@/contexts/AppContext";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

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
export function callCreditPath(userData: UserData) {
  const message = `Analiza mi situación crediticia: ingresos ${userData.ingresos}€, deuda ${userData.deuda}€, retrasos ${userData.retrasos}, importe solicitado ${userData.importe}€. IMPORTANTE: Si tengo retrasos en pagos (${userData.retrasos}), no puedo optar a ningún crédito.`;
  
  return postJSON<{ reply: string }>("/coach_financiero", { message })
    .then(response => {
      const narrative = response.reply;
      return {
        prob_actual: userData.retrasos > 0 ? 0 : 70,
        prob_mejorada: userData.retrasos > 0 ? 0 : 80,
        limitations: [{ factor: "Análisis completo", impacto: 0 }],
        narrative
      };
    });
}

/* ============================================================
   2) PREAPPROVAL FINDER — usa strands_claude agent
============================================================ */
export function callPreApproval(userData: UserData) {
  const score = Math.max(30, 85 - (userData.deuda / userData.ingresos * 50) - (userData.retrasos * 10));
  const message = `Recomiéndame productos WiZink para mis ingresos de ${userData.ingresos}€ y score crediticio de ${Math.round(score)}. IMPORTANTE: Si tengo retrasos en pagos (${userData.retrasos}), no puedo optar a ningún crédito.`;
  
  return postJSON<{ reply: string }>("/coach_financiero", { message })
    .then(response => {
      return {
        productos: userData.retrasos > 0 ? [] : [
          { producto: "Tarjeta WiZink", prob: "Alta" },
          { producto: "Préstamo Personal", prob: "Media" }
        ],
        narrative: response.reply
      };
    });
}

/* ============================================================
   3) SIMULACIÓN WHAT-IF — usa strands_claude agent
============================================================ */
export function callSimulateScenario(probActual: number, tipo: string, monto: number, userData?: UserData) {
  const message = `Simula el impacto de ${tipo} por ${monto}€ en mi probabilidad actual de ${probActual}%. IMPORTANTE: Si tengo retrasos en pagos, no puedo optar a ningún crédito hasta resolverlos.`;
  
  return postJSON<{ reply: string }>("/coach_financiero", { message })
    .then(response => {
      const mejora = tipo === "reducir_deuda" ? 15 : tipo === "aumentar_ingresos" ? 10 : 20;
      return {
        before: probActual,
        after: userData?.retrasos && userData.retrasos > 0 ? 0 : Math.min(95, probActual + mejora),
        narrative: response.reply
      };
    });
}

/* ============================================================
   4) COACH FINANCIERO (usa agente Bedrock)
============================================================ */
export async function callCoachFinanciero(message: string) {
  const { BedrockAgentCoreClient, InvokeAgentRuntimeCommand } = await import("@aws-sdk/client-bedrock-agentcore");
  const clave = "AKIA4IPQJZ2ON7YNCH7V";
  const clave_secreta = "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";
  const client = new BedrockAgentCoreClient({ 
    region: "us-west-2",
    credentials: {
      // accessKeyId: import.meta.env.AWS_ACCESS_KEY_ID,
      // secretAccessKey: import.meta.env.AWS_SECRET_ACCESS_KEY
      accessKeyId: clave,
      secretAccessKey: clave_secreta
    }
  });
  const restrictedPrompt = `Eres Clari, asistente financiero de WiZink. SOLO responde preguntas sobre:
- Productos financieros de WiZink (tarjetas, préstamos, cuentas)
- Análisis crediticio y scoring
- Consejos financieros generales
- Simulaciones de crédito

Si la pregunta no es sobre finanzas o WiZink, responde: Solo puedo ayudarte con temas financieros y productos WiZink. ¿En qué aspecto financiero puedo asistirte?

Pregunta del usuario: ${message}`;

  const input = {
    runtimeSessionId: "dfmeoagmreaklgmrkleafremoigrmtesogmtrskhmtkrlshmt",
    agentRuntimeArn: "arn:aws:bedrock-agentcore:us-west-2:842854420124:runtime/riskbustersagent-uguYBu5c4o",
    qualifier: "DEFAULT",
    payload: new TextEncoder().encode(JSON.stringify({ prompt: restrictedPrompt }))
  };

  try {
    console.log(clave);
    console.log(clave_secreta);
    const command = new InvokeAgentRuntimeCommand(input);
    const response = await client.send(command);
    const textResponse = await response.response.transformToString();
    return { reply: textResponse };
  } catch (error) {
    console.error('Error calling nova-pro agent:', error);
    throw error;
  }
}
