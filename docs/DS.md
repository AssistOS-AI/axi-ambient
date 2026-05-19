# DS — Design Summary (axi-ambient + agent-blackboard)

## 1. Decizie arhitecturală

Ambele componente rămân în fișiere `.mjs` separate, fără build, fără dependențe:

- `axi-ambient.mjs` — fundal animat cu particule
- `agent-blackboard.mjs` — suprafață vizuală controlată de agenți AI

Fiecare componentă are separare clară pe clase interne.

## 2. Trade-offs asumate

1. **Canvas 2D** în loc de WebGL pentru axi-ambient: implementare robustă, portabilă.
2. **DOM rendering** pentru agent-blackboard: necesar pentru inputuri interactive, iframe-uri YouTube, tabele HTML.
3. **Explozie "normal" mapată la "radial"**: reduce complexitatea fără a pierde comportamentul vizual.
4. **`curve` alpha mapat la `linear`**: păstrează compatibilitatea API.
5. **SVG sanitizare client-side**: suficient pentru uz intern, dar nu înlocuiește validarea server-side.

## 3. Contract de integrare indirectă

### axi-ambient

- Input: `axi-command` cu `{ command, payload }`
- Confirmare: `axi-ambient:command-result`
- Telemetry: `axi-ambient:phase-change`, `axi-ambient:config-change`
- State pull: `element.getState()`

### agent-blackboard

- Protocol text: `blackboard:<agentId>:<userId>:<base64url(JSON)>`
- Acțiuni utilizator: `blackboard:action` cu detalii complete
- Export: `blackboard:export`
- State pull: `element.getState()`

## 4. Siguranță operațională

- Lifecycle idempotent (`connected/disconnected/destroy`)
- Observers și RAF oprite la detach/destroy
- Parse erori raportate explicit
- Comenzi invalide respinse fără afectarea scenei existente
- SVG sanitizare strictă

## 5. Extensii planificate

- `svg-raster` target sampler pentru axi-ambient
- alpha field tip `curve` cu funcții custom
- spatial grid pentru optimizare vecini la densitate mare
- WebMeet chat interceptor integrat
- Asset management pentru imagini și SVG-uri externe
- Export imagine real (html2canvas sau similar)
- Persistență stare blackboard
