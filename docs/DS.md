# DS — axi-ambient + agent-blackboard

## Introduction

This repository ships two standalone web components plus a demo consumer:

- root wrappers: `axi-ambient.mjs`, `agent-blackboard.mjs`, `demo.html`
- component sources: `components/axi-ambient/index.mjs`, `components/agent-blackboard/index.mjs`
- demo sources: `demo/index.html`, `demo/styles.css`, `demo/app.mjs`, `demo/blackboard-editor.mjs`, `demo/ambient-playground.mjs`, `demo/presets.mjs`

This DS captures the contract backbone for the repository as it exists today. It intentionally distinguishes between what the components themselves implement, what the demo adds on top as a local editing layer, and what still belongs to a surrounding host such as WebMeet.

## Core Content

### Repository shape

The repository remains intentionally simple at the integration edge:

- root entry points stay in the repository root,
- source code is grouped into `components/` and `demo/`,
- no build step is required to consume either component,
- no runtime framework dependency is required,
- the main integration surface is plain browser DOM.

The demo is allowed to be more feature-rich than the reusable components. Demo-only features, such as manual drag editing of rendered blackboard objects, do not automatically become component contract unless they are exposed as public API.

### `axi-ambient` contract boundary

`<axi-ambient>` is a self-contained ambient renderer that owns:

- particle simulation,
- target sampling from `ascii`, `text`, `shape`, or explicit `points`,
- alpha-field and local alpha-mask evaluation,
- a phase machine with `chaos`, `converge`, `hold`, `explode`, and `return`,
- Canvas rendering,
- lifecycle observers for resize, visibility, pointer input, and reduced-motion handling.

It exposes a declarative surface through HTML attributes and a programmatic surface through public methods such as `configure()`, `setAscii()`, `setMessage()`, `setShape()`, `startCycle()`, `converge()`, `hold()`, `explode()`, `scatter()`, `pause()`, `resume()`, and `destroy()`.

The component is responsible for the visual engine, not for semantic overlay content. If the target text or ASCII has semantic meaning for users, that meaning must still be represented in normal DOM content by the consuming application.

### `agent-blackboard` contract boundary

`<agent-blackboard>` is a DOM-rendered visual board that owns:

- a six-layer visual scene (`background`, `media`, `vector`, `text`, `ui`, `overlay`),
- object creation and mutation by stable object `id`,
- supported low-level operations across text, shapes, SVG, media, lists, tables, timers, progress, and input widgets,
- theme application through CSS custom properties,
- lightweight transitions,
- user action emission through `blackboard:action`,
- protocol parsing for `blackboard:<agentId>:<userId>:<base64url(JSON)>`.

The component does **not** own transport trust, agent identity validation, participant validation, or hidden-chat interception. Those responsibilities belong to the host integration layer. In this repository the component can parse a protocol line, but it does not verify whether the sender is authorized to use that `agentId`.

### Real protocol and payload scope

The protocol line format is stable at the component edge:

```text
blackboard:<agentId>:<userId>:<base64url(JSON)>
```

Within the component:

- `agentId` is stored on the host element for subsequent emitted events,
- `userId` is stored as `boardUserId`,
- the payload is decoded and interpreted as either a single command or a batch payload,
- `correlationId` is preserved when present.

The component currently assumes the payload was already admitted by a trusted caller. Strict authorization, rate limiting, participant existence checks, and chat suppression are outside this file and must be supplied by the embedding application.

### Demo boundary

`demo.html` is now treated as a serious consumer and test surface, not as an authoritative source of component semantics.

The demo adds:

- accordion-based editor panels,
- select-driven settings for mutually exclusive options,
- closed-by-default sections,
- stage placement presets with random-safe placement as the default add mode,
- blackboard creation from a stage-level context menu at the clicked position,
- component-owned blackboard selection with an internal popup editor that replays the remembered source command,
- direct drag editing on blackboard objects through the component itself,
- popup-based custom element creation,
- curated SDK, protocol, and ambient scenarios reachable from the board context menu,
- an empty-by-default start state for both the blackboard editor and the ambient playground,
- ambient setting changes that rebuild the demo scene and restart the selected pulse or fixed-shape cycle,
- a single Settings accordion that now owns all Ambient sliders,
- optional alpha presets with `none` as the default selection in the demo,
- pulse/fixed cycle control plus configurable decomposition modes (`explode`, `ordered`, `scatter`),
- stronger near-target roaming controls for hold motion type, radius, energy, and speed,
- uploaded ASCII targets, imported ASCII-library targets, and extended demo-facing predefined shape targets for ambient exploration.

These behaviors are valid for the demo, but they are not public API guarantees of the reusable components unless separately documented as such.

### Contract limits that must remain visible

- `agent-blackboard` supports `scene.layout`, but the current implementation only changes the scene container display mode; it is **not** a full auto-layout engine for absolutely positioned objects.
- `scene.exportImage` currently emits `blackboard:export`; it does not rasterize the scene by itself.
- `scene.restore` currently restores theme and background only, not a full object graph.
- `input.vote` now supports local result rendering in the component, but cross-user aggregation remains a host concern.
- `setupAmbient()` on `agent-blackboard` is a convenience bridge to embed `axi-ambient` behind the scene; it is not a generalized plugin system.
- `axi-ambient` does not yet implement `svg-raster` target sampling, arbitrary path masks, or spatial-neighbor optimization grids.

## Decisions & Questions

### Question #1: Why keep two standalone `.mjs` files instead of bundling them into one system?

Response:

The repository is intentionally organized around independently consumable components. `axi-ambient` solves background motion and phase-driven particle rendering, while `agent-blackboard` solves a structured visual scene with interactive DOM widgets and media embeds. Keeping them separate preserves their portability and makes the blackboard ambient background bridge an optional integration point instead of a hard dependency.

### Question #2: What is the correct split between `agent-blackboard` and a WebMeet interceptor?

Response:

The component contract stops at parsing and applying already-routed protocol lines. A real WebMeet integration still needs a chat interceptor that recognizes hidden messages, suppresses them from visible chat, validates sender identity and target user, and decides which blackboard instance receives the decoded payload. Documenting that split explicitly prevents the component from over-claiming transport- or trust-level guarantees it does not implement.

### Question #3: How real is the advertised security story for `agent-blackboard` inside this repository?

Response:

The real guarantees in this repository are narrower than the full product vision. The component validates operation names against known handlers, sanitizes incoming SVG markup, avoids arbitrary HTML execution for generic object content, and emits explicit events instead of silently swallowing interaction results. It does not, by itself, authorize agents, validate user targeting, or enforce server-side media policies.

### Question #4: Why keep DOM rendering for the blackboard instead of switching everything to Canvas or SVG?

Response:

The blackboard needs native DOM behavior for forms, lists, tables, timers, media embeds, and event handling. DOM rendering also makes the demo editor practical because rendered nodes can be inspected and repositioned directly. Canvas remains the better fit for `axi-ambient` because it draws many particles every frame and does not need embedded form controls.

### Question #5: What changed in the demo contract and why does that matter?

Response:

The previous demo behaved like a flat button wall and made many features look broken because it stacked unrelated elements into the same region and exposed invalid SDK flows. The revised demo is meant to be a more honest consumer: it spaces objects into zones by default, exposes mutually exclusive options as selects, adds editor-like inspection, and exercises protocol and SDK paths that actually match the current implementation.

### Question #6: Why is `scene.layout` documented as limited instead of being treated as a full feature?

Response:

The current `agent-blackboard` scene stores visual objects as absolutely positioned DOM elements inside layer containers. Changing the scene container to `grid` or `flex` does not automatically reflow those children into a useful layout system. The DS keeps that limitation explicit so downstream work can either implement a real layout engine later or avoid relying on a guarantee that does not yet exist.

### Question #7: Which behaviors remain intentionally out of scope for now?

Response:

Out-of-scope behaviors include full scene raster export, integrated WebMeet interception, authoritative private-routing security, generalized asset management, persistent scene restoration, and SVG-raster target sampling for `axi-ambient`. They may be added later, but the current contract must stay precise about the gap between the product vision and the code in this repository.
