import { alphaPresets, asciiTargets } from "./presets.mjs";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mixHex(left, right, amount) {
  const a = left.replace("#", "");
  const b = right.replace("#", "");
  const av = [parseInt(a.slice(0, 2), 16), parseInt(a.slice(2, 4), 16), parseInt(a.slice(4, 6), 16)];
  const bv = [parseInt(b.slice(0, 2), 16), parseInt(b.slice(2, 4), 16), parseInt(b.slice(4, 6), 16)];
  return `#${av.map((value, index) => Math.round(value + (bv[index] - value) * amount).toString(16).padStart(2, "0")).join("")}`;
}

function paletteForPreset(name, fallback) {
  const presets = {
    custom: fallback,
    warm: { base: "#fdba74", shape: "#fff7ed", explode: "#ea580c" },
    ice: { base: "#93c5fd", shape: "#eff6ff", explode: "#0ea5e9" },
    sunrise: { base: "#f472b6", shape: "#fef3c7", explode: "#fb7185" },
    motivation: { base: "#a78bfa", shape: "#ffffff", explode: "#f59e0b" },
  };
  return presets[name] || fallback;
}

function buildPalette(hex) {
  return [mixHex(hex, "#ffffff", 0.62), hex, mixHex(hex, "#111827", 0.18)];
}

function holdConfig(mode, settings) {
  return {
    static: { mode: "static", jitterAmplitude: 0, jitterSpeed: 0, spreadRadius: settings.spread },
    jitter: { mode: "jitter", jitterAmplitude: settings.driftAmplitude, jitterSpeed: settings.driftSpeed, spreadRadius: settings.spread },
    orbit: { mode: "orbit", jitterAmplitude: settings.driftAmplitude * 0.8, jitterSpeed: settings.driftSpeed * 1.1, spreadRadius: settings.spread },
    "flow-on-shape": { mode: "flow-on-shape", jitterAmplitude: settings.driftAmplitude * 0.7, jitterSpeed: settings.driftSpeed, spreadRadius: settings.spread },
  }[mode] || { mode: "jitter", jitterAmplitude: settings.driftAmplitude, jitterSpeed: settings.driftSpeed, spreadRadius: settings.spread };
}

function explosionConfig(mode) {
  return {
    radial: { mode: "radial", force: 1.8, spread: 0.28 },
    random: { mode: "random", force: 2.15, spread: 0.45 },
    directional: { mode: "directional", force: 1.8, spread: 0.34, direction: { x: 1, y: -0.2 } },
    "burst-wave": { mode: "burst-wave", force: 2.05, spread: 0.4, stagger: 0.36 },
  }[mode] || { mode: "burst-wave", force: 2.05, spread: 0.4, stagger: 0.36 };
}

function convergeConfig(force) {
  return {
    force,
    distanceFactor: clamp(force * 0.006, 0.01, 0.08),
    maxVelocity: clamp(force * 1.9, 6, 24),
  };
}

export class AmbientPlayground {
  constructor({ root, placeholder, meta, getSettings, onStatus }) {
    this.root = root;
    this.placeholder = placeholder;
    this.meta = meta;
    this.getSettings = getSettings;
    this.onStatus = onStatus;
    this.element = null;
  }

  ensureElement({ reset = false } = {}) {
    if (reset) this.teardownElement();
    if (this.element) return this.element;
    const element = document.createElement("axi-ambient");
    element.style.width = "100%";
    element.style.height = "100%";
    this.root.innerHTML = "";
    this.root.appendChild(element);
    this.placeholder.classList.add("hidden");
    this.element = element;
    this.element.pause();
    this.bindEvents();
    this.renderState();
    return element;
  }

  teardownElement() {
    if (!this.element) return;
    this.element.destroy?.();
    this.element.remove();
    this.element = null;
  }

  bindEvents() {
    if (!this.element) return;
    this.element.addEventListener("axi-ambient:phase-change", () => this.renderState());
    this.element.addEventListener("axi-ambient:config-change", () => this.renderState());
  }

  remove() {
    this.teardownElement();
    this.root.innerHTML = "";
    this.placeholder.classList.remove("hidden");
    this.meta.textContent = "No ambient scene created yet.";
    this.onStatus("Ambient scene removed.");
  }

  onShow() {
    if (!this.element) return;
    setTimeout(() => this.element?._resize?.(), 60);
  }

  runTrigger(trigger, autoStart = false) {
    if (!this.element) return;
    const action = () => {
      this.element.resume();
      if (autoStart) this.element.startCycle();
      else if (trigger === "converge") this.element.converge();
      else if (trigger === "hold") this.element.hold();
      else if (trigger === "explode") this.element.explode();
    };
    requestAnimationFrame(() => requestAnimationFrame(action));
  }

  applySettings({ trigger = null, autoStart = false, reset = false } = {}) {
    const element = this.ensureElement({ reset });
    const settings = this.getSettings();
    const alpha = alphaPresets[settings.alpha] || alphaPresets.vertical;

    if (settings.target === "ascii-axi") {
      element.setAscii(asciiTargets.axi);
    } else if (settings.target === "ascii-research") {
      element.setAscii(asciiTargets.research);
    } else if (settings.target === "library-ascii") {
      element.setAscii(settings.libraryAscii || asciiTargets.axi);
    } else if (settings.target === "uploaded-ascii") {
      element.setAscii(settings.uploadedAscii || asciiTargets.axi);
    } else if (settings.target === "message") {
      element.setMessage("Executable Research");
    } else {
      element.setShape(settings.target);
    }

    const paletteSeed = paletteForPreset(settings.palettePreset, {
      base: settings.baseColor,
      shape: settings.shapeColor,
      explode: settings.explodeColor,
    });

    element.configure({
      speed: settings.speed,
      intensity: settings.intensity,
      particle: {
        count: settings.density,
        sizeMin: settings.sizeMin,
        sizeMax: Math.max(settings.sizeMin + 0.1, settings.sizeMax),
        sizeOnHold: settings.sizeOnHold,
        sizeOnExplode: Math.max(settings.sizeOnHold + 0.15, settings.sizeOnHold * 1.1),
        renderShape: settings.particleShape,
        colorMode: settings.colorMode,
        palette: buildPalette(paletteSeed.base),
        colorOnShape: buildPalette(paletteSeed.shape),
        colorOnExplode: buildPalette(paletteSeed.explode),
        color: paletteSeed.base,
      },
      converge: convergeConfig(settings.pull),
      cycle: {
        auto: true,
        loop: true,
        chaosDuration: settings.chaosDuration,
        convergeDuration: settings.convergeDuration,
        holdDuration: settings.holdDuration,
        explodeDuration: settings.explodeDuration,
        returnDuration: Math.max(180, Math.round(settings.explodeDuration * 0.5)),
        explodeEnabled: true,
      },
      hold: holdConfig(settings.hold, settings),
      explosion: explosionConfig(settings.explosion),
      alphaField: alpha.alphaField,
      alphaMasks: alpha.alphaMasks,
    });

    this.runTrigger(trigger, autoStart);

    this.renderState();
    this.onStatus(`Ambient settings applied: <strong>${settings.target}</strong>, density <strong>${settings.density}</strong>, speed <strong>${settings.speed.toFixed(1)}</strong>x.`);
  }

  resetAndApply({ trigger = "converge", autoStart = false } = {}) {
    this.applySettings({ trigger, autoStart, reset: true });
  }

  start() {
    this.resetAndApply({ autoStart: true });
    this.onStatus("Ambient cycle started.");
  }

  converge() {
    this.resetAndApply({ trigger: "converge" });
  }

  hold() {
    this.resetAndApply({ trigger: "hold" });
  }

  explode() {
    this.resetAndApply({ trigger: "explode" });
  }

  scatter() {
    const element = this.ensureElement();
    element.resume();
    element.scatter();
    this.renderState();
    this.onStatus("Ambient returned to chaos.");
  }

  pause() {
    const element = this.ensureElement();
    element.pause();
    this.renderState();
    this.onStatus("Ambient paused.");
  }

  resume() {
    const element = this.ensureElement();
    element.resume();
    this.renderState();
    this.onStatus("Ambient resumed.");
  }

  renderState() {
    if (!this.element) {
      this.meta.textContent = "No ambient scene created yet.";
      return;
    }
    const state = this.element.getState();
    this.meta.innerHTML = `
      <strong>Phase:</strong> ${state.phase}<br />
      <strong>Particles:</strong> ${state.particleCount}<br />
      <strong>Targets:</strong> ${state.targetCount}<br />
      <strong>Paused:</strong> ${state.paused ? "yes" : "no"}
    `;
  }
}
