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

// 🔹 1) /credit_path
export function callCreditPath(userData: UserData) {
  const payload = {
    ingresos: userData.ingresos,
    deuda_externa: userData.deuda,  // por ahora usamos 'deuda' como deuda_externa
    retrasos: userData.retrasos,
    score: 60,                      // placeholder; el día de la hack usas el score real
    importe: userData.importe,
    plazo: 24,                      // placeholder configurable
  };
  return postJSON<{
    prob_actual: number;
    prob_mejorada: number;
    limitations: { factor: string; impacto: number }[];
    narrative: string;
  }>("/credit_path", payload);
}

// 🔹 2) /preapproval_finder
export function callPreApproval(userData: UserData) {
  const payload = {
    ingresos: userData.ingresos,
    deuda_externa: userData.deuda,
    retrasos: userData.retrasos,
    score: 60,
    importe: userData.importe,
    plazo: 24,
  };
  return postJSON<{
    productos: { producto: string; prob: string }[];
    narrative: string;
  }>("/preapproval_finder", payload);
}

// 🔹 3) /simulate_scenario
export function callSimulateScenario(probActual: number, tipo: string, monto: number) {
  const payload = {
    tipo,
    monto,
    prob_actual: probActual,
  };
  return postJSON<{
    before: number;
    after: number;
    narrative: string;
  }>("/simulate_scenario", payload);
}

// 🔹 4) /coach_financiero
export function callCoachFinanciero(message: string) {
  const payload = { message };
  return postJSON<{ reply: string }>("/coach_financiero", payload);
}
