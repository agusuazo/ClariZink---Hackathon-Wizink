import puppeteer from "puppeteer";
import { mkdir, unlink } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = join(__dirname, "../public/screenshots");
const BASE_URL = "http://localhost:8080";

await mkdir(SCREENSHOTS_DIR, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900 });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(filename) {
  await page.screenshot({ path: join(SCREENSHOTS_DIR, filename) });
  console.log("shot: " + filename);
}

async function scrollTo(text, tag) {
  tag = tag || "h3";
  await page.evaluate(function(t, tag) {
    var el = Array.from(document.querySelectorAll(tag)).find(function(e) { return e.textContent.includes(t); });
    if (el) {
      var y = el.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top: Math.max(0, y), behavior: "instant" });
    }
  }, text, tag);
  await wait(500);
}

// 1. Landing
await page.goto(BASE_URL, { waitUntil: "networkidle0" });
await shot("01-landing.png");

// 2. Click "Continuar como Cliente" — sets userType + userData in one call, no form needed
await page.evaluate(function() {
  var btn = Array.from(document.querySelectorAll("button")).find(function(b) { return b.textContent.trim() === "Continuar como Cliente"; });
  if (btn) btn.click();
});
await page.waitForFunction(function() { return document.querySelectorAll("h2").length >= 3; }, { timeout: 8000 });
await wait(400);

// 3. Dashboard overview
await page.evaluate(function() { window.scrollTo(0, 0); });
await wait(300);
await shot("02-dashboard.png");

// 4. Credit Path Advisor
await page.evaluate(function() {
  var btn = Array.from(document.querySelectorAll("button")).find(function(b) { return b.textContent.includes("Generar mi Ruta"); });
  if (btn) btn.click();
});
await wait(2500);
await scrollTo("Tu An\u00e1lisis Personalizado");
await shot("03-credit-path-narrative.png");
await scrollTo("Probabilidad de Aprobaci\u00f3n", "h4");
await shot("04-credit-path-chart.png");

// 5. PreApproval Finder
await page.evaluate(function() {
  var btn = Array.from(document.querySelectorAll("button")).find(function(b) { return b.textContent.includes("cr\u00e9ditos puedo optar"); });
  if (btn) btn.click();
});
await wait(2000);
await scrollTo("Productos Recomendados");
await shot("05-preapproval-products.png");
await scrollTo("Importe vs Probabilidad", "h4");
await shot("06-preapproval-chart.png");

// 6. Credit Simulation
await page.evaluate(function() {
  var btn = Array.from(document.querySelectorAll("button")).find(function(b) { return b.textContent.trim() === "Simular Escenario"; });
  if (btn) btn.click();
});
await wait(2500);
await scrollTo("An\u00e1lisis del Escenario");
await shot("07-simulation-narrative.png");
await scrollTo("Escenario Actual", "h4");
await shot("08-simulation-scores.png");

// 7. Coach page — uses <input> not <textarea>; send via keyboard Enter
await page.goto(BASE_URL + "/coach", { waitUntil: "networkidle0" });
await wait(2800);
await shot("09-coach-welcome.png");

const inputSel = 'input[placeholder="Escribe tu pregunta..."]';
await page.waitForSelector(inputSel);
await page.click(inputSel);
await page.keyboard.type("Que tarjeta me recomiendas para mis ingresos?");
await wait(300);
await page.keyboard.press("Enter"); // triggers onKeyDown handler in Coach.tsx
await wait(3500);
await shot("10-coach-reply.png");

await browser.close();

// Remove the temporary .env.local created for demo mode
try { await unlink(join(__dirname, "../.env.local")); console.log("removed .env.local"); } catch(e) {}
console.log("done — screenshots saved to public/screenshots/");
