# DS — Design Summary (axi-ambient)

## 1. Decizie arhitecturală

Componenta rămâne într-un singur fișier `.mjs`, dar cu separare clară pe clase interne pentru mentenabilitate:

- `TargetSampler`
- `AlphaField`
- `ParticleEngine`
- `StateController`
- `Renderer2D`
- `AxiAmbientElement`

Aceasta permite livrare simplă și logică internă modulară.

## 2. Trade-offs asumate

1. **Canvas 2D** în loc de WebGL: implementare robustă, portabilă, simplu de integrat.
2. **Explozie “normal” mapată la “radial”**: reduce complexitatea fără a pierde comportamentul vizual cerut.
3. **`flow-on-shape` implementat ca tangent drift local**: variantă pragmatică pentru prima versiune.
4. **`curve` alpha mapat la `linear`**: păstrează compatibilitatea API până la introducerea unei funcții custom.

## 3. Contract de integrare indirectă (pentru tehnologii target)

Pentru host frameworks (React/Vue/Svelte/Angular, orchestratori no-code, plugin runtimes), integrarea recomandată este prin:

1. **Command bus pe CustomEvent**
   - Input: `axi-command` cu `{ command, payload }`
   - Confirmare: `axi-ambient:command-result`
2. **Telemetry/Event stream**
   - `axi-ambient:phase-change`
   - `axi-ambient:config-change`
3. **State pull**
   - `element.getState()` pentru snapshot sincron

Avantaj: tehnologia target nu depinde de referințe directe la metode în fiecare loc; poate controla componenta printr-un adapter generic.

### Adapter pattern recomandat

Un adapter pentru tehnologia target ar trebui să ofere:

- `send(command, payload)` -> emite `axi-command`
- `subscribePhase(cb)` -> ascultă `axi-ambient:phase-change`
- `getSnapshot()` -> apelează `getState()`

Astfel, UI-ul host rămâne decuplat de detaliile de implementare internă.

## 4. Siguranță operațională

- Lifecycle idempotent (`connected/disconnected/destroy`)
- observers și RAF sunt oprite la detach/destroy
- parse erori pentru `config` atribut sunt raportate explicit (`console.error`)

## 5. Extensii planificate

- `svg-raster` target sampler
- alpha field tip `curve` cu funcții custom
- spatial grid pentru optimizare vecini la densitate mare
