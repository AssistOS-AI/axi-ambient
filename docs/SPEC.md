# axi-ambient — Specificație implementată (v1)

## Obiectiv

`<axi-ambient>` este un Web Component standalone, livrat în `axi-ambient.mjs`, fără dependențe externe, pentru fundal animat pe Canvas 2D cu conținut suprapus prin `<slot>`.

## Distribuție și integrare

- Single-file: `axi-ambient.mjs`
- Fără build obligatoriu
- Fără framework obligatoriu
- Integrare declarativă (atribute) + programatică (metode)

## Model intern

- `ParticleEngine` — simulare particule
- `TargetSampler` — ASCII / text / shape / points
- `AlphaField` — gradient global + măști locale cu feather
- `StateController` — mașină de stări
- `Renderer2D` — randare Canvas 2D
- `AxiAmbientElement` — lifecycle, observers, API public

## Mașină de stări

Stări active:

- `chaos`
- `converge`
- `hold`
- `explode`
- `return`

Flux implicit cu ciclu activ:

`chaos -> converge -> hold -> explode -> return -> chaos`

Manual control:

- `converge()`, `hold()`, `explode()`, `scatter()` forțează faza și opresc auto-cycle
- `startCycle()` reactivează auto-cycle

## Tipuri de țintă

- `ascii`
- `text`
- `shape` (`circle`, `spiral`, `wave`, `grid`)
- `points`

## Alpha field și măști

Tipuri `alphaField.type`:

- `vertical`
- `horizontal`
- `radial`
- `linear`

Compoziție alpha efectiv:

`effectiveAlpha = particle.alpha * stateAlpha * globalAlpha(x,y) * maskAlpha(x,y)`

## API public

- `configure(options)`
- `setAscii(ascii)`
- `setMessage(text)`
- `setShape(name)`
- `setPoints(points)`
- `run(command, payload)` (adapter indirect)
- `getState()`
- `startCycle()`
- `converge()`
- `hold()`
- `explode()`
- `scatter()`
- `pause()`
- `resume()`
- `destroy()`

## API indirect pentru tehnologii target

Contractul de control indirect este stabil și versionabil (v1):

- namespace comenzi: `axi-command`
- namespace telemetrie: `axi-ambient:*`
- payload comenzi: `{ command: string, payload?: unknown }`
- rezultat comandă: `{ command, accepted }`

### Comenzi via event

Pe element:

- event input: `axi-command` (`detail: { command, payload }`)
- event output: `axi-ambient:command-result`

### Evenimente de runtime

- `axi-ambient:ready`
- `axi-ambient:phase-change`
- `axi-ambient:config-change`
- `axi-ambient:destroyed`

## Atribute declarative

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
- `config` (JSON)

## Compatibilitate și consum indirect

Componenta poate fi controlată:

1. direct, prin referință DOM + metode
2. indirect, prin event bus (recomandat pentru adaptoare framework)
3. declarativ, prin atribute + `config` JSON

## Performanță

- `requestAnimationFrame`
- `ResizeObserver`
- `IntersectionObserver`
- limitare `devicePixelRatio <= 2`
- cache target sampling

## Accesibilitate

- respectă `prefers-reduced-motion` când `motion: "auto"`
- modurile `reduce/static/off` se configurează prin `configure({ motion })`
