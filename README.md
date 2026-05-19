# axi-ambient

Web Component autonom (`<axi-ambient>`) pentru fundal animat pe canvas, cu particule care trec prin stări `chaos -> converge -> hold -> explode`, suport pentru ținte ASCII/text/shape/points și mască de transparență pe zone.

## Rulare rapidă

Deschide `demo.html` direct în browser (sau printr-un static server) și vei avea o pagină de test cu butoane pentru API.

```html
<script type="module" src="./axi-ambient.mjs"></script>

<axi-ambient id="bg" style="display:block;height:560px;">
  <section style="position:relative;z-index:1;padding:56px;color:white;">
    <h1>Axi Ambient</h1>
    <p>Fundal animat controlabil programatic.</p>
  </section>
</axi-ambient>
```

## API public

- `configure(options)`
- `setAscii(ascii)`
- `setMessage(text)`
- `setShape(name)`
- `startCycle()`
- `converge()`
- `hold()`
- `explode()`
- `scatter()`
- `pause()`
- `resume()`
- `destroy()`

## Fișiere principale

- `axi-ambient.mjs` — componenta completă (single-file, fără dependențe)
- `demo.html` — pagină statică de test (blackboard + butoane pentru toate funcționalitățile)
