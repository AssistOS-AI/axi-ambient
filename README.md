# axi-ambient + agent-blackboard

## axi-ambient

Web Component autonom (`<axi-ambient>`) pentru fundal animat pe canvas, cu particule care trec prin stări `chaos -> converge -> hold -> explode`, suport pentru ținte ASCII/text/shape/points și mască de transparență pe zone.

## agent-blackboard

Web Component autonom (`<agent-blackboard>`) pentru suprafațe vizuale partajate controlate de agenți AI prin protocol text. Suportă text, forme, SVG-uri, imagini, YouTube, tabele, liste, timer-e, inputuri, tranziții și teme vizuale.

## Rulare rapidă

Deschide `demo.html` direct în browser (sau printr-un static server) și vei avea o pagină de test cu tab-uri pentru ambele componente.

```html
<script type="module" src="./axi-ambient.mjs"></script>
<script type="module" src="./agent-blackboard.mjs"></script>

<axi-ambient id="bg" style="display:block;height:560px;">
  <section style="position:relative;z-index:1;padding:56px;color:white;">
    <h1>Axi Ambient</h1>
  </section>
</axi-ambient>

<agent-blackboard id="bb" style="display:block;height:600px;" theme="formal"></agent-blackboard>
```

## axi-ambient API

- `configure(options)`
- `setAscii(ascii)`
- `setMessage(text)`
- `setShape(name)`
- `setPoints(points)`
- `run(command, payload)` (control indirect)
- `getState()`
- `startCycle()`, `converge()`, `hold()`, `explode()`, `scatter()`
- `pause()`, `resume()`, `destroy()`

## agent-blackboard API

- `clear()`, `clearLayer(layer)`
- `setTheme(name)`, `setBackground(params)`, `setLayout(name)`
- `applyCommand(cmd)`, `applyCommands(payload)`
- `processProtocolLine(line)` — parsează `blackboard:agentId:userId:base64url`
- `getState()`, `destroy()`
- `setupAmbient(options)`, `removeAmbient()`, `showAmbient()`, `hideAmbient()`

## MiniSDK

```js
import { createBlackboardSDK } from "./agent-blackboard.mjs";

const sdk = createBlackboardSDK("socrates");
sdk.clear()
  .theme("quiz")
  .text("title", "Quiz Time!", { geometry: { x: 40, y: 20 }, style: { fontSize: "32px" } })
  .timer("timer", 60)
  .askChoice("answer", "Choose:", { options: ["A", "B", "C"] })
  .applyTo(blackboardEl);
```

## Fișiere principale

- `axi-ambient.mjs` — componenta ambient (single-file, fără dependențe)
- `agent-blackboard.mjs` — componenta blackboard (single-file, fără dependențe)
- `demo.html` — pagină statică de test cu tab-uri pentru ambele componente
- `docs/SPEC.md` — specificația implementată
- `docs/DS.md` — design summary și decizii
- `docs/COVERAGE.md` — review de acoperire vs cerințe

## Reutilizare indirectă (framework / orchestrator friendly)

### axi-ambient

```js
el.dispatchEvent(new CustomEvent("axi-command", {
  detail: { command: "explode" },
  bubbles: true
}));
```

Evenimente emise: `axi-ambient:ready`, `axi-ambient:phase-change`, `axi-ambient:config-change`, `axi-ambient:command-result`, `axi-ambient:destroyed`

### agent-blackboard

```js
bb.processProtocolLine("blackboard:socrates::base64url...");
```

Evenimente emise: `blackboard:ready`, `blackboard:action`, `blackboard:export`, `blackboard:destroyed`
