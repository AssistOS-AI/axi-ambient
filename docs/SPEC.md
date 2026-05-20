# Implementation Specification — `axi-ambient` and `agent-blackboard`

This document describes the implemented contract surface in the repository. It is intentionally strict about what is present in code today and what is still only an integration expectation or future extension.

---

## 1. `axi-ambient`

### 1.1 Goal

`<axi-ambient>` is a standalone web component exposed through the root wrapper `axi-ambient.mjs` and implemented in `components/axi-ambient/index.mjs`. It renders a particle-based animated background on a Canvas 2D surface, keeps normal DOM content above the animation through a `<slot>`, and exposes both declarative and programmatic control.

### 1.2 Delivery and runtime model

- root wrapper: `axi-ambient.mjs`
- source file: `components/axi-ambient/index.mjs`
- no external runtime dependency
- no required build step
- Shadow DOM encapsulation
- Canvas 2D renderer
- overlay content through slotted DOM

### 1.3 Internal modules

The file is internally organized around the following classes:

- `AlphaField`
- `TargetSampler`
- `StateController`
- `ParticleEngine`
- `Renderer2D`
- `AxiAmbientElement`

This structure is part of the implementation design, but only `AxiAmbientElement` is public API.

### 1.4 Phase model

Implemented phases:

- `chaos`
- `converge`
- `hold`
- `explode`
- `return`

Default automatic flow:

```text
chaos -> converge -> hold -> explode -> return -> chaos
```

Manual methods such as `converge()`, `hold()`, `explode()`, and `scatter()` force a phase and disable auto-cycle until `startCycle()` is called again.

### 1.5 Target modes

Implemented target-generation modes:

- `ascii`
- `text`
- `shape`
- `points`

Implemented mathematical `shape` variants:

- `circle`
- `spiral`
- `wave`
- `grid`

Not implemented yet:

- `svg-raster`

### 1.6 Particle configuration

The component supports the following implemented particle controls through `configure()`:

- particle count
- fixed size or distributed size (`random`, `uniform`, `gaussian`, `weighted`)
- fixed color or palette-based color modes (`fixed`, `random-palette`, `gradient`, `by-state`)
- per-state palette switching for normal/shape/explode phases
- base alpha
- size multiplier during hold and explode

### 1.7 Alpha field and local masks

Implemented global alpha field types:

- `vertical`
- `horizontal`
- `radial`
- `linear`

Implemented local mask behavior:

- normalized box masks
- per-mask target alpha
- feathered edge falloff

Effective draw alpha is computed from:

```text
particle alpha * state alpha * global alpha field * local mask contribution
```

### 1.8 Declarative attributes

Observed attributes:

- `effect`
- `ascii`
- `shape`
- `message`
- `density`
- `speed`
- `intensity`
- `interactive`
- `explode`
- `theme`
- `paused`
- `config`

`effect="ambient"` currently maps to `shape` mode with a default `wave` target.

### 1.9 Public API

Implemented methods:

- `configure(options)`
- `setAscii(ascii)`
- `setMessage(text)`
- `setShape(name)`
- `setPoints(points)`
- `run(command, payload)`
- `getState()`
- `startCycle()`
- `converge()`
- `hold()`
- `explode()`
- `scatter()`
- `pause()`
- `resume()`
- `destroy()`

### 1.10 Events

Implemented events:

- `axi-ambient:ready`
- `axi-ambient:phase-change`
- `axi-ambient:config-change`
- `axi-ambient:command-result`
- `axi-ambient:destroyed`

### 1.11 Motion and visibility handling

Implemented runtime behavior:

- `ResizeObserver` resizes the canvas to the host box
- `IntersectionObserver` pauses the RAF loop when the element is not visible
- `prefers-reduced-motion` is observed and folded into `motion: "auto"`
- `devicePixelRatio` is capped at `2`

Supported motion modes through configuration:

- `auto`
- `reduce`
- `static`
- `off`

### 1.12 Known limits

- no SVG-raster target sampling yet
- no arbitrary path-mask alpha field yet
- no neighbor-grid optimization layer yet
- no semantic fallback content is injected automatically for text/ASCII targets

---

## 2. `agent-blackboard`

### 2.1 Goal

`<agent-blackboard>` is a standalone web component exposed through the root wrapper `agent-blackboard.mjs` and implemented in `components/agent-blackboard/index.mjs`. It renders a layered DOM scene controlled through commands or through a text protocol line that can be routed by a host application such as WebMeet.

### 2.2 Delivery and runtime model

- root wrapper: `agent-blackboard.mjs`
- source file: `components/agent-blackboard/index.mjs`
- no external runtime dependency
- no required build step
- Shadow DOM encapsulation
- DOM scene with layered absolute-positioned objects

### 2.3 Scene model

Implemented layers:

- `background`
- `media`
- `vector`
- `text`
- `ui`
- `overlay`

Each rendered object is stored by stable `id` inside the internal `SceneManager.objects` map.

### 2.4 Protocol line

Implemented protocol format:

```text
blackboard:<agentId>:<userId>:<base64url(JSON)>
```

Meaning inside the component:

- `agentId` becomes `host.agentId`
- `userId` becomes `host.boardUserId`
- the payload is base64url-decoded, parsed as JSON, and executed
- `correlationId` is stored when present

The component can parse and apply the protocol line. It does **not** validate whether the sender is authorized to use that `agentId` or whether `userId` is valid in a meeting roster.

### 2.5 Payload model

The implemented payload path supports:

- a single command object, or
- a batch payload with `commands`

Batch payload fields that are meaningfully consumed:

- `mode`
- `commands`
- `correlationId`

`mode: "atomic"` is implemented, but the rollback mechanism is shallow: it snapshots current objects and theme, then attempts to restore them on failure. It should not be treated as a durable scene transaction engine.

### 2.6 Command structure

Command fields consumed by the implementation include:

- `op`
- `id`
- `type`
- `layer`
- `content`
- `geometry`
- `style`
- `timing`
- `transition`
- `ttl`

Not every field matters for every operation, but these are the supported low-level knobs on the command surface.

### 2.7 Supported operations

#### Scene

- `scene.clear`
- `scene.clearLayer`
- `scene.theme`
- `scene.background`
- `scene.layout`
- `scene.exportImage`
- `scene.restore`

#### Object lifecycle

- `object.create`
- `object.update`
- `object.move`
- `object.resize`
- `object.transform`
- `object.hide`
- `object.show`
- `object.delete`

#### Text

- `text.show`
- `text.update`
- `text.append`
- `text.highlight`
- `text.clear`

#### Shapes

- `shape.line`
- `shape.arrow`
- `shape.rect`
- `shape.circle`
- `shape.path`
- `shape.update`

#### SVG

- `svg.show`
- `svg.replace`
- `svg.highlight`
- `svg.zoom`
- `svg.pan`

#### Media

- `image.show`
- `image.replace`
- `image.highlight`
- `screenshot.show`
- `youtube.load`
- `youtube.play`
- `youtube.segment`
- `youtube.pause`
- `youtube.seek`
- `media.caption`
- `media.remove`

#### Lists and tables

- `list.show`
- `list.add`
- `list.update`
- `list.reveal`
- `list.remove`
- `table.show`
- `table.updateRow`
- `table.updateCell`
- `table.sort`

#### Timer and progress

- `timer.show`
- `timer.start`
- `timer.pause`
- `timer.resume`
- `timer.stop`
- `timer.reset`
- `progress.show`
- `progress.update`

#### Input

- `input.text`
- `input.privateText`
- `input.choice`
- `input.multiChoice`
- `input.vote`
- `input.reaction`
- `input.close`
- `input.status`
- `input.clear`

### 2.8 Object types

Implemented object types:

- `text`
- `box`
- `image`
- `svg`
- `line`
- `arrow`
- `rect`
- `circle`
- `path`
- `table`
- `list`
- `timer`
- `progress`
- `iframe`
- `input`

Generic object content is rendered as plain text for supported generic containers such as `box`. The component does not expose arbitrary HTML injection for generic content objects.

### 2.9 Geometry and layout

Implemented geometry fields:

- `x`
- `y`
- `width`
- `height`
- `right`
- `bottom`
- `align`
- `anchor`
- `rotation`
- `zIndex`

Important current limitation:

- `scene.layout` changes the scene container display mode (`block`, `grid`, or `flex` variants), but rendered objects remain absolutely positioned inside layer containers. This means `scene.layout` is **not** currently a true automatic layout engine.

### 2.10 Transitions

Implemented transition types:

- `fadeIn`
- `fadeOut`
- `slideIn`
- `slideOut`
- `scaleIn`
- `scaleOut`
- `smoothMove`
- `typewriter`
- `draw`
- `pulse`
- `flash`
- `shake`

These are lightweight client-side effects, not a full animation timeline system.

### 2.11 Themes

Implemented themes:

- `formal`
- `playful`
- `quiz`
- `court`
- `mystery`
- `classroom`
- `minimal`

Themes are implemented through CSS custom properties applied to the component host.

### 2.12 Media and SVG behavior

Current behavior:

- SVG content is sanitized client-side before insertion
- scripts, `foreignObject`, embedded objects, `iframe`, `link`, `meta`, and event-handler attributes are stripped
- YouTube embeds are inserted as iframes and now include `enablejsapi=1` so pause/seek/play messaging can work against the embedded player

The component does not implement a remote screenshot service, asset registry, or content trust policy by itself.

### 2.13 Input and user actions

Implemented input families:

- text
- private text
- single choice
- multi choice
- vote
- reaction

Implemented emitted event:

```js
blackboard:action
```

with detail fields:

- `source`
- `agentId`
- `boardUserId`
- `sourceUserId`
- `sourceDisplayName`
- `inputId`
- `action`
- `value`
- `correlationId`
- `timestamp`

`input.vote` now supports local result rendering in the component, but multi-user vote aggregation still depends on the host application routing real user identities and results.

### 2.14 Public API

Implemented methods:

- `clear()`
- `clearLayer(layer)`
- `setTheme(name)`
- `setBackground(params)`
- `setLayout(name)`
- `applyCommand(cmd)`
- `applyCommands(payload)`
- `processProtocolLine(line)`
- `getState()`
- `destroy()`
- `setupAmbient(options)`
- `removeAmbient()`
- `showAmbient()`
- `hideAmbient()`

### 2.15 Events

Implemented events:

- `blackboard:ready`
- `blackboard:action`
- `blackboard:export`
- `blackboard:destroyed`

`scene.exportImage` maps to `blackboard:export`; it does not generate an image asset itself.

### 2.16 MiniSDK

`createBlackboardSDK(agentId, options)` builds protocol payloads or applies them directly to a blackboard instance.

Implemented SDK methods:

- addressing: `toAll()`, `toUser(userId)`
- low-level: `command()`, `batch()`, `build()`, `emit()`, `applyTo()`
- scene: `clear()`, `theme()`, `background()`, `exportImage()`
- content: `text()`, `typeText()`, `box()`, `image()`, `svg()`, `screenshot()`, `youtubeSegment()`, `table()`, `list()`, `timer()`, `progress()`
- input: `askText()`, `askPrivateText()`, `askChoice()`, `askMultiChoice()`, `askVote()`, `askReaction()`, `closeInput()`

`table()` now accepts either:

- an array of rows plus `options.headers`, or
- a structured object `{ headers, rows }`

### 2.17 Convenience ambient bridge

`setupAmbient()` embeds an `axi-ambient` element behind the board scene. This is a repository convenience for combined demos and lightweight integrations. It should not be mistaken for a general-purpose plugin or composition framework.

### 2.18 Known limits

- no built-in WebMeet interceptor
- no agent/user authorization
- no full scene persistence or restoration
- no built-in export rasterizer
- no true automatic layout engine despite the `scene.layout` command name
