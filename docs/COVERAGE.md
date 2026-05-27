# Coverage Review

This document tracks the current implementation coverage against the intended component surfaces. Status values are intentionally conservative:

- **Complete** — implemented and exercised in the repository
- **Partial** — implemented in a narrower way than the full product ambition suggests
- **Gap** — not implemented in this repository
- **External** — expected to exist outside these component files

---

## 1. `axi-ambient`

| Capability | Status | Notes |
| --- | --- | --- |
| Single-file delivery at the integration edge | Complete | Consumed through root `axi-ambient.mjs`, implemented in `components/axi-ambient/index.mjs`. |
| Zero external dependencies | Complete | No framework or runtime dependency required. |
| Canvas 2D renderer | Complete | `Renderer2D` draws particles on a canvas. |
| Shadow DOM encapsulation | Complete | Overlay content is exposed through `<slot>`. |
| Explicit phase machine | Complete | `chaos`, `converge`, `hold`, `explode`, `return`. |
| Automatic cycle control | Complete | Configurable through `cycle` options. |
| Manual phase forcing | Complete | Public methods are implemented. |
| ASCII target sampling | Complete | Weighted density and character map are implemented. |
| Text target sampling | Complete | Uses offscreen canvas sampling. |
| Mathematical shape targets | Complete | `circle`, `spiral`, `wave`, `grid`, `heart`, `star`, `infinity`, `speech`, `rocket`, `trophy`, `smile`, `arrow-up`, `network`, `community`. |
| Explicit point targets | Complete | `setPoints()` and `mode: "points"` are implemented. |
| SVG-raster target sampling | Gap | Not implemented yet. |
| Particle size distribution | Complete | Fixed, random, uniform, gaussian, weighted. |
| Palette and state-based coloring | Complete | Includes normal/shape/explode palette selection. |
| Alpha field gradients | Complete | `none`, `vertical`, `horizontal`, `radial`, `linear`. |
| Local alpha masks with feather | Complete | Implemented through normalized box masks. |
| Pointer interaction | Complete | Pointer repulsion is implemented when enabled. |
| Reduced-motion support | Complete | `auto`, `reduce`, `static`, `off` are supported. |
| `ResizeObserver` handling | Complete | Canvas is resized to the host box. |
| `IntersectionObserver` pause/resume | Complete | RAF loop pauses when not visible. |
| DPR cap | Complete | Device pixel ratio is capped to a safer range (`1` under reduced motion, otherwise `1.5`). |
| Target caching | Complete | `TargetSampler` caches generated point clouds. |
| Neighbor-grid optimization | Gap | No spatial optimization grid exists yet. |
| Public API surface | Complete | `configure`, setters, phase methods, lifecycle methods. |
| Event bus adapter (`axi-command`) | Complete | `run()` is wired through `axi-command`. |
| Demo control surface | Complete | The demo under `demo/` exposes live settings, imported ASCII library browsing, optional alpha presets, pulse/fixed cycle control, decomposition modes, and rebuilt-on-change previews. |

---

## 2. `agent-blackboard`

| Capability | Status | Notes |
| --- | --- | --- |
| Single-file delivery at the integration edge | Complete | Consumed through root `agent-blackboard.mjs`, implemented in `components/agent-blackboard/index.mjs`. |
| Zero external dependencies | Complete | No framework/runtime dependency required. |
| Six-layer scene | Complete | `background`, `media`, `vector`, `text`, `ui`, `overlay`. |
| Stable object IDs | Complete | Objects are stored in `SceneManager.objects`. |
| Protocol parsing | Complete | `processProtocolLine()` parses and applies protocol lines. |
| Agent identity validation | External | Must be handled by the host integration layer. |
| Target user validation | External | Must be handled by the host integration layer. |
| Hidden chat interception | External | Not implemented in the component itself. |
| Strict operation whitelist | Complete | `VALID_OPS` guards the handler surface. |
| Theme switching | Complete | Implemented through CSS variables. |
| Background switching | Complete | Solid color, gradient, image, and clear/reset behavior are supported. |
| Automatic scene layout engine | Partial | `scene.layout` changes container mode, but absolutely positioned objects are not auto-reflowed. |
| Scene export rasterization | Partial | `scene.exportImage` emits `blackboard:export`; it does not rasterize the scene. |
| Full scene restore | Partial | `scene.restore` restores theme/background only. |
| Generic box/card content rendering | Complete | Generic object content is now rendered as plain text. |
| Text operations | Complete | Show, update, append, highlight, clear. |
| Shape operations | Complete | Includes line, arrow, rect, circle, path, and update. |
| SVG sanitization | Complete | Removes risky tags and event-handler attributes. |
| Image operations | Complete | Show, replace, highlight. |
| Screenshot rendering | Partial | Renders provided screenshot content/URL only; capture pipeline is external. |
| YouTube embed control | Complete | Load/segment/play/pause/seek are wired with JS API-enabled embeds. |
| Lists | Complete | Show, add, update, reveal, remove. |
| List titles | Complete | Title metadata now flows into rendered lists. |
| Tables | Complete | Show, row update, cell update, sort. |
| Timer | Complete | Show, start, pause, resume, stop, reset. |
| Progress bar | Complete | Show and update are implemented. |
| Input text/private text | Complete | Emits `blackboard:action` on submit. |
| Input choice/multi-choice | Complete | Button-based selectors are implemented. |
| Input vote | Complete | Local result rendering now tracks actual votes. |
| Input reaction | Complete | Quick reactions are emitted and animated. |
| TTL auto-delete | Complete | `ttl` schedules deletion. |
| Atomic batch execution | Partial | Implemented, but rollback relies on a shallow snapshot. |
| Ambient background bridge | Complete | `setupAmbient`, `showAmbient`, `hideAmbient`, `removeAmbient`. |
| MiniSDK low-level builder | Complete | Build, emit, apply, and addressing helpers are implemented. |
| MiniSDK `progress()` | Complete | Added to match demo and README usage. |
| MiniSDK `askMultiChoice()` | Complete | Added to match supported input operation surface. |
| MiniSDK flexible `table()` input | Complete | Accepts rows array or `{ headers, rows }`. |
| Full WebMeet asset management | Gap | Not implemented in this repository. |
| Persisted scene state | Gap | Not implemented in this repository. |
| Demo editor surface | Complete | The demo under `demo/` now provides empty-start editing, board context-menu creation, component-owned selection editing, SDK flows, and ambient integration with reset-on-change behavior plus slider-driven particle/timing controls. |
