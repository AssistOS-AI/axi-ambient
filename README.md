# axi-ambient + agent-blackboard

This repository contains two standalone browser web components and an editor-style demo:

- **root wrappers** — `axi-ambient.mjs`, `agent-blackboard.mjs`, and `demo.html` stay in the repository root as lightweight entry points.
- **component sources** — `components/axi-ambient/index.mjs` and `components/agent-blackboard/index.mjs`.
- **demo sources** — `demo/index.html`, `demo/styles.css`, and focused JS modules under `demo/`.

## Quick start

Open `demo.html` directly in a browser, or serve the repository through a small static HTTP server. The root `demo.html` file forwards to `demo/index.html`.

```html
<script type="module" src="./axi-ambient.mjs"></script>
<script type="module" src="./agent-blackboard.mjs"></script>

<axi-ambient id="bg" style="display:block;height:560px;">
  <section style="position:relative;z-index:1;padding:56px;color:white;">
    <h1>Ambient target demo</h1>
  </section>
</axi-ambient>

<agent-blackboard id="bb" style="display:block;height:600px;" theme="formal"></agent-blackboard>
```

## `axi-ambient`

`<axi-ambient>` is a single-file web component for ambient particle backgrounds. It supports:

- ASCII targets
- text targets
- shape targets (`circle`, `spiral`, `wave`, `grid`, `heart`, `star`, `infinity`, `speech`, `rocket`, `trophy`, `smile`, `arrow-up`, `network`, `community`)
- explicit point targets
- phase control (`chaos`, `converge`, `hold`, `explode`, `return`)
- alpha gradients and local alpha masks
- reduced-motion handling
- declarative attributes and programmatic control

### Public API

- `configure(options)`
- `setAscii(ascii)`
- `setMessage(text)`
- `setShape(name)`
- `setPoints(points)`
- `run(command, payload)`
- `getState()`
- `startCycle()`, `converge()`, `hold()`, `explode()`, `scatter()`
- `pause()`, `resume()`, `destroy()`

### Events

- `axi-ambient:ready`
- `axi-ambient:phase-change`
- `axi-ambient:config-change`
- `axi-ambient:command-result`
- `axi-ambient:destroyed`

## `agent-blackboard`

`<agent-blackboard>` is a single-file layered visual board for agent-driven UI overlays and media.

It supports:

- scene layers (`background`, `media`, `vector`, `text`, `ui`, `overlay`)
- text, box/card, SVG, image, screenshot, YouTube, list, table, timer, progress, and input objects
- shapes (`line`, `arrow`, `rect`, `circle`, `path`)
- lightweight transitions
- protocol parsing from hidden lines
- emitted user actions through `blackboard:action`
- an optional embedded `axi-ambient` background

### Protocol

```text
blackboard:<agentId>:<userId>:<base64url(JSON)>
```

Inside this repository, the component parses and applies the payload, but it does **not** implement sender authorization, participant validation, or chat interception. Those concerns belong to the host integration layer.

### Public API

- `clear()`, `clearLayer(layer)`
- `setTheme(name)`, `setBackground(params)`, `setLayout(name)`
- `applyCommand(cmd)`, `applyCommands(payload)`
- `processProtocolLine(line)`
- `getState()`, `destroy()`
- `setupAmbient(options)`, `removeAmbient()`, `showAmbient()`, `hideAmbient()`

### Events

- `blackboard:ready`
- `blackboard:action`
- `blackboard:export`
- `blackboard:destroyed`

## MiniSDK

`createBlackboardSDK(agentId, options)` produces a fluent helper that can either:

- build JSON payloads,
- emit encoded protocol lines, or
- apply directly to a blackboard element.

```js
import { createBlackboardSDK } from "./agent-blackboard.mjs";

const sdk = createBlackboardSDK("quiz-master");

sdk.clear()
  .theme("quiz")
  .text("title", "Quiz Time!", {
    geometry: { x: 40, y: 20, width: 400 },
    style: { fontSize: "32px", fontWeight: "700" },
  })
  .timer("timer", 30, {
    geometry: { x: 40, y: 80, width: 180 },
    label: "Time left",
  })
  .askChoice("answer", "Choose one:", {
    options: ["A", "B", "C"],
    geometry: { x: 40, y: 160, width: 280 },
  })
  .applyTo(document.getElementById("bb"));
```

Implemented SDK helpers include:

- `toAll()`, `toUser(userId)`
- `command()`, `batch()`, `build()`, `emit()`, `applyTo()`
- `clear()`, `theme()`, `background()`, `exportImage()`
- `text()`, `typeText()`, `box()`, `image()`, `svg()`, `screenshot()`, `youtubeSegment()`, `table()`, `list()`, `timer()`, `progress()`
- `askText()`, `askPrivateText()`, `askChoice()`, `askMultiChoice()`, `askVote()`, `askReaction()`, `closeInput()`

## Demo highlights

The current demo starts empty and includes:

- closed-by-default accordion sections
- a viewport-fitted blackboard stage on the left
- random-by-default placement for newly added blackboard objects
- right-click content creation directly on the blackboard stage
- add / select / drag / delete flows for blackboard objects
- component-owned selection popup that edits and replays the remembered source command for the selected blackboard object
- popup-based custom element creation
- protocol and SDK scenarios reachable from the board context menu
- a separate ambient playground that starts empty and rebuilds from slider-driven behavior, timing, particle, and uploaded-ASCII settings so the selected target reconverges immediately

## Repository structure

```text
.
├── axi-ambient.mjs                  # root wrapper
├── agent-blackboard.mjs             # root wrapper
├── demo.html                        # root wrapper -> demo/index.html
├── components
│   ├── axi-ambient
│   │   └── index.mjs
│   └── agent-blackboard
│       └── index.mjs
└── demo
    ├── index.html
    ├── styles.css
    ├── app.mjs
    ├── blackboard-editor.mjs
    ├── ambient-playground.mjs
    └── presets.mjs
```

## Repository documents

- `docs/DS.md` — design summary and contract boundaries
- `docs/SPEC.md` — implemented specification surface
- `docs/COVERAGE.md` — honest coverage matrix with complete/partial/gap status

## Current limits

- `scene.layout` is not yet a full automatic layout engine for blackboard objects
- `scene.exportImage` emits an event, but does not rasterize the scene itself
- no built-in WebMeet interceptor exists in this repository
- no built-in asset registry or screenshot service exists in this repository
- `axi-ambient` does not yet implement SVG-raster target sampling
