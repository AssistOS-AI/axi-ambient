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

---

# agent-blackboard — Specificație implementată (v1)

## Obiectiv

`<agent-blackboard>` este un Web Component standalone, livrat în `agent-blackboard.mjs`, fără dependențe externe, care oferă o suprafață vizuală partajată controlată de agenți AI prin mesaje tehnice în chatul WebMeet.

## Distribuție și integrare

- Single-file: `agent-blackboard.mjs`
- Fără build obligatoriu
- Fără framework obligatoriu
- Integrare programatică + protocol text

## Contract de control

Formatul protocolului:

```
blackboard:<agentId>:<userId>:<base64url(JSON)>
```

| Câmp | Descriere |
|------|-----------|
| agentId | Identificatorul agentului |
| userId | Participantul țintă (gol = blackboard comun) |
| base64url(JSON) | Payload cu comenzi vizuale |

Exemple:
- `blackboard:socrates::PAYLOAD` — blackboard comun
- `blackboard:socrates:user-ana:PAYLOAD` — blackboard individual

## Model intern

- `SceneManager` — gestionare scenă, obiecte, straturi
- `ThemeManager` — teme vizuale prin CSS variables
- `TransitionEngine` — animații și tranziții
- `AgentBlackboardElement` — lifecycle, API public, protocol parsing

## Straturi vizuale

| Strat | Conținut |
|-------|----------|
| background | Fundaluri, culori, imagini ambientale |
| media | YouTube, imagini, capturi, embeds |
| vector | SVG-uri, linii, săgeți, forme |
| text | Titluri, subtitrări, explicații |
| ui | Timer-e, tabele, liste, inputuri |
| overlay | Highlight-uri, efecte, elemente temporare |

## Tipuri de obiecte

`text`, `box`, `image`, `svg`, `line`, `arrow`, `rect`, `circle`, `path`, `table`, `list`, `timer`, `progress`, `iframe`, `input`

## Operații suportate

### Scenă
`scene.clear`, `scene.clearLayer`, `scene.theme`, `scene.background`, `scene.layout`, `scene.exportImage`, `scene.restore`

### Obiecte
`object.create`, `object.update`, `object.move`, `object.resize`, `object.transform`, `object.hide`, `object.show`, `object.delete`

### Text
`text.show`, `text.update`, `text.append`, `text.highlight`, `text.clear`

### Forme
`shape.line`, `shape.arrow`, `shape.rect`, `shape.circle`, `shape.path`, `shape.update`

### SVG
`svg.show`, `svg.replace`, `svg.highlight`, `svg.zoom`, `svg.pan`

### Media
`image.show`, `image.replace`, `image.highlight`, `screenshot.show`, `youtube.load`, `youtube.play`, `youtube.segment`, `youtube.pause`, `youtube.seek`, `media.caption`, `media.remove`

### Liste și tabele
`list.show`, `list.add`, `list.update`, `list.reveal`, `list.remove`, `table.show`, `table.updateRow`, `table.updateCell`, `table.sort`

### Timer și progres
`timer.show`, `timer.start`, `timer.pause`, `timer.resume`, `timer.stop`, `timer.reset`, `progress.show`, `progress.update`

### Input
`input.text`, `input.privateText`, `input.choice`, `input.multiChoice`, `input.vote`, `input.reaction`, `input.close`, `input.status`, `input.clear`

## Tranziții

`fadeIn`, `fadeOut`, `slideIn`, `slideOut`, `scaleIn`, `scaleOut`, `smoothMove`, `typewriter`, `draw`, `pulse`, `flash`, `shake`

## Teme vizuale

`formal`, `playful`, `quiz`, `court`, `mystery`, `classroom`, `minimal`

## API public

- `clear()`, `clearLayer(layer)`
- `setTheme(name)`, `setBackground(params)`, `setLayout(name)`
- `applyCommand(cmd)`, `applyCommands(payload)`
- `processProtocolLine(line)`
- `getState()`, `destroy()`
- `setupAmbient(options)`, `removeAmbient()`, `showAmbient()`, `hideAmbient()`

## Evenimente

- `blackboard:ready`
- `blackboard:action` — acțiuni utilizator (input, choice, vote, reaction)
- `blackboard:export` — cerere export imagine
- `blackboard:destroyed`

## MiniSDK

Funcția `createBlackboardSDK(agentId, options)` produce un obiect SDK cu API fluent:

```js
const sdk = createBlackboardSDK("socrates");
sdk.clear()
  .theme("quiz")
  .text("title", "Quiz Time!", { geometry: { x: 40, y: 20 }, style: { fontSize: "32px" } })
  .timer("timer", 60, { geometry: { x: 40, y: 80 } })
  .askChoice("answer", "Choose:", { options: ["A", "B", "C"] })
  .applyTo(blackboardEl);
```

SAU emite linie protocol:

```js
const line = sdk.emit(); // "blackboard:socrates::base64url..."
```

## Integrare cu axi-ambient

`<agent-blackboard>` poate include `<axi-ambient>` ca fundal animat:

```js
bb.setupAmbient({ effect: "ambient", density: 500, speed: 0.7 });
bb.hideAmbient();
bb.showAmbient();
bb.removeAmbient();
```

## Securitate

- SVG sanitizare strictă (script-uri, event handlers, foreignObject eliminate)
- HTML arbitrar nu se execută
- Validare operații cunoscute
- Payload JSON validat
