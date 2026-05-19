const DEFAULT_CONFIG = {
  mode: "ascii",
  ascii: `
 #######
# AXI  #
# AMB. #
 #######
`,
  message: "AXI AMBIENT",
  shape: "circle",
  points: [],
  speed: 0.9,
  intensity: 0.65,
  interactive: true,
  motion: "auto",
  cycle: {
    auto: true,
    loop: true,
    chaosDuration: 1500,
    convergeDuration: 1700,
    holdDuration: 2200,
    explodeDuration: 1200,
    returnDuration: 420,
    explodeEnabled: true,
  },
  hold: {
    mode: "jitter",
    duration: 2200,
    jitterAmplitude: 1.4,
    jitterSpeed: 0.8,
  },
  explosion: {
    mode: "radial",
    force: 1.8,
    spread: 0.35,
    fade: 0.25,
    stagger: 0.2,
    direction: { x: 1, y: -0.2 },
  },
  particle: {
    count: 800,
    size: null,
    sizeMin: 0.8,
    sizeMax: 2.8,
    sizeDistribution: "random",
    sizeOnHold: 1.1,
    sizeOnExplode: 1.3,
    color: "#e2e8f0",
    palette: ["#ffffff", "#e0f2fe", "#93c5fd", "#60a5fa"],
    colorOnShape: ["#ffffff", "#bfdbfe", "#93c5fd"],
    colorOnExplode: ["#ffffff", "#fca5a5", "#fef08a"],
    colorMode: "random-palette",
    alphaBase: 0.75,
  },
  target: {
    densityMode: "weighted",
    charMap: { "#": 1, "@": 1.8, "*": 0.6, ".": 0.25 },
    cellSamples: 2,
    padding: 0.12,
  },
  alphaField: {
    type: "vertical",
    stops: [
      { pos: 0, alpha: 0.05 },
      { pos: 0.35, alpha: 0.12 },
      { pos: 1, alpha: 0.9 },
    ],
  },
  alphaMasks: [],
};

const PHASE = {
  CHAOS: "chaos",
  CONVERGE: "converge",
  HOLD: "hold",
  EXPLODE: "explode",
  RETURN: "return",
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / Math.max(1e-5, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function mergeDeep(base, extra) {
  if (!extra || typeof extra !== "object") return base;
  const output = Array.isArray(base) ? [...base] : { ...base };
  for (const [key, value] of Object.entries(extra)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      output[key] = mergeDeep(base?.[key] ?? {}, value);
    } else if (Array.isArray(value)) {
      output[key] = [...value];
    } else {
      output[key] = value;
    }
  }
  return output;
}

function parseColor(hex) {
  const safe = String(hex || "#ffffff").trim();
  const normalized = safe.startsWith("#") ? safe.slice(1) : safe;
  const compact = normalized.length === 3
    ? normalized.split("").map((c) => c + c).join("")
    : normalized.padEnd(6, "f").slice(0, 6);
  const int = Number.parseInt(compact, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function gaussianRandom() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function getDistributionSize(min, max, distribution) {
  if (distribution === "uniform") return (min + max) * 0.5;
  if (distribution === "gaussian") {
    const g = clamp((gaussianRandom() + 3) / 6, 0, 1);
    return lerp(min, max, g);
  }
  if (distribution === "weighted") {
    const r = Math.random() ** 2;
    return lerp(min, max, r);
  }
  return lerp(min, max, Math.random());
}

function parseBooleanAttribute(value, fallback = false) {
  if (value == null) return fallback;
  if (value === "" || value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function parseNumberAttribute(value, fallback, min = -Infinity, max = Infinity) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return clamp(num, min, max);
}

function getStops(stops, fallback) {
  const source = Array.isArray(stops) && stops.length ? stops : fallback;
  return [...source]
    .map((s) => ({
      pos: clamp(Number(s.pos), 0, 1),
      alpha: clamp(Number(s.alpha), 0, 1),
    }))
    .sort((a, b) => a.pos - b.pos);
}

class AlphaField {
  constructor(config) {
    this.configure(config);
  }

  configure(config) {
    this.config = config || {};
    this.stops = getStops(this.config.stops, DEFAULT_CONFIG.alphaField.stops);
    this.masks = Array.isArray(this.config.masks) ? this.config.masks : [];
    this.linear = this.config.linear || { x1: 0, y1: 0, x2: 1, y2: 1 };
  }

  _sampleStops(t) {
    if (!this.stops.length) return 1;
    if (t <= this.stops[0].pos) return this.stops[0].alpha;
    if (t >= this.stops[this.stops.length - 1].pos) return this.stops[this.stops.length - 1].alpha;
    for (let i = 1; i < this.stops.length; i += 1) {
      const left = this.stops[i - 1];
      const right = this.stops[i];
      if (t <= right.pos) {
        const local = (t - left.pos) / Math.max(1e-5, right.pos - left.pos);
        return lerp(left.alpha, right.alpha, local);
      }
    }
    return 1;
  }

  _global(nx, ny) {
    const type = this.config.type || "vertical";
    let t = ny;
    if (type === "horizontal") t = nx;
    if (type === "radial") {
      const dx = nx - 0.5;
      const dy = ny - 0.5;
      t = clamp(Math.sqrt(dx * dx + dy * dy) / 0.707, 0, 1);
    }
    if (type === "linear") {
      const { x1, y1, x2, y2 } = this.linear;
      const vx = x2 - x1;
      const vy = y2 - y1;
      const lenSq = Math.max(1e-5, vx * vx + vy * vy);
      t = clamp(((nx - x1) * vx + (ny - y1) * vy) / lenSq, 0, 1);
    }
    return this._sampleStops(t);
  }

  _maskAlpha(nx, ny) {
    let alpha = 1;
    for (const mask of this.masks) {
      const x = Number(mask.x ?? 0);
      const y = Number(mask.y ?? 0);
      const w = Math.max(1e-4, Number(mask.w ?? 0.1));
      const h = Math.max(1e-4, Number(mask.h ?? 0.1));
      const edge = clamp(Number(mask.feather ?? 0), 0, 0.5);
      const targetAlpha = clamp(Number(mask.alpha ?? 1), 0, 1);
      const innerX0 = x + w * edge;
      const innerX1 = x + w * (1 - edge);
      const innerY0 = y + h * edge;
      const innerY1 = y + h * (1 - edge);
      const dx = nx < innerX0 ? innerX0 - nx : nx > innerX1 ? nx - innerX1 : 0;
      const dy = ny < innerY0 ? innerY0 - ny : ny > innerY1 ? ny - innerY1 : 0;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = Math.max(1e-4, Math.min(w, h) * edge);
      const influence = edge === 0
        ? (nx >= x && nx <= x + w && ny >= y && ny <= y + h ? 1 : 0)
        : 1 - smoothstep(0, radius, dist);
      alpha *= lerp(1, targetAlpha, clamp(influence, 0, 1));
    }
    return alpha;
  }

  evaluate(x, y, width, height) {
    const nx = clamp(x / Math.max(1, width), 0, 1);
    const ny = clamp(y / Math.max(1, height), 0, 1);
    return clamp(this._global(nx, ny) * this._maskAlpha(nx, ny), 0, 1);
  }
}

class TargetSampler {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    this.cache = new Map();
  }

  _fitPoints(rawPoints, width, height, padding = 0.12) {
    if (!rawPoints.length) return [];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const p of rawPoints) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
    const sourceW = Math.max(1e-4, maxX - minX);
    const sourceH = Math.max(1e-4, maxY - minY);
    const targetW = width * (1 - padding * 2);
    const targetH = height * (1 - padding * 2);
    const scale = Math.min(targetW / sourceW, targetH / sourceH);
    const ox = (width - sourceW * scale) * 0.5;
    const oy = (height - sourceH * scale) * 0.5;
    return rawPoints.map((p) => ({
      x: (p.x - minX) * scale + ox,
      y: (p.y - minY) * scale + oy,
    }));
  }

  _downsample(points, wanted) {
    if (wanted <= 0 || points.length <= wanted) return points;
    const stride = points.length / wanted;
    const sampled = [];
    for (let i = 0; i < wanted; i += 1) sampled.push(points[Math.floor(i * stride)]);
    return sampled;
  }

  fromAscii(ascii, width, height, targetConfig, wantedCount) {
    const key = JSON.stringify(["ascii", ascii, width, height, targetConfig, wantedCount]);
    if (this.cache.has(key)) return this.cache.get(key);
    const linesRaw = String(ascii || "").split("\n");
    const lines = linesRaw.filter((line, i) => line.trim() || (i > 0 && i < linesRaw.length - 1));
    const gridW = Math.max(1, ...lines.map((line) => line.length));
    const gridH = Math.max(1, lines.length);
    const densityMode = targetConfig?.densityMode || "cell";
    const charMap = targetConfig?.charMap || {};
    const cellSamples = Math.max(1, Math.round(targetConfig?.cellSamples ?? 1));
    const raw = [];
    for (let y = 0; y < gridH; y += 1) {
      const row = lines[y] || "";
      for (let x = 0; x < gridW; x += 1) {
        const ch = row[x] || " ";
        if (ch === " ") continue;
        const weight = clamp(Number(charMap[ch] ?? 1), 0.1, 3);
        const samples = densityMode === "weighted"
          ? Math.max(1, Math.round(cellSamples * weight))
          : cellSamples;
        for (let i = 0; i < samples; i += 1) {
          raw.push({ x: x + Math.random(), y: y + Math.random() });
        }
      }
    }
    const fitted = this._fitPoints(raw, width, height, targetConfig?.padding ?? 0.12);
    const points = this._downsample(fitted, wantedCount);
    this.cache.set(key, points);
    return points;
  }

  fromText(text, width, height, wantedCount) {
    const key = JSON.stringify(["text", text, width, height, wantedCount]);
    if (this.cache.has(key)) return this.cache.get(key);
    const ctx = this.ctx;
    const cw = Math.max(64, Math.floor(width));
    const ch = Math.max(64, Math.floor(height));
    this.canvas.width = cw;
    this.canvas.height = ch;
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = "#000";
    const fontSize = Math.max(26, Math.floor(ch * 0.22));
    ctx.font = `700 ${fontSize}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(text || "AXI"), cw * 0.5, ch * 0.5);
    const image = ctx.getImageData(0, 0, cw, ch).data;
    const step = Math.max(2, Math.floor(Math.sqrt((cw * ch) / Math.max(200, wantedCount * 4))));
    const raw = [];
    for (let y = 0; y < ch; y += step) {
      for (let x = 0; x < cw; x += step) {
        const i = (y * cw + x) * 4 + 3;
        if (image[i] > 80) raw.push({ x, y });
      }
    }
    const points = this._downsample(raw, wantedCount);
    this.cache.set(key, points);
    return points;
  }

  fromShape(shape, width, height, wantedCount) {
    const key = JSON.stringify(["shape", shape, width, height, wantedCount]);
    if (this.cache.has(key)) return this.cache.get(key);
    const cx = width * 0.5;
    const cy = height * 0.5;
    const radius = Math.min(width, height) * 0.28;
    const points = [];
    const count = Math.max(100, wantedCount);
    const name = String(shape || "circle").toLowerCase();
    for (let i = 0; i < count; i += 1) {
      const t = i / count;
      const a = t * Math.PI * 2 * (name === "spiral" ? 6 : 1);
      if (name === "spiral") {
        const r = radius * (0.15 + t * 0.85);
        points.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
      } else if (name === "wave") {
        const x = lerp(width * 0.16, width * 0.84, t);
        const y = cy + Math.sin(t * Math.PI * 8) * radius * 0.5;
        points.push({ x, y });
      } else if (name === "grid") {
        const gx = 12;
        const gy = 8;
        const ix = i % gx;
        const iy = Math.floor(i / gx) % gy;
        points.push({
          x: width * 0.2 + (ix / (gx - 1)) * width * 0.6,
          y: height * 0.2 + (iy / (gy - 1)) * height * 0.6,
        });
      } else {
        points.push({ x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius });
      }
    }
    const out = this._downsample(points, wantedCount);
    this.cache.set(key, out);
    return out;
  }

  fromPoints(points, width, height, wantedCount, padding = 0.12) {
    const raw = (Array.isArray(points) ? points : [])
      .map((p) => ({ x: Number(p.x) || 0, y: Number(p.y) || 0 }))
      .map((p) => ({
        x: p.x >= 0 && p.x <= 1 ? p.x * width : p.x,
        y: p.y >= 0 && p.y <= 1 ? p.y * height : p.y,
      }));
    const fitted = this._fitPoints(raw, width, height, padding);
    return this._downsample(fitted, wantedCount);
  }
}

class StateController {
  constructor() {
    this.phase = PHASE.CHAOS;
    this.phaseTime = 0;
    this.auto = true;
    this.loop = true;
    this.explodeEnabled = true;
  }

  configure(cycle) {
    this.cycle = cycle;
    this.auto = !!cycle.auto;
    this.loop = !!cycle.loop;
    this.explodeEnabled = cycle.explodeEnabled !== false;
  }

  setPhase(phase, manual = false) {
    this.phase = phase;
    this.phaseTime = 0;
    if (manual) this.auto = false;
  }

  startCycle() {
    this.auto = true;
    this.phase = PHASE.CHAOS;
    this.phaseTime = 0;
  }

  tick(dt) {
    this.phaseTime += dt;
    if (!this.auto) return this.phase;
    if (this.phase === PHASE.CHAOS && this.phaseTime >= this.cycle.chaosDuration) {
      this.phase = PHASE.CONVERGE;
      this.phaseTime = 0;
    } else if (this.phase === PHASE.CONVERGE && this.phaseTime >= this.cycle.convergeDuration) {
      this.phase = PHASE.HOLD;
      this.phaseTime = 0;
    } else if (this.phase === PHASE.HOLD && this.phaseTime >= this.cycle.holdDuration) {
      if (this.explodeEnabled) {
        this.phase = PHASE.EXPLODE;
      } else if (this.loop) {
        this.phase = PHASE.CHAOS;
      }
      this.phaseTime = 0;
    } else if (this.phase === PHASE.EXPLODE && this.phaseTime >= this.cycle.explodeDuration) {
      this.phase = this.loop ? PHASE.RETURN : PHASE.HOLD;
      this.phaseTime = 0;
    } else if (this.phase === PHASE.RETURN && this.phaseTime >= (this.cycle.returnDuration ?? 420)) {
      this.phase = PHASE.CHAOS;
      this.phaseTime = 0;
    }
    return this.phase;
  }
}

class ParticleEngine {
  constructor() {
    this.particles = [];
    this.targetPoints = [];
    this.pointer = { x: 0, y: 0, active: false };
    this._seed = 1;
  }

  _rand() {
    this._seed = (this._seed * 1664525 + 1013904223) >>> 0;
    return this._seed / 0xffffffff;
  }

  configure(config) {
    this.config = config;
  }

  reset(width, height, colorGetter) {
    const count = Math.max(10, Math.floor(this.config.particle.count || 600));
    this.particles.length = 0;
    for (let i = 0; i < count; i += 1) {
      const size = this.config.particle.size ?? getDistributionSize(
        this.config.particle.sizeMin,
        this.config.particle.sizeMax,
        this.config.particle.sizeDistribution,
      );
      const color = colorGetter("base", i);
      this.particles.push({
        x: this._rand() * width,
        y: this._rand() * height,
        vx: (this._rand() - 0.5) * 0.4,
        vy: (this._rand() - 0.5) * 0.4,
        tx: this._rand() * width,
        ty: this._rand() * height,
        size,
        color,
        alpha: this.config.particle.alphaBase,
        seed: this._rand() * 10000,
        explodeDelay: this._rand() * this.config.explosion.stagger,
      });
    }
    this.assignTargets(this.targetPoints.length ? this.targetPoints : [{ x: width * 0.5, y: height * 0.5 }]);
  }

  assignTargets(points) {
    this.targetPoints = points.length ? points : this.targetPoints;
    if (!this.targetPoints.length || !this.particles.length) return;
    const offset = Math.floor(Math.random() * this.targetPoints.length);
    for (let i = 0; i < this.particles.length; i += 1) {
      const target = this.targetPoints[(i + offset) % this.targetPoints.length];
      this.particles[i].tx = target.x;
      this.particles[i].ty = target.y;
    }
  }

  update(dtMs, phase, stateTimeMs, width, height, colorGetter) {
    const dt = Math.min(0.035, dtMs / 1000);
    const speedMul = this.config.speed * (this.config._reduced ? 0.45 : 1);
      const damping = (phase === PHASE.CHAOS || phase === PHASE.RETURN) ? 0.97 : 0.92;
    for (let i = 0; i < this.particles.length; i += 1) {
      const p = this.particles[i];
      const toTargetX = p.tx - p.x;
      const toTargetY = p.ty - p.y;
      const dist = Math.hypot(toTargetX, toTargetY) + 1e-5;
      const nx = toTargetX / dist;
      const ny = toTargetY / dist;
      let ax = 0;
      let ay = 0;
      const drift = Math.sin((performance.now() * 0.0004 + p.seed) * 2);
      if (phase === PHASE.CHAOS || phase === PHASE.RETURN) {
        ax += Math.cos(p.seed + performance.now() * 0.001) * 0.35;
        ay += Math.sin(p.seed + performance.now() * 0.0013) * 0.35;
      }
      if (phase === PHASE.CONVERGE || phase === PHASE.HOLD || phase === PHASE.EXPLODE) {
        ax += nx * 1.4;
        ay += ny * 1.4;
      }
      if (phase === PHASE.HOLD) {
        const holdMode = this.config.hold.mode;
        const amp = this.config.hold.jitterAmplitude;
        if (holdMode === "orbit") {
          const a = p.seed + performance.now() * 0.0015 * this.config.hold.jitterSpeed;
          ax += Math.cos(a) * amp * 0.8;
          ay += Math.sin(a) * amp * 0.8;
        } else if (holdMode === "flow-on-shape") {
          ax += -ny * amp * 0.7;
          ay += nx * amp * 0.7;
        } else if (holdMode === "jitter") {
          ax += (this._rand() - 0.5) * amp;
          ay += (this._rand() - 0.5) * amp;
        }
        p.size = p.size * 0.96 + p.size * this.config.particle.sizeOnHold * 0.04;
      }
      if (phase === PHASE.EXPLODE && !this.config._reduced) {
        const elapsed = stateTimeMs / 1000;
        if (elapsed >= p.explodeDelay) {
          const force = this.config.explosion.force;
          const spread = this.config.explosion.spread;
          const mode = this.config.explosion.mode;
          if (mode === "directional") {
            const dir = this.config.explosion.direction || { x: 1, y: 0 };
            const noise = (this._rand() - 0.5) * spread;
            ax += dir.x * force + noise;
            ay += dir.y * force + noise;
          } else {
            const centerX = width * 0.5;
            const centerY = height * 0.5;
            let ex = p.x - centerX;
            let ey = p.y - centerY;
            if (mode === "random") {
              const a = this._rand() * Math.PI * 2;
              ex = Math.cos(a);
              ey = Math.sin(a);
            }
            if (mode === "burst-wave") {
              const wave = smoothstep(0, 1, clamp(elapsed / Math.max(0.1, this.config.cycle.explodeDuration / 1000), 0, 1));
              ax += (ex / (Math.hypot(ex, ey) + 1e-5)) * force * wave;
              ay += (ey / (Math.hypot(ex, ey) + 1e-5)) * force * wave;
            } else {
              ax += (ex / (Math.hypot(ex, ey) + 1e-5)) * force;
              ay += (ey / (Math.hypot(ex, ey) + 1e-5)) * force;
            }
          }
        }
        p.size = p.size * 0.92 + p.size * this.config.particle.sizeOnExplode * 0.08;
        p.color = colorGetter("explode", i);
      } else if (phase === PHASE.CONVERGE || phase === PHASE.HOLD) {
        p.color = colorGetter("shape", i);
      } else {
        p.color = colorGetter("base", i);
      }
      if (this.config.interactive && this.pointer.active) {
        const px = p.x - this.pointer.x;
        const py = p.y - this.pointer.y;
        const d = Math.hypot(px, py) + 1e-5;
        const m = clamp(120 / d, 0, 3.2) * 0.18;
        ax += (px / d) * m;
        ay += (py / d) * m;
      }
      ax += drift * 0.08;
      ay += Math.cos(drift) * 0.08;
      p.vx = p.vx * damping + ax * dt * speedMul;
      p.vy = p.vy * damping + ay * dt * speedMul;
      const maxV = 4.2;
      p.vx = clamp(p.vx, -maxV, maxV);
      p.vy = clamp(p.vy, -maxV, maxV);
      p.x += p.vx;
      p.y += p.vy;
      if (phase === PHASE.CHAOS || phase === PHASE.RETURN) {
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      } else {
        p.x = clamp(p.x, -20, width + 20);
        p.y = clamp(p.y, -20, height + 20);
      }
    }
  }
}

class Renderer2D {
  draw(ctx, engine, alphaField, phase, width, height, intensity, config) {
    ctx.clearRect(0, 0, width, height);
    for (const p of engine.particles) {
      const color = parseColor(p.color);
      let stateAlpha = 1;
      if (phase === PHASE.EXPLODE) stateAlpha = 1 - clamp((config?.explosion?.fade ?? DEFAULT_CONFIG.explosion.fade) * 0.35, 0, 0.85);
      if (phase === PHASE.CHAOS) stateAlpha = 0.85;
      const alpha = clamp(p.alpha * stateAlpha * alphaField.evaluate(p.x, p.y, width, height), 0, 1);
      if (alpha <= 0.002) continue;
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.35, p.size), 0, Math.PI * 2);
      ctx.fill();
    }
    if (intensity > 0.82) {
      ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
      for (let i = 0; i < engine.particles.length; i += 12) {
        const p = engine.particles[i];
        const t = engine.targetPoints[i % Math.max(1, engine.targetPoints.length)];
        if (!t) continue;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
      }
    }
  }
}

class AxiAmbientElement extends HTMLElement {
  static get observedAttributes() {
    return ["effect", "ascii", "shape", "message", "density", "speed", "intensity", "interactive", "explode", "theme", "paused", "config"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; position:relative; overflow:hidden; background:#020617; }
        canvas { position:absolute; inset:0; width:100%; height:100%; display:block; z-index:0; }
        .overlay { position:relative; z-index:1; }
      </style>
      <canvas></canvas>
      <div class="overlay"><slot></slot></div>
    `;
    this._config = mergeDeep({}, DEFAULT_CONFIG);
    this._paused = false;
    this._visible = true;
    this._connected = false;
    this._lastTime = 0;
    this._raf = 0;
    this._dpr = 1;
    this._reduced = false;
    this._fontReady = false;
    this._canvas = this.shadowRoot.querySelector("canvas");
    this._ctx = this._canvas.getContext("2d");
    this._sampler = new TargetSampler();
    this._alphaField = new AlphaField({
      ...this._config.alphaField,
      masks: this._config.alphaMasks,
    });
    this._state = new StateController();
    this._engine = new ParticleEngine();
    this._renderer = new Renderer2D();
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerLeave = this._onPointerLeave.bind(this);
    this._onCommandEvent = this._onCommandEvent.bind(this);
    this._loop = this._loop.bind(this);
    this._motionMedia = window.matchMedia?.("(prefers-reduced-motion: reduce)") || null;
    this._lastPhase = this._state.phase;
  }

  connectedCallback() {
    if (this._connected) return;
    this._connected = true;
    this._applyDeclarativeAttributes();
    this._setupObservers();
    this._setupMotionPreference();
    this._resize();
    this._configureInternal();
    this._waitForFontsAndRefresh();
    this._start();
    this.dispatchEvent(new CustomEvent("axi-ambient:ready", {
      detail: { phase: this._state.phase },
      bubbles: true,
      composed: true,
    }));
  }

  disconnectedCallback() {
    this._stop();
    this._teardownObservers();
    this._connected = false;
  }

  attributeChangedCallback() {
    if (!this._connected) return;
    this._applyDeclarativeAttributes();
    this._configureInternal();
  }

  configure(options = {}) {
    this._config = mergeDeep(this._config, options);
    this._normalizeConfigShape();
    this._configureInternal();
    this.dispatchEvent(new CustomEvent("axi-ambient:config-change", {
      detail: { config: this.getState().config },
      bubbles: true,
      composed: true,
    }));
  }

  setAscii(ascii) {
    this.configure({ mode: "ascii", ascii });
  }

  setMessage(message) {
    this.configure({ mode: "text", message });
  }

  setShape(name) {
    this.configure({ mode: "shape", shape: name });
  }

  setPoints(points) {
    this.configure({ mode: "points", points: Array.isArray(points) ? points : [] });
  }

  run(command, payload) {
    const cmd = String(command || "").trim();
    if (!cmd) return false;
    if (cmd === "configure") {
      this.configure(payload || {});
      return true;
    }
    if (cmd === "setAscii") {
      this.setAscii(typeof payload === "string" ? payload : payload?.ascii ?? "");
      return true;
    }
    if (cmd === "setMessage") {
      this.setMessage(typeof payload === "string" ? payload : payload?.message ?? "");
      return true;
    }
    if (cmd === "setShape") {
      this.setShape(typeof payload === "string" ? payload : payload?.shape ?? "circle");
      return true;
    }
    if (cmd === "setPoints") {
      this.setPoints(Array.isArray(payload) ? payload : payload?.points);
      return true;
    }
    if (cmd === "startCycle") { this.startCycle(); return true; }
    if (cmd === "converge") { this.converge(); return true; }
    if (cmd === "hold") { this.hold(); return true; }
    if (cmd === "explode") { this.explode(); return true; }
    if (cmd === "scatter") { this.scatter(); return true; }
    if (cmd === "pause") { this.pause(); return true; }
    if (cmd === "resume") { this.resume(); return true; }
    if (cmd === "destroy") { this.destroy(); return true; }
    return false;
  }

  getState() {
    return {
      phase: this._state.phase,
      phaseTime: this._state.phaseTime,
      paused: this._paused,
      visible: this._visible,
      reducedMotion: this._config._reduced,
      particleCount: this._engine.particles.length,
      targetCount: this._engine.targetPoints.length,
      config: mergeDeep({}, this._config),
    };
  }

  startCycle() {
    this._state.startCycle();
    this._paused = false;
  }

  converge() {
    this._state.setPhase(PHASE.CONVERGE, true);
  }

  hold() {
    this._state.setPhase(PHASE.HOLD, true);
  }

  explode() {
    this._state.setPhase(PHASE.EXPLODE, true);
  }

  scatter() {
    this._state.setPhase(PHASE.CHAOS, true);
  }

  pause() {
    this._paused = true;
  }

  resume() {
    this._paused = false;
    this._start();
  }

  destroy() {
    this._stop();
    this._teardownObservers();
    this._engine.particles.length = 0;
    this._engine.targetPoints.length = 0;
    this._connected = false;
    this.dispatchEvent(new CustomEvent("axi-ambient:destroyed", {
      detail: {},
      bubbles: true,
      composed: true,
    }));
  }

  _setupMotionPreference() {
    if (!this._motionMedia) return;
    this._reduced = !!this._motionMedia.matches;
    this._motionListener = () => {
      this._reduced = !!this._motionMedia.matches;
      this._configureInternal();
    };
    this._motionMedia.addEventListener?.("change", this._motionListener);
  }

  _waitForFontsAndRefresh() {
    if (!document.fonts?.ready) {
      this._fontReady = true;
      return;
    }
    document.fonts.ready.then(() => {
      this._fontReady = true;
      if (this._config.mode === "text") this._applyTarget();
    });
  }

  _setupObservers() {
    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(this);
    this._io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      this._visible = !!entry?.isIntersecting;
      if (this._visible) this._start();
    }, { threshold: 0.02 });
    this._io.observe(this);
    this.addEventListener("pointermove", this._onPointerMove);
    this.addEventListener("pointerleave", this._onPointerLeave);
    this.addEventListener("axi-command", this._onCommandEvent);
  }

  _teardownObservers() {
    this._ro?.disconnect();
    this._io?.disconnect();
    if (this._motionMedia && this._motionListener) {
      this._motionMedia.removeEventListener?.("change", this._motionListener);
    }
    this.removeEventListener("pointermove", this._onPointerMove);
    this.removeEventListener("pointerleave", this._onPointerLeave);
    this.removeEventListener("axi-command", this._onCommandEvent);
  }

  _onCommandEvent(event) {
    const detail = event?.detail || {};
    const accepted = this.run(detail.command, detail.payload);
    this.dispatchEvent(new CustomEvent("axi-ambient:command-result", {
      detail: {
        command: detail.command,
        accepted,
      },
      bubbles: true,
      composed: true,
    }));
  }

  _normalizeConfigShape() {
    const c = this._config;
    if (c.cycle?.explodeEnabled == null && c.explodeEnabled != null) {
      c.cycle = c.cycle || {};
      c.cycle.explodeEnabled = !!c.explodeEnabled;
    }
    if (c.explosion?.mode === "normal") c.explosion.mode = "radial";
    if (c.hold?.duration != null && c.cycle?.holdDuration == null) {
      c.cycle = c.cycle || {};
      c.cycle.holdDuration = c.hold.duration;
    }
    if (c.alphaField?.type === "curve") c.alphaField.type = "linear";
  }

  _applyDeclarativeAttributes() {
    const modeFromEffect = {
      ambient: "shape",
      ascii: "ascii",
      message: "text",
      shape: "shape",
    };
    const effect = this.getAttribute("effect");
    const mode = modeFromEffect[effect] || this._config.mode;
    if (effect === "ambient") this._config.shape = "wave";
    this._config.mode = mode;
    if (this.hasAttribute("ascii")) this._config.ascii = this.getAttribute("ascii");
    if (this.hasAttribute("message")) this._config.message = this.getAttribute("message");
    if (this.hasAttribute("shape")) this._config.shape = this.getAttribute("shape");
    if (this.hasAttribute("density")) this._config.particle.count = parseNumberAttribute(this.getAttribute("density"), 800, 100, 5000);
    if (this.hasAttribute("speed")) this._config.speed = parseNumberAttribute(this.getAttribute("speed"), 0.9, 0.1, 3.2);
    if (this.hasAttribute("intensity")) this._config.intensity = parseNumberAttribute(this.getAttribute("intensity"), 0.65, 0.05, 1.2);
    if (this.hasAttribute("interactive")) this._config.interactive = parseBooleanAttribute(this.getAttribute("interactive"), true);
    if (this.hasAttribute("explode")) this._config.cycle.explodeEnabled = parseBooleanAttribute(this.getAttribute("explode"), true);
    if (this.hasAttribute("paused")) this._paused = parseBooleanAttribute(this.getAttribute("paused"), false);
    if (this.hasAttribute("config")) {
      const raw = this.getAttribute("config");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          this._config = mergeDeep(this._config, parsed);
        } catch (error) {
          console.error("[axi-ambient] Invalid JSON in `config` attribute:", error);
        }
      }
    }
    const theme = this.getAttribute("theme");
    if (theme === "warm") {
      this._config.particle.palette = ["#fff7ed", "#fed7aa", "#fdba74", "#fb923c"];
    } else if (theme === "ice") {
      this._config.particle.palette = ["#f8fafc", "#dbeafe", "#93c5fd", "#60a5fa"];
    }
    this._normalizeConfigShape();
  }

  _configureInternal() {
    if (this._config.motion === "off") {
      this._paused = true;
    }
    if (this._config.motion === "static" || (this._config.motion === "auto" && this._reduced)) {
      this._config._reduced = true;
      this._config.cycle.explodeEnabled = false;
      this._state.setPhase(PHASE.HOLD, false);
      if (this._config.motion === "static") this._paused = true;
    } else {
      this._config._reduced = this._config.motion === "reduce" || (this._config.motion === "auto" && this._reduced);
      if (this._config.motion !== "off") this._paused = parseBooleanAttribute(this.getAttribute("paused"), false);
    }
    this._alphaField.configure({
      ...(this._config.alphaField || {}),
      masks: this._config.alphaMasks || [],
    });
    this._state.configure(this._config.cycle);
    this._engine.configure(this._config);
    if (!this._engine.particles.length) {
      this._engine.reset(this._canvas.clientWidth || 1, this._canvas.clientHeight || 1, this._pickColor.bind(this));
    }
    this._applyTarget();
  }

  _applyTarget() {
    const width = this._canvas.clientWidth || 1;
    const height = this._canvas.clientHeight || 1;
    const count = this._config.particle.count;
    let points = [];
    if (this._config.mode === "ascii") {
      points = this._sampler.fromAscii(this._config.ascii, width, height, this._config.target, count);
    } else if (this._config.mode === "text") {
      points = this._sampler.fromText(this._config.message, width, height, count);
    } else if (this._config.mode === "shape") {
      points = this._sampler.fromShape(this._config.shape, width, height, count);
    } else if (this._config.mode === "points") {
      points = this._sampler.fromPoints(this._config.points, width, height, count, this._config.target.padding);
    }
    if (!points.length) {
      points = this._sampler.fromShape("circle", width, height, count);
    }
    this._engine.assignTargets(points);
  }

  _pickColor(kind, index) {
    const p = this._config.particle;
    if (p.colorMode === "fixed") return p.color;
    const palette = kind === "explode"
      ? (p.colorOnExplode?.length ? p.colorOnExplode : p.palette)
      : kind === "shape"
        ? (p.colorOnShape?.length ? p.colorOnShape : p.palette)
        : p.palette;
    if (p.colorMode === "gradient") {
      const left = parseColor(palette[0] || "#ffffff");
      const right = parseColor(palette[palette.length - 1] || "#60a5fa");
      const t = (index % Math.max(2, this._config.particle.count - 1)) / Math.max(1, this._config.particle.count - 1);
      const r = Math.round(lerp(left.r, right.r, t));
      const g = Math.round(lerp(left.g, right.g, t));
      const b = Math.round(lerp(left.b, right.b, t));
      return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
    }
    if (p.colorMode === "by-state") return palette[index % palette.length] || p.color;
    return pickRandom(palette.length ? palette : [p.color]);
  }

  _resize() {
    const rect = this.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this._dpr = dpr;
    this._canvas.width = Math.floor(width * dpr);
    this._canvas.height = Math.floor(height * dpr);
    this._canvas.style.width = `${width}px`;
    this._canvas.style.height = `${height}px`;
    this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this._engine.reset(width, height, this._pickColor.bind(this));
    this._applyTarget();
  }

  _onPointerMove(event) {
    const rect = this.getBoundingClientRect();
    this._engine.pointer.x = event.clientX - rect.left;
    this._engine.pointer.y = event.clientY - rect.top;
    this._engine.pointer.active = true;
  }

  _onPointerLeave() {
    this._engine.pointer.active = false;
  }

  _start() {
    if (this._raf || this._paused || !this._visible) return;
    this._lastTime = performance.now();
    this._raf = requestAnimationFrame(this._loop);
  }

  _stop() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = 0;
  }

  _loop(now) {
    this._raf = 0;
    if (!this._connected || this._paused || !this._visible) return;
    const dt = now - this._lastTime;
    this._lastTime = now;
    this._state.tick(dt);
    if (this._state.phase !== this._lastPhase) {
      this.dispatchEvent(new CustomEvent("axi-ambient:phase-change", {
        detail: { phase: this._state.phase, previousPhase: this._lastPhase },
        bubbles: true,
        composed: true,
      }));
      this._lastPhase = this._state.phase;
    }
    this._engine.update(
      dt,
      this._state.phase,
      this._state.phaseTime,
      this._canvas.clientWidth || this._canvas.width,
      this._canvas.clientHeight || this._canvas.height,
      this._pickColor.bind(this),
    );
    this._renderer.draw(
      this._ctx,
      this._engine,
      this._alphaField,
      this._state.phase,
      this._canvas.clientWidth || this._canvas.width,
      this._canvas.clientHeight || this._canvas.height,
      this._config.intensity,
      this._config,
    );
    this._raf = requestAnimationFrame(this._loop);
  }
}

if (!customElements.get("axi-ambient")) {
  customElements.define("axi-ambient", AxiAmbientElement);
}
