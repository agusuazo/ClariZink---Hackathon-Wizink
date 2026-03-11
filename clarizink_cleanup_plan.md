# 🧹 ClariZink — Portfolio Cleanup & Optimization Plan

> **Goal:** Transform the hackathon project into a polished, portfolio-ready public GitHub repository with no security flaws, no dead code, professional documentation, and clean architecture.

---

## 📊 Project Overview

| Item | Detail |
|---|---|
| **Name** | ClariZink – Tu Ruta Inteligente al Crédito |
| **Stack** | React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Recharts |
| **Origin** | Lovable.dev scaffold → WiZink Hackathon submission |
| **AI Backend** | AWS Bedrock AgentCore (via `@aws-sdk/client-bedrock-agentcore`) |
| **Repo** | `https://github.com/agusuazo/ClariZink---Hackathon-Wizink` |
| **Pages** | Index (landing + dashboard), Coach (AI chat), NotFound |
| **Modules** | Credit Path Advisor, PreApproval Finder, Credit Simulation |

---

## 🚨 Phase 0: CRITICAL — Security Fix (Must Do FIRST)

### 0.1 — Hardcoded AWS Credentials Exposed

> [!CAUTION]
> **AWS Access Keys are hardcoded in plain text in [api.ts](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/lib/api.ts#L77-L85).**
> These are pushed to the public repo — anyone can use them to incur charges on your AWS account.

```typescript
// ❌ CURRENT — Exposed in api.ts lines 77-85
const clave = "AKIA4IPQJZ2ON7YNCH7V";
const clave_secreta = "p7rtz6p9bY9Iqo2gwJRD63klL9ZmxypPEEu3ejdW";
```

**Actions:**
1. **Immediately rotate/revoke these AWS credentials** in the AWS IAM console
2. Remove hardcoded credentials from the code
3. Replace with environment variables via `.env` (already partially set up with `VITE_API_URL`)
4. Add `.env` to [.gitignore](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/.gitignore)
5. Create `.env.example` documenting the required variables
6. Since these credentials exist in git history, consider using `git filter-branch` or `BFG Repo-Cleaner` to purge them from history, or create a fresh repo

### 0.2 — Console Logging of Secrets

```typescript
// ❌ api.ts lines 106-107
console.log(clave);
console.log(clave_secreta);
```

**Action:** Remove all `console.log` statements that output sensitive data.

---

## 🧼 Phase 1: Remove Lovable Branding & Boilerplate

### 1.1 — Remove Lovable References

| File | Issue | Action |
|---|---|---|
| [README.md](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/README.md) | Entire file is Lovable's auto-generated template | Rewrite completely |
| [index.html](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/index.html#L13-L17) | OG image and Twitter meta point to `lovable.dev` | Replace with own assets |
| [index.html](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/index.html#L16) | `@Lovable` twitter handle | Remove or replace |
| [vite.config.ts](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/vite.config.ts#L4) | `lovable-tagger` plugin import | Remove |
| [package.json](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/package.json#L76) | `"lovable-tagger": "^1.1.11"` devDependency | Remove |
| [App.tsx](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/App.tsx#L23) | Comment: `{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}` | Remove (Lovable scaffold comment) |
| [package.json](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/package.json#L2) | `"name": "vite_react_shadcn_ts"` | Rename to `"clarizink"` |

### 1.2 — Remove Dead CSS File

[App.css](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/App.css) contains Vite's default template styles (logo spin animation, `.read-the-docs`, etc.). **It is never imported** and should be **deleted entirely**.

### 1.3 — Remove [bun.lockb](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/bun.lockb)

The project uses `npm` (evidenced by [package-lock.json](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/package-lock.json)). The [bun.lockb](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/bun.lockb) binary lockfile is redundant and confusing. **Delete it** and add it to [.gitignore](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/.gitignore).

---

## 🗑️ Phase 2: Remove Unused UI Components

The project installs **49 shadcn/ui components** but only uses **~10 of them**. This bloats the codebase significantly.

### UI Components Actually Used

| Component | Used By |
|---|---|
| `button` | Almost everywhere |
| `card` | Almost everywhere |
| `input` | UserDataCard, Coach |
| `label` | UserDataCard, CreditSimulation |
| `slider` | CreditSimulation |
| `sonner` | App.tsx |
| [toast](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/hooks/use-toast.ts#137-165) / `toaster` | App.tsx + hooks |
| `tooltip` | App.tsx |

### UI Components to DELETE (~40 files)

```
accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb,
calendar, carousel, chart, checkbox, collapsible, command, context-menu,
dialog, drawer, dropdown-menu, form, hover-card, input-otp, menubar,
navigation-menu, pagination, popover, progress, radio-group, resizable,
scroll-area, select, separator, sheet, sidebar, skeleton, switch, table,
tabs, textarea, toggle, toggle-group
```

### Unused Dependencies to Remove from [package.json](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/package.json)

After deleting unused UI components, these Radix packages (and others) become removable:

```
@hookform/resolvers, @radix-ui/react-accordion, @radix-ui/react-alert-dialog,
@radix-ui/react-aspect-ratio, @radix-ui/react-avatar, @radix-ui/react-checkbox,
@radix-ui/react-collapsible, @radix-ui/react-context-menu, @radix-ui/react-dialog,
@radix-ui/react-dropdown-menu, @radix-ui/react-hover-card, @radix-ui/react-menubar,
@radix-ui/react-navigation-menu, @radix-ui/react-popover, @radix-ui/react-progress,
@radix-ui/react-radio-group, @radix-ui/react-scroll-area, @radix-ui/react-select,
@radix-ui/react-separator, @radix-ui/react-switch, @radix-ui/react-tabs,
@radix-ui/react-toggle, @radix-ui/react-toggle-group,
cmdk, date-fns, embla-carousel-react, input-otp, next-themes,
react-day-picker, react-hook-form, react-resizable-panels, vaul, zod
```

### Also Remove Unused Custom Code

| File | Reason |
|---|---|
| [NavLink.tsx](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/components/NavLink.tsx) | Never imported anywhere in the app |
| [use-mobile.tsx](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/hooks/use-mobile.tsx) | Never imported anywhere in the app |
| [src/components/ui/use-toast.ts](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/components/ui/use-toast.ts) | Duplicate — real `use-toast` is in `src/hooks/` |

---

## 🏗️ Phase 3: Code Quality Improvements

### 3.1 — Fix `dangerouslySetInnerHTML` XSS Vulnerabilities

The same markdown-to-HTML parsing pattern is **copy-pasted 3 times** across:
- [Coach.tsx](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/pages/Coach.tsx#L103-L111) (lines 103-111)
- [CreditPathAdvisor.tsx](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/components/modules/CreditPathAdvisor.tsx#L89-L97) (lines 89-97)
- [CreditSimulation.tsx](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/components/modules/CreditSimulation.tsx#L161-L169) (lines 161-169)

> [!WARNING]
> `dangerouslySetInnerHTML` with `.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')` without sanitization is a potential XSS vector if AI response content is ever compromised.

**Actions:**
1. Extract into a shared `<MarkdownResponse content={text} />` component
2. Use a lightweight markdown library like `react-markdown` (much safer), OR sanitize with DOMPurify
3. Eliminates ~30 lines of duplicated code

### 3.2 — Deprecated `onKeyPress` Usage

```typescript
// ❌ Coach.tsx line 150
onKeyPress={e => e.key === 'Enter' && handleSend()}
```

**Action:** Replace with `onKeyDown` (the spec-compliant alternative).

### 3.3 — Improve Type Safety

- [PreApprovalFinder.tsx](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/components/modules/PreApprovalFinder.tsx#L31-L34): Uses `any` types: `res.productos.map((p: any) => ...)`
- [CreditPathAdvisor.tsx](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/components/modules/CreditPathAdvisor.tsx#L34): Uses `any` type: `res.limitations.map((l: any) => ...)`

**Action:** Define proper interfaces for API responses in [api.ts](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/lib/api.ts).

### 3.4 — Missing React Strict Mode

[main.tsx](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/main.tsx) doesn't wrap the app in `<React.StrictMode>`.

**Action:** Add it — it's expected in portfolio-quality React projects.

### 3.5 — Missing `useEffect` Dependencies

[Coach.tsx](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/pages/Coach.tsx#L18-L26) line 26: `useEffect` with empty dependency array but references `chatHistory`, `userType`, [addChatMessage](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/contexts/AppContext.tsx#57-60).

**Action:** Add proper dependencies or extract welcome message logic.

### 3.6 — Commented-Out Code

[CreditPathAdvisor.tsx](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/components/modules/CreditPathAdvisor.tsx#L120-L131) has an entire commented-out chart section (lines 120-131).

**Action:** Remove all commented-out code.

---

## 🧠 Phase 4: Architecture & API Cleanup

### 4.1 — AWS SDK in Frontend is an Anti-Pattern

> [!IMPORTANT]
> The [callCoachFinanciero](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/lib/api.ts#72-117) function in [api.ts](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/lib/api.ts#L75-L116) imports and uses the AWS SDK **directly in the browser**. This is problematic because:
> 1. **Credentials can never be safely stored client-side**
> 2. **Bundle size** — the AWS SDK is massive
> 3. **Architecture smell** — frontends should call your own API, not AWS directly

**Recommended solution for portfolio showcase:**
- Since the backend API pattern already exists ([postJSON](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/lib/api.ts#6-17) → `API_URL`), convert [callCoachFinanciero](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/lib/api.ts#72-117) to also use the backend proxy:

```typescript
// ✅ Clean approach
export function callCoachFinanciero(message: string) {
  return postJSON<{ reply: string }>("/coach_financiero", { message });
}
```

- Remove `@aws-sdk/client-bedrock-agentcore` from dependencies (it's not even in package.json — it's dynamically imported, which still causes issues)
- Document in README that a backend server is needed

### 4.2 — Add Demo/Mock Mode

Since the project calls external APIs that won't work without credentials:

**Action:** Add an `VITE_DEMO_MODE=true` flag that returns realistic mock data so recruiters can **actually run the project** and see it working.

### 4.3 — Strong API Response Types

Create proper TypeScript interfaces for all API communication:

```typescript
interface CreditPathResponse {
  prob_actual: number;
  prob_mejorada: number;
  limitations: { factor: string; impacto: number }[];
  narrative: string;
}

interface PreApprovalResponse {
  productos: { producto: string; prob: "alta" | "media" | "baja" }[];
  narrative: string;
}

interface SimulationResponse {
  before: number;
  after: number;
  narrative: string;
}
```

---

## 📝 Phase 5: Professional README & Documentation

### 5.1 — New README.md Structure

Replace the entire Lovable boilerplate with:

```markdown
# 🏦 ClariZink — Smart Credit Access Platform

> AI-powered financial advisor built for the WiZink Hackathon.
> Analyzes user financial profiles, recommends credit products,
> and provides personalized improvement roadmaps.

## ✨ Features
- Credit Path Advisor — personalized approval probability with AI analysis
- PreApproval Finder — discover matching credit products
- Credit Simulation — what-if scenario modeling with interactive charts
- AI Financial Coach — conversational assistant powered by AWS Bedrock

## 🛠️ Tech Stack
React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui · Recharts · AWS Bedrock

## 🚀 Getting Started
...

## 📸 Screenshots
...

## 🏗️ Architecture
...

## 📄 License
```

### 5.2 — Add Screenshots

Take screenshots of the app in action and add them to the README. A portfolio project **must** have visual evidence.

### 5.3 — Add License File

Add `MIT` (or preferred) license file.

---

## 🎨 Phase 6: UI / UX Polish

### 6.1 — Fix Inconsistent Naming

| Location | Current | Should Be |
|---|---|---|
| [index.html](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/index.html#L6) title | "Credit Access Suite" | "ClariZink" |
| [index.html](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/index.html#L8) author | "Credit Access Suite" | "ClariZink" |
| [Header.tsx](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/components/Header.tsx#L8) | "clariZink" (lowercase c) | "ClariZink" (consistent casing) |
| [Coach.tsx](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/pages/Coach.tsx#L84) | "clariZink" (lowercase c) | "ClariZink" |

### 6.2 — Add Loading States & Empty States

Currently the modules show nothing when no data is loaded. Add skeleton placeholders or empty state illustrations to give a more polished feel.

### 6.3 — NotFound Page Language

The [NotFound page](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/src/pages/NotFound.tsx) is in English while the rest of the app is in Spanish. Make it consistent.

### 6.4 — Remove [placeholder.svg](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/public/placeholder.svg)

[public/placeholder.svg](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/public/placeholder.svg) is a Lovable placeholder. Not referenced anywhere — delete it.

---

## ⚡ Phase 7: Build & Performance

### 7.1 — Verify Production Build

Run `npm run build` and fix any TypeScript or bundle errors.

### 7.2 — Add Linting Cleanup

Run `npm run lint` and fix reported issues. Currently ESLint disables `@typescript-eslint/no-unused-vars` — re-enable it after cleaning up code.

### 7.3 — Update [.gitignore](file:///c:/Users/UA/Desktop/Proyectos/ClariZink---Hackathon-Wizink/.gitignore)

Add entries for:
```
.env
.env.local
bun.lockb
```

---

## 📋 Execution Priority & Summary

| Priority | Phase | Effort | Impact |
|:---:|---|:---:|:---:|
| 🔴 **P0** | Phase 0 — Security (credentials) | 30 min | **CRITICAL** |
| 🟠 **P1** | Phase 1 — Remove Lovable branding | 20 min | High |
| 🟠 **P1** | Phase 2 — Remove unused components | 30 min | High |
| 🟡 **P2** | Phase 3 — Code quality fixes | 45 min | Medium-High |
| 🟡 **P2** | Phase 4 — API architecture cleanup | 60 min | High |
| 🟢 **P3** | Phase 5 — README & docs | 30 min | High |
| 🟢 **P3** | Phase 6 — UI/UX polish | 30 min | Medium |
| 🔵 **P4** | Phase 7 — Build & performance | 20 min | Low-Medium |

**Estimated total: ~4-5 hours**

---

> [!TIP]
> After all cleanup is done, consider creating a **fresh repository** (without git history containing the exposed credentials) and pushing a clean initial commit. This is the safest approach for a public portfolio project.
