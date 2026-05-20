const DEFAULT_THEMES = {
  formal: {
    "--bb-bg": "#0f172a",
    "--bb-surface": "#1e293b",
    "--bb-surface-2": "#334155",
    "--bb-border": "#475569",
    "--bb-text": "#f1f5f9",
    "--bb-text-muted": "#94a3b8",
    "--bb-accent": "#3b82f6",
    "--bb-accent-2": "#60a5fa",
    "--bb-success": "#22c55e",
    "--bb-warning": "#f59e0b",
    "--bb-danger": "#ef4444",
    "--bb-font": "Inter, system-ui, sans-serif",
    "--bb-font-mono": "JetBrains Mono, Fira Code, monospace",
    "--bb-radius": "8px",
    "--bb-shadow": "0 4px 24px rgba(0,0,0,0.3)",
  },
  playful: {
    "--bb-bg": "#1a0a2e",
    "--bb-surface": "#2d1b69",
    "--bb-surface-2": "#4c1d95",
    "--bb-border": "#7c3aed",
    "--bb-text": "#f5f3ff",
    "--bb-text-muted": "#c4b5fd",
    "--bb-accent": "#a855f7",
    "--bb-accent-2": "#c084fc",
    "--bb-success": "#34d399",
    "--bb-warning": "#fbbf24",
    "--bb-danger": "#f87171",
    "--bb-font": "Nunito, system-ui, sans-serif",
    "--bb-font-mono": "Fira Code, monospace",
    "--bb-radius": "16px",
    "--bb-shadow": "0 4px 24px rgba(124,58,237,0.3)",
  },
  quiz: {
    "--bb-bg": "#0c0a09",
    "--bb-surface": "#1c1917",
    "--bb-surface-2": "#292524",
    "--bb-border": "#57534e",
    "--bb-text": "#fafaf9",
    "--bb-text-muted": "#a8a29e",
    "--bb-accent": "#f97316",
    "--bb-accent-2": "#fb923c",
    "--bb-success": "#10b981",
    "--bb-warning": "#eab308",
    "--bb-danger": "#dc2626",
    "--bb-font": "Inter, system-ui, sans-serif",
    "--bb-font-mono": "Fira Code, monospace",
    "--bb-radius": "12px",
    "--bb-shadow": "0 4px 24px rgba(249,115,22,0.2)",
  },
  court: {
    "--bb-bg": "#1c1917",
    "--bb-surface": "#292524",
    "--bb-surface-2": "#44403c",
    "--bb-border": "#78716c",
    "--bb-text": "#fafaf9",
    "--bb-text-muted": "#a8a29e",
    "--bb-accent": "#b45309",
    "--bb-accent-2": "#d97706",
    "--bb-success": "#059669",
    "--bb-warning": "#ca8a04",
    "--bb-danger": "#b91c1c",
    "--bb-font": "Georgia, serif",
    "--bb-font-mono": "Courier New, monospace",
    "--bb-radius": "4px",
    "--bb-shadow": "0 4px 24px rgba(0,0,0,0.4)",
  },
  mystery: {
    "--bb-bg": "#0a0a0a",
    "--bb-surface": "#171717",
    "--bb-surface-2": "#262626",
    "--bb-border": "#404040",
    "--bb-text": "#e5e5e5",
    "--bb-text-muted": "#737373",
    "--bb-accent": "#7f1d1d",
    "--bb-accent-2": "#991b1b",
    "--bb-success": "#166534",
    "--bb-warning": "#854d0e",
    "--bb-danger": "#991b1b",
    "--bb-font": "Inter, system-ui, sans-serif",
    "--bb-font-mono": "Fira Code, monospace",
    "--bb-radius": "6px",
    "--bb-shadow": "0 4px 24px rgba(0,0,0,0.5)",
  },
  classroom: {
    "--bb-bg": "#f0fdf4",
    "--bb-surface": "#ffffff",
    "--bb-surface-2": "#dcfce7",
    "--bb-border": "#86efac",
    "--bb-text": "#14532d",
    "--bb-text-muted": "#4ade80",
    "--bb-accent": "#16a34a",
    "--bb-accent-2": "#22c55e",
    "--bb-success": "#15803d",
    "--bb-warning": "#ca8a04",
    "--bb-danger": "#dc2626",
    "--bb-font": "Inter, system-ui, sans-serif",
    "--bb-font-mono": "Fira Code, monospace",
    "--bb-radius": "10px",
    "--bb-shadow": "0 4px 24px rgba(22,163,74,0.15)",
  },
  minimal: {
    "--bb-bg": "#ffffff",
    "--bb-surface": "#f8fafc",
    "--bb-surface-2": "#f1f5f9",
    "--bb-border": "#e2e8f0",
    "--bb-text": "#0f172a",
    "--bb-text-muted": "#64748b",
    "--bb-accent": "#2563eb",
    "--bb-accent-2": "#3b82f6",
    "--bb-success": "#16a34a",
    "--bb-warning": "#ca8a04",
    "--bb-danger": "#dc2626",
    "--bb-font": "Inter, system-ui, sans-serif",
    "--bb-font-mono": "Fira Code, monospace",
    "--bb-radius": "6px",
    "--bb-shadow": "0 2px 12px rgba(0,0,0,0.08)",
  },
};

const LAYERS = ["background", "media", "vector", "text", "ui", "overlay"];
const VALID_OPS = new Set([
  "scene.clear", "scene.clearLayer", "scene.theme", "scene.background",
  "scene.layout", "scene.exportImage", "scene.restore",
  "object.create", "object.update", "object.move", "object.resize",
  "object.transform", "object.hide", "object.show", "object.delete",
  "text.show", "text.update", "text.append", "text.highlight", "text.clear",
  "shape.line", "shape.arrow", "shape.rect", "shape.circle", "shape.path", "shape.update",
  "svg.show", "svg.replace", "svg.highlight", "svg.zoom", "svg.pan",
  "image.show", "image.replace", "image.highlight",
  "screenshot.show",
  "youtube.load", "youtube.play", "youtube.segment", "youtube.pause", "youtube.seek",
  "media.caption", "media.remove",
  "list.show", "list.add", "list.update", "list.reveal", "list.remove",
  "table.show", "table.updateRow", "table.updateCell", "table.sort",
  "timer.show", "timer.start", "timer.pause", "timer.resume", "timer.stop", "timer.reset",
  "progress.show", "progress.update",
  "input.text", "input.privateText", "input.choice", "input.multiChoice",
  "input.vote", "input.reaction", "input.close", "input.status", "input.clear",
]);
const VALID_TYPES = new Set([
  "text", "box", "image", "svg", "line", "arrow", "rect", "circle", "path",
  "table", "list", "timer", "progress", "iframe", "input",
]);
const VALID_LAYERS = new Set(LAYERS);
const VALID_TRANSITIONS = new Set([
  "fadeIn", "fadeOut", "slideIn", "slideOut", "scaleIn", "scaleOut",
  "smoothMove", "typewriter", "draw", "pulse", "flash", "shake",
]);

function base64urlDecode(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function sanitizeSVG(svg) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(String(svg), "image/svg+xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) return "";
  const svgEl = doc.querySelector("svg");
  if (!svgEl) return "";
  const remove = ["script", "foreignObject", "object", "embed", "iframe", "link", "meta"];
  remove.forEach((tag) => doc.querySelectorAll(tag).forEach((el) => el.remove()));
  doc.querySelectorAll("*").forEach((el) => {
    const attrs = Array.from(el.attributes);
    attrs.forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name.startsWith("on") || name === "href" && attr.value.startsWith("javascript:")) {
        el.removeAttribute(attr.name);
      }
    });
  });
  return new XMLSerializer().serializeToString(doc.querySelector("svg"));
}

function generateId() {
  return "bb-" + Math.random().toString(36).substring(2, 10);
}

const EDITABLE_SOURCE_OPS = new Set([
  "object.create",
  "text.show",
  "shape.line",
  "shape.arrow",
  "shape.rect",
  "shape.circle",
  "shape.path",
  "svg.show",
  "image.show",
  "screenshot.show",
  "youtube.load",
  "youtube.segment",
  "list.show",
  "table.show",
  "timer.show",
  "progress.show",
  "input.text",
  "input.privateText",
  "input.choice",
  "input.multiChoice",
  "input.vote",
  "input.reaction",
]);

const RESIZABLE_TYPES = new Set(["text", "box", "image", "svg", "table", "list", "timer", "progress", "iframe", "input", "rect", "path", "screenshot"]);

function cloneData(value) {
  if (value == null) return value;
  return JSON.parse(JSON.stringify(value));
}

function parsePixelValue(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : fallback;
}

function serializeEditorValue(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function parseEditorValue(text, previousValue) {
  const raw = String(text ?? "");
  const trimmed = raw.trim();
  if (!trimmed) return typeof previousValue === "string" ? "" : "";
  if (typeof previousValue === "string") return raw;
  try {
    return JSON.parse(trimmed);
  } catch {
    return raw;
  }
}

class ThemeManager {
  constructor(host) {
    this.host = host;
    this.currentTheme = "formal";
  }

  apply(name) {
    const theme = DEFAULT_THEMES[name] || DEFAULT_THEMES.formal;
    this.currentTheme = name;
    const root = this.host.shadowRoot || this.host;
    for (const [prop, value] of Object.entries(theme)) {
      root.host.style.setProperty(prop, value);
    }
  }

  getTheme(name) {
    return DEFAULT_THEMES[name] || DEFAULT_THEMES.formal;
  }
}

class TransitionEngine {
  constructor() {
    this.animations = new Map();
  }

  apply(element, transition, timing = {}) {
    if (!transition || !VALID_TRANSITIONS.has(transition.type)) return Promise.resolve();
    const type = transition.type;
    const duration = transition.durationMs || timing.durationMs || 300;
    const delay = transition.delayMs || timing.delayMs || 0;
    const easing = transition.easing || "ease-out";
    const direction = transition.direction || "up";

    return new Promise((resolve) => {
      setTimeout(() => {
        element.style.transition = `all ${duration}ms ${easing}`;
        switch (type) {
          case "fadeIn":
            element.style.opacity = "0";
            requestAnimationFrame(() => { element.style.opacity = "1"; });
            break;
          case "fadeOut":
            element.style.opacity = "1";
            requestAnimationFrame(() => { element.style.opacity = "0"; });
            break;
          case "slideIn": {
            const dirMap = { up: "translateY(30px)", down: "translateY(-30px)", left: "translateX(30px)", right: "translateX(-30px)" };
            element.style.transform = dirMap[direction] || dirMap.up;
            element.style.opacity = "0";
            requestAnimationFrame(() => {
              element.style.transform = "translate(0,0)";
              element.style.opacity = "1";
            });
            break;
          }
          case "slideOut": {
            const dirMap = { up: "translateY(-30px)", down: "translateY(30px)", left: "translateX(-30px)", right: "translateX(30px)" };
            element.style.transform = "translate(0,0)";
            element.style.opacity = "1";
            requestAnimationFrame(() => {
              element.style.transform = dirMap[direction] || dirMap.up;
              element.style.opacity = "0";
            });
            break;
          }
          case "scaleIn":
            element.style.transform = "scale(0.5)";
            element.style.opacity = "0";
            requestAnimationFrame(() => {
              element.style.transform = "scale(1)";
              element.style.opacity = "1";
            });
            break;
          case "scaleOut":
            element.style.transform = "scale(1)";
            element.style.opacity = "1";
            requestAnimationFrame(() => {
              element.style.transform = "scale(0.5)";
              element.style.opacity = "0";
            });
            break;
          case "smoothMove":
            break;
          case "typewriter":
            this._typewriter(element, element.textContent || "", duration, resolve);
            return;
          case "draw":
            element.style.strokeDasharray = element.getTotalLength?.() || "1000";
            element.style.strokeDashoffset = element.getTotalLength?.() || "1000";
            requestAnimationFrame(() => {
              element.style.strokeDashoffset = "0";
            });
            break;
          case "pulse": {
            const keyframes = [
              { transform: "scale(1)", opacity: "1" },
              { transform: "scale(1.08)", opacity: "0.85" },
              { transform: "scale(1)", opacity: "1" },
            ];
            element.animate(keyframes, { duration, easing }).finished.then(resolve);
            return;
          }
          case "flash": {
            const keyframes = [
              { opacity: "1" },
              { opacity: "0.2" },
              { opacity: "1" },
            ];
            element.animate(keyframes, { duration: Math.min(duration, 200), easing }).finished.then(resolve);
            return;
          }
          case "shake": {
            const keyframes = [
              { transform: "translateX(0)" },
              { transform: "translateX(-6px)" },
              { transform: "translateX(6px)" },
              { transform: "translateX(-4px)" },
              { transform: "translateX(4px)" },
              { transform: "translateX(0)" },
            ];
            element.animate(keyframes, { duration: Math.min(duration, 400), easing }).finished.then(resolve);
            return;
          }
          default:
            resolve();
            return;
        }
        setTimeout(resolve, duration);
      }, delay);
    });
  }

  _typewriter(element, fullText, duration, resolve) {
    element.textContent = "";
    const chars = fullText.split("");
    const interval = duration / Math.max(1, chars.length);
    let i = 0;
    const timer = setInterval(() => {
      if (i < chars.length) {
        element.textContent += chars[i];
        i++;
      } else {
        clearInterval(timer);
        resolve();
      }
    }, interval);
  }
}

class SceneManager {
  constructor(host) {
    this.host = host;
    this.objects = new Map();
    this.layerContainers = new Map();
    this.themeManager = new ThemeManager(host);
    this.transitionEngine = new TransitionEngine();
    this.timers = new Map();
    this.correlationId = null;
    this.pendingCommands = [];
    this.selectedObjectId = null;
  }

  init() {
    const scene = this.host.shadowRoot.getElementById("scene");
    this.scene = scene;
    for (const layer of LAYERS) {
      const container = document.createElement("div");
      container.className = `bb-layer bb-layer-${layer}`;
      container.dataset.layer = layer;
      scene.appendChild(container);
      this.layerContainers.set(layer, container);
    }
    this._bindEditorUi();
    scene.addEventListener("pointerdown", (event) => {
      const target = event.target;
      if (target === scene || target.classList?.contains("bb-layer")) this.clearSelection();
    });
    this.themeManager.apply("formal");
  }

  clear() {
    for (const [id, obj] of this.objects) {
      if (obj.element?.parentNode) obj.element.parentNode.removeChild(obj.element);
      if (obj.timerInterval) clearInterval(obj.timerInterval);
    }
    this.objects.clear();
    this.timers.clear();
    this.clearSelection();
    this._emitSceneChange();
  }

  clearLayer(layer) {
    if (!VALID_LAYERS.has(layer)) return;
    const container = this.layerContainers.get(layer);
    if (!container) return;
    const toRemove = [];
    for (const [id, obj] of this.objects) {
      if (obj.layer === layer) toRemove.push(id);
    }
    for (const id of toRemove) {
      const obj = this.objects.get(id);
      if (obj.element?.parentNode) obj.element.parentNode.removeChild(obj.element);
      if (obj.timerInterval) clearInterval(obj.timerInterval);
      this.objects.delete(id);
    }
    if (toRemove.includes(this.selectedObjectId)) this.clearSelection();
    this._emitSceneChange();
  }

  setTheme(name) {
    this.themeManager.apply(name);
  }

  setBackground(params) {
    const scene = this.host.shadowRoot.getElementById("scene");
    if (params.color != null) {
      scene.style.background = params.color;
    }
    if (params.image) {
      scene.style.backgroundImage = `url(${params.image})`;
      scene.style.backgroundSize = params.size || "cover";
      scene.style.backgroundPosition = params.position || "center";
    } else if (params.image != null) {
      scene.style.backgroundImage = "";
    }
    if (params.gradient) {
      const g = params.gradient;
      scene.style.background = `linear-gradient(${g.direction || "135deg"}, ${g.stops.join(", ")})`;
      scene.style.backgroundImage = "";
    }
  }

  setLayout(name) {
    const scene = this.host.shadowRoot.getElementById("scene");
    switch (name) {
      case "grid":
        scene.style.display = "grid";
        scene.style.gridTemplateColumns = "repeat(3, 1fr)";
        scene.style.gap = "16px";
        break;
      case "flex-row":
        scene.style.display = "flex";
        scene.style.flexDirection = "row";
        scene.style.gap = "16px";
        break;
      case "flex-col":
        scene.style.display = "flex";
        scene.style.flexDirection = "column";
        scene.style.gap = "16px";
        break;
      case "free":
      default:
        scene.style.display = "block";
        break;
    }
  }

  _getOrCreateObject(id, type, layer) {
    if (this.objects.has(id)) return this.objects.get(id);
    const container = this.layerContainers.get(layer || "ui");
    if (!container) return null;
    const el = this._createElement(type, id);
    if (!el) return null;
    container.appendChild(el);
    const obj = { id, type, layer: layer || "ui", element: el, data: {}, hidden: false, sourceCommand: null };
    this.objects.set(id, obj);
    this._bindObjectInteractions(obj);
    this._emitSceneChange();
    return obj;
  }

  _createElement(type, id) {
    const el = document.createElement("div");
    el.className = `bb-object bb-type-${type}`;
    el.dataset.objectId = id;
    el.style.position = "absolute";
    switch (type) {
      case "text":
        el.style.whiteSpace = "pre-wrap";
        el.style.wordBreak = "break-word";
        break;
      case "box":
        el.style.borderRadius = "var(--bb-radius)";
        el.style.padding = "16px";
        el.style.border = "1px solid var(--bb-border)";
        el.style.background = "var(--bb-surface)";
        el.style.boxShadow = "var(--bb-shadow)";
        el.style.whiteSpace = "pre-wrap";
        break;
      case "image":
      case "screenshot":
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        break;
      case "svg":
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        break;
      case "line":
      case "arrow":
        el.style.overflow = "visible";
        break;
      case "rect":
      case "circle":
        el.style.overflow = "visible";
        break;
      case "table":
        el.style.overflow = "auto";
        break;
      case "list":
        el.style.display = "flex";
        el.style.flexDirection = "column";
        el.style.gap = "6px";
        break;
      case "timer":
        el.style.display = "flex";
        el.style.flexDirection = "column";
        el.style.alignItems = "center";
        el.style.gap = "8px";
        break;
      case "progress":
        el.style.display = "flex";
        el.style.flexDirection = "column";
        el.style.gap = "4px";
        break;
      case "input":
        el.style.display = "flex";
        el.style.flexDirection = "column";
        el.style.gap = "8px";
        break;
      case "iframe":
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        break;
    }
    return el;
  }

  _bindEditorUi() {
    this.editorRoot = this.host.shadowRoot.getElementById("selection-editor");
    if (!this.editorRoot) return;
    this.editorTitle = this.host.shadowRoot.getElementById("selection-editor-title");
    this.editorMeta = this.host.shadowRoot.getElementById("selection-editor-meta");
    this.editorHint = this.host.shadowRoot.getElementById("selection-editor-hint");
    this.editorX = this.host.shadowRoot.getElementById("selection-editor-x");
    this.editorY = this.host.shadowRoot.getElementById("selection-editor-y");
    this.editorW = this.host.shadowRoot.getElementById("selection-editor-w");
    this.editorH = this.host.shadowRoot.getElementById("selection-editor-h");
    this.editorTitleField = this.host.shadowRoot.getElementById("selection-editor-title-field");
    this.editorTitleInput = this.host.shadowRoot.getElementById("selection-editor-title-input");
    this.editorContent = this.host.shadowRoot.getElementById("selection-editor-content");
    this.editorSave = this.host.shadowRoot.getElementById("selection-editor-save");
    this.editorFront = this.host.shadowRoot.getElementById("selection-editor-front");
    this.editorDelete = this.host.shadowRoot.getElementById("selection-editor-delete");
    this.editorClose = this.host.shadowRoot.getElementById("selection-editor-close");

    this.editorRoot.addEventListener("pointerdown", (event) => event.stopPropagation());
    this.editorRoot.addEventListener("click", (event) => event.stopPropagation());
    this.editorClose.addEventListener("click", () => this.clearSelection());
    this.editorFront.addEventListener("click", () => this._bringSelectionToFront());
    this.editorDelete.addEventListener("click", () => this._deleteSelection());
    this.editorSave.addEventListener("click", () => this._saveSelectionEdits());
  }

  _bindObjectInteractions(obj) {
    const element = obj.element;
    if (!element || element.dataset.editorBound === "true") return;
    element.dataset.editorBound = "true";
    element.dataset.selectable = "true";
    element.addEventListener("click", (event) => {
      event.stopPropagation();
      this.selectObject(obj.id);
    });
    element.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.selectObject(obj.id);
    });
    element.addEventListener("pointerdown", (event) => {
      this.selectObject(obj.id);
      if (event.button !== 0) return;
      if (event.target.closest("input, button, textarea, select, option, iframe")) return;
      event.preventDefault();
      event.stopPropagation();
      this._startDrag(obj, event);
    });
  }

  _startDrag(obj, event) {
    if (!this.scene) return;
    const element = obj.element;
    element.classList.add("is-dragging");
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = parsePixelValue(element.style.left);
    const startTop = parsePixelValue(element.style.top);
    const rect = element.getBoundingClientRect();
    const stageWidth = this.scene.clientWidth;
    const stageHeight = this.scene.clientHeight;
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    const onMove = (moveEvent) => {
      const nextLeft = Math.min(Math.max(0, Math.round(startLeft + (moveEvent.clientX - startX))), Math.max(0, stageWidth - width));
      const nextTop = Math.min(Math.max(0, Math.round(startTop + (moveEvent.clientY - startY))), Math.max(0, stageHeight - height));
      element.style.left = `${nextLeft}px`;
      element.style.top = `${nextTop}px`;
      this._syncSourceGeometryFromElement(obj);
      if (this.selectedObjectId === obj.id) this._updateEditorFromSelection();
    };

    const onUp = () => {
      element.classList.remove("is-dragging");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      this._syncSourceGeometryFromElement(obj);
      if (this.selectedObjectId === obj.id) this._updateEditorFromSelection();
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }

  selectObject(id) {
    const next = id ? this.objects.get(id) : null;
    if (!next) {
      this.clearSelection();
      return;
    }
    if (this.selectedObjectId && this.objects.has(this.selectedObjectId)) {
      this.objects.get(this.selectedObjectId).element.classList.remove("is-selected");
    }
    this.selectedObjectId = id;
    next.element.classList.add("is-selected");
    this._updateEditorFromSelection();
    this._emitSelectionChange(next);
  }

  clearSelection() {
    if (this.selectedObjectId && this.objects.has(this.selectedObjectId)) {
      this.objects.get(this.selectedObjectId).element.classList.remove("is-selected");
    }
    this.selectedObjectId = null;
    if (this.editorRoot) this.editorRoot.classList.add("hidden");
    this._emitSelectionChange(null);
  }

  _updateEditorFromSelection() {
    if (!this.editorRoot) return;
    const obj = this.selectedObjectId ? this.objects.get(this.selectedObjectId) : null;
    if (!obj) {
      this.editorRoot.classList.add("hidden");
      return;
    }
    const source = this._ensureEditableSource(obj);
    const geometry = source.geometry || {};
    const rect = obj.element.getBoundingClientRect();
    this.editorRoot.classList.remove("hidden");
    this.editorTitle.textContent = obj.id;
    this.editorMeta.textContent = `${source.op} · ${obj.type} · ${obj.layer}`;
    this.editorHint.textContent = "The popup edits the stored creation command for this object and re-applies it on Save.";
    this.editorX.value = parsePixelValue(obj.element.style.left, geometry.x ?? 0);
    this.editorY.value = parsePixelValue(obj.element.style.top, geometry.y ?? 0);
    this.editorW.value = parsePixelValue(obj.element.style.width, geometry.width ?? rect.width);
    this.editorH.value = parsePixelValue(obj.element.style.height, geometry.height ?? rect.height);
    const showSize = RESIZABLE_TYPES.has(obj.type);
    this.editorW.disabled = !showSize;
    this.editorH.disabled = !showSize;
    if (source.title != null) {
      this.editorTitleField.classList.remove("hidden");
      this.editorTitleInput.value = source.title || "";
    } else {
      this.editorTitleField.classList.add("hidden");
      this.editorTitleInput.value = "";
    }
    this.editorContent.value = serializeEditorValue(source.content);
  }

  _ensureEditableSource(obj) {
    if (obj.sourceCommand) return cloneData(obj.sourceCommand);
    const fallback = {
      op: obj.type === "text" ? "text.show" : "object.create",
      id: obj.id,
      type: obj.type === "text" ? undefined : obj.type,
      layer: obj.layer,
      content: obj.type === "text" ? obj.element.textContent || "" : obj.data.content ?? obj.element.textContent ?? "",
      geometry: {
        x: parsePixelValue(obj.element.style.left),
        y: parsePixelValue(obj.element.style.top),
        width: parsePixelValue(obj.element.style.width, obj.element.getBoundingClientRect().width),
        height: parsePixelValue(obj.element.style.height, obj.element.getBoundingClientRect().height),
      },
    };
    obj.sourceCommand = fallback;
    return cloneData(fallback);
  }

  async _saveSelectionEdits() {
    const obj = this.selectedObjectId ? this.objects.get(this.selectedObjectId) : null;
    if (!obj) return;
    const source = this._ensureEditableSource(obj);
    source.geometry = { ...(source.geometry || {}), x: Number.parseInt(this.editorX.value || "0", 10), y: Number.parseInt(this.editorY.value || "0", 10) };
    if (RESIZABLE_TYPES.has(obj.type)) {
      source.geometry.width = Math.max(1, Number.parseInt(this.editorW.value || "1", 10));
      source.geometry.height = Math.max(1, Number.parseInt(this.editorH.value || "1", 10));
    }
    if (!this.editorTitleField.classList.contains("hidden")) source.title = this.editorTitleInput.value.trim();
    source.content = parseEditorValue(this.editorContent.value, source.content);
    delete source.transition;
    delete source.ttl;
    obj.sourceCommand = cloneData(source);
    await this.applyCommand(source);
    this.selectObject(obj.id);
  }

  _bringSelectionToFront() {
    const obj = this.selectedObjectId ? this.objects.get(this.selectedObjectId) : null;
    if (!obj) return;
    const nextZ = Math.max(10, ...Array.from(this.objects.values()).map((entry) => Number.parseInt(entry.element.style.zIndex || "0", 10))) + 1;
    obj.element.style.zIndex = String(nextZ);
    this._syncSourceGeometryFromElement(obj);
    this._updateEditorFromSelection();
  }

  _deleteSelection() {
    if (!this.selectedObjectId) return;
    this.applyCommand({ op: "object.delete", id: this.selectedObjectId, transition: { type: "fadeOut", durationMs: 160 } });
  }

  _syncSourceGeometryFromElement(obj) {
    if (!obj) return;
    const source = this._ensureEditableSource(obj);
    const geometry = { ...(source.geometry || {}) };
    geometry.x = parsePixelValue(obj.element.style.left);
    geometry.y = parsePixelValue(obj.element.style.top);
    if (RESIZABLE_TYPES.has(obj.type)) {
      geometry.width = parsePixelValue(obj.element.style.width, obj.element.getBoundingClientRect().width);
      geometry.height = parsePixelValue(obj.element.style.height, obj.element.getBoundingClientRect().height);
    }
    if (obj.element.style.zIndex) geometry.zIndex = Number.parseInt(obj.element.style.zIndex, 10);
    source.geometry = geometry;
    obj.sourceCommand = source;
  }

  _rememberEditableSource(cmd) {
    if (!cmd?.id || !EDITABLE_SOURCE_OPS.has(cmd.op)) return;
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    obj.sourceCommand = cloneData(cmd);
    if (!obj.sourceCommand.layer) obj.sourceCommand.layer = obj.layer;
    if (cmd.op === "object.create" && !obj.sourceCommand.type) obj.sourceCommand.type = obj.type;
    this._syncSourceGeometryFromElement(obj);
  }

  _refreshEditableSource(cmd) {
    if (!cmd?.id) return;
    const obj = this.objects.get(cmd.id);
    if (!obj?.sourceCommand) return;
    if (cmd.op === "object.update" || cmd.op === "text.update") {
      if (cmd.content != null) obj.sourceCommand.content = cloneData(cmd.content);
      if (cmd.style) obj.sourceCommand.style = { ...(obj.sourceCommand.style || {}), ...cloneData(cmd.style) };
      if (cmd.geometry) obj.sourceCommand.geometry = { ...(obj.sourceCommand.geometry || {}), ...cloneData(cmd.geometry) };
    } else if (cmd.op === "object.move" || cmd.op === "object.resize") {
      obj.sourceCommand.geometry = { ...(obj.sourceCommand.geometry || {}), ...(cloneData(cmd.geometry || cmd.content || {})) };
    } else if (cmd.op === "image.replace" || cmd.op === "svg.replace") {
      obj.sourceCommand.content = cloneData(cmd.content || cmd.url || "");
    } else if (cmd.op === "progress.update") {
      obj.sourceCommand.content = { ...(obj.sourceCommand.content || {}), ...(cloneData(cmd.content || {})) };
    }
    this._syncSourceGeometryFromElement(obj);
  }

  _emitSceneChange() {
    this.host.dispatchEvent(new CustomEvent("blackboard:scene-change", {
      detail: { objectCount: this.objects.size },
      bubbles: true,
      composed: true,
    }));
  }

  _emitSelectionChange(obj) {
    this.host.dispatchEvent(new CustomEvent("blackboard:selection-change", {
      detail: obj ? { id: obj.id, type: obj.type, layer: obj.layer } : { id: null },
      bubbles: true,
      composed: true,
    }));
  }

  _applyGeometry(el, geometry) {
    if (!geometry) return;
    if (geometry.x != null) el.style.left = typeof geometry.x === "number" ? `${geometry.x}px` : geometry.x;
    if (geometry.y != null) el.style.top = typeof geometry.y === "number" ? `${geometry.y}px` : geometry.y;
    if (geometry.width != null) el.style.width = typeof geometry.width === "number" ? `${geometry.width}px` : geometry.width;
    if (geometry.height != null) el.style.height = typeof geometry.height === "number" ? `${geometry.height}px` : geometry.height;
    if (geometry.right != null) { el.style.left = "auto"; el.style.right = typeof geometry.right === "number" ? `${geometry.right}px` : geometry.right; }
    if (geometry.bottom != null) { el.style.top = "auto"; el.style.bottom = typeof geometry.bottom === "number" ? `${geometry.bottom}px` : geometry.bottom; }
    if (geometry.align) el.style.textAlign = geometry.align;
    const transforms = [];
    if (geometry.anchor) {
      transforms.push(`translate(${geometry.anchor === "center" ? "-50%,-50%" : geometry.anchor === "left" ? "0,-50%" : geometry.anchor === "right" ? "-100%,-50%" : "0,0"})`);
    }
    if (geometry.rotation != null) transforms.push(`rotate(${geometry.rotation}deg)`);
    if (transforms.length) el.style.transform = transforms.join(" ");
    if (geometry.zIndex != null) el.style.zIndex = geometry.zIndex;
  }

  _applyStyle(el, style) {
    if (!style) return;
    if (style.font) el.style.font = style.font;
    if (style.fontSize) el.style.fontSize = style.fontSize;
    if (style.fontWeight) el.style.fontWeight = style.fontWeight;
    if (style.color) el.style.color = style.color;
    if (style.backgroundColor) el.style.backgroundColor = style.backgroundColor;
    if (style.borderColor) el.style.borderColor = style.borderColor;
    if (style.opacity != null) el.style.opacity = style.opacity;
    if (style.className) el.className += " " + style.className;
    if (style.variant) el.dataset.variant = style.variant;
    if (style.padding) el.style.padding = style.padding;
    if (style.margin) el.style.margin = style.margin;
    if (style.borderRadius) el.style.borderRadius = style.borderRadius;
    if (style.borderWidth) el.style.borderWidth = style.borderWidth;
    if (style.borderStyle) el.style.borderStyle = style.borderStyle;
  }

  _applyGenericContent(obj, content) {
    if (!obj || content == null) return;
    if (typeof content === "string" || typeof content === "number") {
      obj.element.textContent = String(content);
      return;
    }
    if (typeof content === "object") {
      const text = content.text ?? content.label ?? content.value;
      if (text != null) obj.element.textContent = String(text);
    }
  }

  _applyTiming(cmd) {
    return new Promise((resolve) => {
      const timing = cmd.timing || {};
      if (timing.atMs) {
        setTimeout(resolve, timing.atMs);
      } else {
        resolve();
      }
    });
  }

  async applyCommand(cmd) {
    if (!cmd.op || !VALID_OPS.has(cmd.op)) {
      console.warn(`[agent-blackboard] Unknown op: ${cmd.op}`);
      return;
    }
    await this._applyTiming(cmd);
    const handler = this._getHandler(cmd.op);
    if (handler) await handler.call(this, cmd);
    this._rememberEditableSource(cmd);
    this._refreshEditableSource(cmd);
    if (this.selectedObjectId === cmd.id && this.objects.has(cmd.id)) this._updateEditorFromSelection();
    this._emitSceneChange();
  }

  _getHandler(op) {
    const handlers = {
      "scene.clear": () => this.clear(),
      "scene.clearLayer": (cmd) => this.clearLayer(cmd.layer || cmd.content),
      "scene.theme": (cmd) => this.setTheme(cmd.content || cmd.theme),
      "scene.background": (cmd) => this.setBackground(cmd.content || cmd.params || {}),
      "scene.layout": (cmd) => this.setLayout(cmd.content || "free"),
      "scene.exportImage": () => this._exportImage(),
      "scene.restore": (cmd) => this._restoreScene(cmd.content),
      "object.create": (cmd) => this._objectCreate(cmd),
      "object.update": (cmd) => this._objectUpdate(cmd),
      "object.move": (cmd) => this._objectMove(cmd),
      "object.resize": (cmd) => this._objectResize(cmd),
      "object.transform": (cmd) => this._objectTransform(cmd),
      "object.hide": (cmd) => this._objectHide(cmd),
      "object.show": (cmd) => this._objectShow(cmd),
      "object.delete": (cmd) => this._objectDelete(cmd),
      "text.show": (cmd) => this._textShow(cmd),
      "text.update": (cmd) => this._textUpdate(cmd),
      "text.append": (cmd) => this._textAppend(cmd),
      "text.highlight": (cmd) => this._textHighlight(cmd),
      "text.clear": (cmd) => this._textClear(cmd),
      "shape.line": (cmd) => this._shapeLine(cmd),
      "shape.arrow": (cmd) => this._shapeArrow(cmd),
      "shape.rect": (cmd) => this._shapeRect(cmd),
      "shape.circle": (cmd) => this._shapeCircle(cmd),
      "shape.path": (cmd) => this._shapePath(cmd),
      "shape.update": (cmd) => this._shapeUpdate(cmd),
      "svg.show": (cmd) => this._svgShow(cmd),
      "svg.replace": (cmd) => this._svgReplace(cmd),
      "svg.highlight": (cmd) => this._svgHighlight(cmd),
      "svg.zoom": (cmd) => this._svgZoom(cmd),
      "svg.pan": (cmd) => this._svgPan(cmd),
      "image.show": (cmd) => this._imageShow(cmd),
      "image.replace": (cmd) => this._imageReplace(cmd),
      "image.highlight": (cmd) => this._imageHighlight(cmd),
      "screenshot.show": (cmd) => this._screenshotShow(cmd),
      "youtube.load": (cmd) => this._youtubeLoad(cmd),
      "youtube.play": (cmd) => this._youtubePlay(cmd),
      "youtube.segment": (cmd) => this._youtubeSegment(cmd),
      "youtube.pause": (cmd) => this._youtubePause(cmd),
      "youtube.seek": (cmd) => this._youtubeSeek(cmd),
      "media.caption": (cmd) => this._mediaCaption(cmd),
      "media.remove": (cmd) => this._mediaRemove(cmd),
      "list.show": (cmd) => this._listShow(cmd),
      "list.add": (cmd) => this._listAdd(cmd),
      "list.update": (cmd) => this._listUpdate(cmd),
      "list.reveal": (cmd) => this._listReveal(cmd),
      "list.remove": (cmd) => this._listRemove(cmd),
      "table.show": (cmd) => this._tableShow(cmd),
      "table.updateRow": (cmd) => this._tableUpdateRow(cmd),
      "table.updateCell": (cmd) => this._tableUpdateCell(cmd),
      "table.sort": (cmd) => this._tableSort(cmd),
      "timer.show": (cmd) => this._timerShow(cmd),
      "timer.start": (cmd) => this._timerStart(cmd),
      "timer.pause": (cmd) => this._timerPause(cmd),
      "timer.resume": (cmd) => this._timerResume(cmd),
      "timer.stop": (cmd) => this._timerStop(cmd),
      "timer.reset": (cmd) => this._timerReset(cmd),
      "progress.show": (cmd) => this._progressShow(cmd),
      "progress.update": (cmd) => this._progressUpdate(cmd),
      "input.text": (cmd) => this._inputText(cmd),
      "input.privateText": (cmd) => this._inputPrivateText(cmd),
      "input.choice": (cmd) => this._inputChoice(cmd),
      "input.multiChoice": (cmd) => this._inputMultiChoice(cmd),
      "input.vote": (cmd) => this._inputVote(cmd),
      "input.reaction": (cmd) => this._inputReaction(cmd),
      "input.close": (cmd) => this._inputClose(cmd),
      "input.status": (cmd) => this._inputStatus(cmd),
      "input.clear": (cmd) => this._inputClear(cmd),
    };
    return handlers[op] || null;
  }

  _objectCreate(cmd) {
    const id = cmd.id || generateId();
    const type = cmd.type || "box";
    const layer = cmd.layer || "ui";
    const obj = this._getOrCreateObject(id, type, layer);
    if (!obj) return;
    if (cmd.content) obj.data.content = cmd.content;
    this._applyGenericContent(obj, cmd.content);
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
    if (cmd.style) this._applyStyle(obj.element, cmd.style);
    if (cmd.ttl) this._setTTL(id, cmd.ttl);
    if (cmd.transition) this.transitionEngine.apply(obj.element, cmd.transition);
  }

  _objectUpdate(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    if (cmd.content) obj.data.content = cmd.content;
    this._applyGenericContent(obj, cmd.content);
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
    if (cmd.style) this._applyStyle(obj.element, cmd.style);
    if (cmd.transition) this.transitionEngine.apply(obj.element, cmd.transition);
  }

  _objectMove(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const geom = cmd.geometry || cmd.content || {};
    this._applyGeometry(obj.element, geom);
    if (cmd.transition) this.transitionEngine.apply(obj.element, { type: "smoothMove", ...cmd.transition });
  }

  _objectResize(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const geom = cmd.geometry || cmd.content || {};
    this._applyGeometry(obj.element, geom);
  }

  _objectTransform(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const t = cmd.content || cmd.geometry || {};
    let transform = "";
    if (t.scale) transform += `scale(${t.scale}) `;
    if (t.rotation != null) transform += `rotate(${t.rotation}deg) `;
    if (t.opacity != null) obj.element.style.opacity = t.opacity;
    if (transform) obj.element.style.transform = transform.trim();
  }

  _objectHide(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    obj.hidden = true;
    if (cmd.transition) {
      this.transitionEngine.apply(obj.element, { type: "fadeOut", ...cmd.transition }).then(() => {
        obj.element.style.display = "none";
      });
      return;
    }
    obj.element.style.display = "none";
  }

  _objectShow(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    obj.hidden = false;
    obj.element.style.display = "";
    if (cmd.transition) this.transitionEngine.apply(obj.element, { type: "fadeIn", ...cmd.transition });
  }

  _objectDelete(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const doDelete = () => {
      if (obj.element?.parentNode) obj.element.parentNode.removeChild(obj.element);
      if (obj.timerInterval) clearInterval(obj.timerInterval);
      this.objects.delete(cmd.id);
      if (this.selectedObjectId === cmd.id) this.clearSelection();
      this._emitSceneChange();
    };
    if (cmd.transition) {
      this.transitionEngine.apply(obj.element, { type: "fadeOut", ...cmd.transition }).then(doDelete);
    } else {
      doDelete();
    }
  }

  _textShow(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "text", cmd.layer || "text");
    if (!obj) return;
    obj.element.textContent = cmd.content || "";
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
    if (cmd.style) this._applyStyle(obj.element, cmd.style);
    if (cmd.transition) this.transitionEngine.apply(obj.element, cmd.transition);
  }

  _textUpdate(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    obj.element.textContent = cmd.content || "";
    if (cmd.style) this._applyStyle(obj.element, cmd.style);
    if (cmd.transition) this.transitionEngine.apply(obj.element, cmd.transition);
  }

  _textAppend(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    obj.element.textContent += cmd.content || "";
  }

  _textHighlight(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const hl = cmd.content || {};
    const text = obj.element.textContent;
    if (!hl.text || !hl.color) return;
    const regex = new RegExp(hl.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    obj.element.innerHTML = text.replace(regex, `<mark style="background:${hl.color};color:inherit;padding:1px 3px;border-radius:3px;">${hl.text}</mark>`);
  }

  _textClear(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    obj.element.textContent = "";
  }

  _shapeLine(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "line", cmd.layer || "vector");
    if (!obj) return;
    const geom = cmd.geometry || {};
    const svg = `<svg width="${geom.width || 400}" height="${geom.height || 10}" style="overflow:visible;">
      <line x1="${geom.x1 || 0}" y1="${geom.y1 || 5}" x2="${geom.x2 || (geom.width || 400)}" y2="${geom.y2 || 5}"
        stroke="${cmd.style?.color || "var(--bb-accent)"}" stroke-width="${cmd.style?.strokeWidth || 2}"
        style="transition: stroke-dashoffset ${(cmd.transition?.durationMs || 300)}ms ease-out;"/>
    </svg>`;
    obj.element.innerHTML = svg;
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
    if (cmd.transition) this.transitionEngine.apply(obj.element.querySelector("line"), cmd.transition);
  }

  _shapeArrow(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "arrow", cmd.layer || "vector");
    if (!obj) return;
    const geom = cmd.geometry || {};
    const svg = `<svg width="${geom.width || 400}" height="${geom.height || 40}" style="overflow:visible;">
      <line x1="${geom.x1 || 0}" y1="${geom.y1 || 20}" x2="${geom.x2 || (geom.width || 380)}" y2="${geom.y2 || 20}"
        stroke="${cmd.style?.color || "var(--bb-accent)"}" stroke-width="${cmd.style?.strokeWidth || 2}"
        marker-end="url(#arrowhead-${id})"
        style="transition: stroke-dashoffset ${(cmd.transition?.durationMs || 300)}ms ease-out;"/>
      <defs><marker id="arrowhead-${id}" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="${cmd.style?.color || "var(--bb-accent)"}"/>
      </marker></defs>
    </svg>`;
    obj.element.innerHTML = svg;
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
  }

  _shapeRect(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "rect", cmd.layer || "vector");
    if (!obj) return;
    const geom = cmd.geometry || {};
    const w = geom.width || 200;
    const h = geom.height || 100;
    const svg = `<svg width="${w}" height="${h}" style="overflow:visible;">
      <rect x="0" y="0" width="${w}" height="${h}"
        fill="${cmd.style?.fill || "none"}" stroke="${cmd.style?.color || "var(--bb-accent)"}"
        stroke-width="${cmd.style?.strokeWidth || 2}" rx="${cmd.style?.rx || 4}"/>
    </svg>`;
    obj.element.innerHTML = svg;
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
  }

  _shapeCircle(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "circle", cmd.layer || "vector");
    if (!obj) return;
    const geom = cmd.geometry || {};
    const r = geom.radius || 50;
    const size = r * 2 + 10;
    const svg = `<svg width="${size}" height="${size}" style="overflow:visible;">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}"
        fill="${cmd.style?.fill || "none"}" stroke="${cmd.style?.color || "var(--bb-accent)"}"
        stroke-width="${cmd.style?.strokeWidth || 2}"/>
    </svg>`;
    obj.element.innerHTML = svg;
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
  }

  _shapePath(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "path", cmd.layer || "vector");
    if (!obj) return;
    const geom = cmd.geometry || {};
    const svg = `<svg width="${geom.width || 400}" height="${geom.height || 200}" style="overflow:visible;">
      <path d="${cmd.content || ""}" fill="${cmd.style?.fill || "none"}"
        stroke="${cmd.style?.color || "var(--bb-accent)"}" stroke-width="${cmd.style?.strokeWidth || 2}"
        style="transition: stroke-dashoffset ${(cmd.transition?.durationMs || 300)}ms ease-out;"/>
    </svg>`;
    obj.element.innerHTML = svg;
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
  }

  _shapeUpdate(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    if (cmd.content) {
      const path = obj.element.querySelector("path");
      if (path) path.setAttribute("d", cmd.content);
      const rect = obj.element.querySelector("rect");
      if (rect) {
        if (cmd.geometry?.width) rect.setAttribute("width", cmd.geometry.width);
        if (cmd.geometry?.height) rect.setAttribute("height", cmd.geometry.height);
      }
    }
    if (cmd.style) this._applyStyle(obj.element, cmd.style);
  }

  _svgShow(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "svg", cmd.layer || "vector");
    if (!obj) return;
    const svgContent = typeof cmd.content === "string" ? sanitizeSVG(cmd.content) : "";
    obj.element.innerHTML = svgContent;
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
    if (cmd.style) this._applyStyle(obj.element, cmd.style);
    if (cmd.transition) this.transitionEngine.apply(obj.element, cmd.transition);
  }

  _svgReplace(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    obj.element.innerHTML = sanitizeSVG(cmd.content || "");
  }

  _svgHighlight(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const hl = cmd.content || {};
    if (hl.selector) {
      const target = obj.element.querySelector(hl.selector);
      if (target) {
        target.style.transition = "all 300ms ease";
        target.style.filter = hl.filter || "drop-shadow(0 0 8px var(--bb-accent))";
        target.style.stroke = hl.color || "var(--bb-accent)";
      }
    }
  }

  _svgZoom(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const params = cmd.content || {};
    obj.element.style.transform = `scale(${params.scale || 1})`;
    obj.element.style.transformOrigin = params.origin || "center";
  }

  _svgPan(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const params = cmd.content || {};
    obj.element.style.transform = `translate(${params.x || 0}px, ${params.y || 0}px)`;
  }

  _imageShow(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "image", cmd.layer || "media");
    if (!obj) return;
    const img = document.createElement("img");
    img.src = cmd.content || cmd.url || "";
    img.alt = cmd.content?.alt || cmd.caption || "";
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    img.style.objectFit = "contain";
    img.style.borderRadius = "var(--bb-radius)";
    obj.element.innerHTML = "";
    obj.element.appendChild(img);
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
    if (cmd.style) this._applyStyle(obj.element, cmd.style);
    if (cmd.transition) this.transitionEngine.apply(obj.element, cmd.transition);
  }

  _imageReplace(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const img = obj.element.querySelector("img");
    if (img) img.src = cmd.content || cmd.url || "";
  }

  _imageHighlight(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const hl = cmd.content || {};
    obj.element.style.outline = `3px solid ${hl.color || "var(--bb-accent)"}`;
    obj.element.style.outlineOffset = "4px";
  }

  _screenshotShow(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "screenshot", cmd.layer || "media");
    if (!obj) return;
    const img = document.createElement("img");
    img.src = cmd.content?.url || cmd.content || "";
    img.alt = "Screenshot";
    img.style.maxWidth = "100%";
    img.style.borderRadius = "var(--bb-radius)";
    obj.element.innerHTML = "";
    obj.element.appendChild(img);
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
  }

  _youtubeLoad(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "iframe", cmd.layer || "media");
    if (!obj) return;
    const videoId = this._extractYouTubeId(cmd.content?.url || cmd.content || cmd.url || "");
    const start = cmd.content?.start || 0;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?start=${start}&rel=0&enablejsapi=1`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.borderRadius = "var(--bb-radius)";
    obj.element.innerHTML = "";
    obj.element.appendChild(iframe);
    obj.data.videoId = videoId;
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
  }

  _youtubePlay(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const iframe = obj.element.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', "*");
    }
  }

  _youtubeSegment(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "iframe", cmd.layer || "media");
    if (!obj) return;
    const videoId = this._extractYouTubeId(cmd.content?.url || cmd.content || "");
    const start = cmd.content?.start || 0;
    const end = cmd.content?.end || start + 30;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?start=${start}&end=${end}&autoplay=1&rel=0&enablejsapi=1`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.borderRadius = "var(--bb-radius)";
    obj.element.innerHTML = "";
    obj.element.appendChild(iframe);
    obj.data.videoId = videoId;
    obj.data.startSec = start;
    obj.data.endSec = end;
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
  }

  _youtubePause(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const iframe = obj.element.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");
    }
  }

  _youtubeSeek(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const iframe = obj.element.querySelector("iframe");
    if (iframe && cmd.content?.seconds != null) {
      iframe.contentWindow?.postMessage(`{"event":"command","func":"seekTo","args":[${cmd.content.seconds},true]}`, "*");
    }
  }

  _mediaCaption(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    let caption = obj.element.querySelector(".bb-caption");
    if (!caption) {
      caption = document.createElement("div");
      caption.className = "bb-caption";
      caption.style.marginTop = "8px";
      caption.style.fontSize = "14px";
      caption.style.color = "var(--bb-text-muted)";
      caption.style.textAlign = "center";
      obj.element.appendChild(caption);
    }
    caption.textContent = cmd.content || "";
  }

  _mediaRemove(cmd) {
    this._objectDelete(cmd);
  }

  _listShow(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "list", cmd.layer || "ui");
    if (!obj) return;
    obj.data.items = Array.isArray(cmd.content) ? cmd.content : (cmd.items || []);
    obj.data.title = cmd.title ?? cmd.content?.title ?? "";
    obj.data.revealed = new Set();
    obj.data.hiddenItems = new Set(cmd.hiddenItems || []);
    this._renderList(obj);
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
    if (cmd.style) this._applyStyle(obj.element, cmd.style);
    if (cmd.transition) this.transitionEngine.apply(obj.element, cmd.transition);
  }

  _renderList(obj) {
    obj.element.innerHTML = "";
    const title = obj.data.title ? `<div style="font-weight:600;font-size:18px;margin-bottom:8px;color:var(--bb-text);">${obj.data.title}</div>` : "";
    obj.element.innerHTML = title;
    obj.data.items.forEach((item, idx) => {
      const isHidden = obj.data.hiddenItems?.has(idx) && !obj.data.revealed?.has(idx);
      const el = document.createElement("div");
      el.className = "bb-list-item";
      el.style.padding = "10px 14px";
      el.style.background = "var(--bb-surface-2)";
      el.style.borderRadius = "var(--bb-radius)";
      el.style.color = "var(--bb-text)";
      el.style.fontSize = "15px";
      el.style.transition = "all 300ms ease";
      if (isHidden) {
        el.textContent = "???";
        el.style.fontStyle = "italic";
        el.style.color = "var(--bb-text-muted)";
      } else {
        el.textContent = typeof item === "string" ? item : item.text || item.label || String(item);
        if (item.highlighted) {
          el.style.borderLeft = "3px solid var(--bb-accent)";
          el.style.background = "var(--bb-surface)";
        }
      }
      obj.element.appendChild(el);
    });
  }

  _listAdd(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    if (!obj.data.items) obj.data.items = [];
    obj.data.items.push(cmd.content || cmd.item || "");
    this._renderList(obj);
  }

  _listUpdate(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const idx = cmd.content?.index ?? cmd.index;
    if (idx != null && obj.data.items) {
      obj.data.items[idx] = cmd.content?.text ?? cmd.content?.item ?? cmd.content ?? obj.data.items[idx];
      this._renderList(obj);
    }
  }

  _listReveal(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const idx = cmd.content?.index ?? cmd.index;
    if (idx != null) obj.data.revealed?.add(idx);
    this._renderList(obj);
  }

  _listRemove(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const idx = cmd.content?.index ?? cmd.index;
    if (idx != null && obj.data.items) {
      obj.data.items.splice(idx, 1);
      this._renderList(obj);
    }
  }

  _tableShow(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "table", cmd.layer || "ui");
    if (!obj) return;
    obj.data.headers = cmd.content?.headers || cmd.headers || [];
    obj.data.rows = Array.isArray(cmd.content?.rows) ? cmd.content.rows : (Array.isArray(cmd.content) ? cmd.content : (cmd.rows || []));
    obj.data.sortColumn = null;
    obj.data.sortAsc = true;
    this._renderTable(obj);
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
    if (cmd.style) this._applyStyle(obj.element, cmd.style);
    if (cmd.transition) this.transitionEngine.apply(obj.element, cmd.transition);
  }

  _renderTable(obj) {
    const headers = obj.data.headers || [];
    const rows = obj.data.rows || [];
    let html = "<table style=\"width:100%;border-collapse:collapse;font-size:14px;\">";
    if (headers.length) {
      html += "<thead><tr>";
      headers.forEach((h, i) => {
        html += `<th style="padding:10px 14px;text-align:left;border-bottom:2px solid var(--bb-border);color:var(--bb-accent);font-weight:600;cursor:pointer;" data-col="${i}">${h}</th>`;
      });
      html += "</tr></thead>";
    }
    html += "<tbody>";
    rows.forEach((row, ri) => {
      html += `<tr style="border-bottom:1px solid var(--bb-border);">`;
      const cells = Array.isArray(row) ? row : (row.cells || []);
      cells.forEach((cell, ci) => {
        const display = typeof cell === "object" ? cell.text ?? cell.value ?? "" : cell;
        const hl = typeof cell === "object" && cell.highlighted ? "background:var(--bb-surface-2);" : "";
        html += `<td style="padding:8px 14px;color:var(--bb-text);${hl}">${display}</td>`;
      });
      html += "</tr>";
    });
    html += "</tbody></table>";
    obj.element.innerHTML = html;
  }

  _tableUpdateRow(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const idx = cmd.content?.index ?? cmd.index;
    if (idx != null && obj.data.rows) {
      obj.data.rows[idx] = cmd.content?.row ?? cmd.content?.cells ?? cmd.content ?? obj.data.rows[idx];
      this._renderTable(obj);
    }
  }

  _tableUpdateCell(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const rowIdx = cmd.content?.row ?? cmd.row;
    const colIdx = cmd.content?.col ?? cmd.col;
    if (rowIdx != null && colIdx != null && obj.data.rows) {
      const row = obj.data.rows[rowIdx];
      if (Array.isArray(row)) row[colIdx] = cmd.content?.value ?? cmd.content?.text ?? cmd.content ?? row[colIdx];
      else if (row.cells) row.cells[colIdx] = cmd.content?.value ?? cmd.content?.text ?? cmd.content ?? row.cells[colIdx];
      this._renderTable(obj);
    }
  }

  _tableSort(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const col = cmd.content?.column ?? cmd.column ?? 0;
    const asc = cmd.content?.asc ?? cmd.asc ?? true;
    if (obj.data.rows) {
      obj.data.rows.sort((a, b) => {
        const va = Array.isArray(a) ? a[col] : (a.cells?.[col] ?? "");
        const vb = Array.isArray(b) ? b[col] : (b.cells?.[col] ?? "");
        const sa = typeof va === "string" ? va : String(va);
        const sb = typeof vb === "string" ? vb : String(vb);
        return asc ? sa.localeCompare(sb) : sb.localeCompare(sa);
      });
      this._renderTable(obj);
    }
  }

  _timerShow(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "timer", cmd.layer || "ui");
    if (!obj) return;
    const seconds = cmd.content?.seconds ?? cmd.content ?? cmd.seconds ?? 60;
    obj.data.totalSeconds = seconds;
    obj.data.remainingSeconds = seconds;
    obj.data.running = false;
    obj.data.mode = cmd.content?.mode || "countdown";
    obj.data.label = cmd.content?.label || "";
    this._renderTimer(obj);
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
    if (cmd.style) this._applyStyle(obj.element, cmd.style);
    if (cmd.transition) this.transitionEngine.apply(obj.element, cmd.transition);
  }

  _renderTimer(obj) {
    const mins = Math.floor(obj.data.remainingSeconds / 60);
    const secs = obj.data.remainingSeconds % 60;
    const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    const pct = obj.data.totalSeconds > 0 ? ((obj.data.totalSeconds - obj.data.remainingSeconds) / obj.data.totalSeconds) * 100 : 0;
    const color = pct > 80 ? "var(--bb-danger)" : pct > 50 ? "var(--bb-warning)" : "var(--bb-accent)";
    obj.element.innerHTML = `
      ${obj.data.label ? `<div style="font-size:14px;color:var(--bb-text-muted);margin-bottom:4px;">${obj.data.label}</div>` : ""}
      <div style="font-size:48px;font-weight:700;font-family:var(--bb-font-mono);color:${color};">${timeStr}</div>
      <div style="width:100%;height:6px;background:var(--bb-surface-2);border-radius:3px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:${color};transition:width 1s linear;"></div>
      </div>
    `;
  }

  _timerStart(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    obj.data.running = true;
    if (obj.timerInterval) clearInterval(obj.timerInterval);
    obj.timerInterval = setInterval(() => {
      if (obj.data.mode === "countdown") {
        obj.data.remainingSeconds = Math.max(0, obj.data.remainingSeconds - 1);
        if (obj.data.remainingSeconds <= 0) {
          clearInterval(obj.timerInterval);
          obj.data.running = false;
        }
      } else {
        obj.data.remainingSeconds++;
      }
      this._renderTimer(obj);
    }, 1000);
  }

  _timerPause(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    obj.data.running = false;
    if (obj.timerInterval) clearInterval(obj.timerInterval);
  }

  _timerResume(cmd) {
    this._timerStart(cmd);
  }

  _timerStop(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    obj.data.running = false;
    if (obj.timerInterval) clearInterval(obj.timerInterval);
    obj.data.remainingSeconds = 0;
    this._renderTimer(obj);
  }

  _timerReset(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    obj.data.running = false;
    if (obj.timerInterval) clearInterval(obj.timerInterval);
    obj.data.remainingSeconds = obj.data.totalSeconds;
    this._renderTimer(obj);
  }

  _progressShow(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "progress", cmd.layer || "ui");
    if (!obj) return;
    obj.data.value = cmd.content?.value ?? cmd.content ?? 0;
    obj.data.max = cmd.content?.max ?? cmd.max ?? 100;
    obj.data.label = cmd.content?.label || "";
    this._renderProgress(obj);
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
    if (cmd.style) this._applyStyle(obj.element, cmd.style);
  }

  _renderProgress(obj) {
    const pct = Math.min(100, (obj.data.value / Math.max(1, obj.data.max)) * 100);
    obj.element.innerHTML = `
      ${obj.data.label ? `<div style="font-size:14px;color:var(--bb-text-muted);margin-bottom:6px;">${obj.data.label}: ${Math.round(pct)}%</div>` : ""}
      <div style="width:100%;height:12px;background:var(--bb-surface-2);border-radius:6px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:var(--bb-accent);transition:width 300ms ease;border-radius:6px;"></div>
      </div>
    `;
  }

  _progressUpdate(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    obj.data.value = cmd.content?.value ?? cmd.content ?? obj.data.value;
    if (cmd.content?.max != null) obj.data.max = cmd.content.max;
    this._renderProgress(obj);
  }

  _inputText(cmd) {
    this._inputCreate(cmd, "text", false);
  }

  _inputPrivateText(cmd) {
    this._inputCreate(cmd, "text", true);
  }

  _inputCreate(cmd, inputType, isPrivate) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "input", cmd.layer || "ui");
    if (!obj) return;
    obj.data.inputType = inputType;
    obj.data.private = isPrivate;
    obj.data.prompt = cmd.content?.prompt ?? cmd.content ?? cmd.prompt ?? "";
    obj.data.placeholder = cmd.content?.placeholder ?? "";
    obj.data.closed = false;
    obj.data.responses = new Map();
    this._renderInput(obj);
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
    if (cmd.style) this._applyStyle(obj.element, cmd.style);
    if (cmd.transition) this.transitionEngine.apply(obj.element, cmd.transition);
  }

  _renderInput(obj) {
    if (obj.data.closed) {
      obj.element.innerHTML = `<div style="color:var(--bb-text-muted);font-style:italic;">Input closed.</div>`;
      return;
    }
    let html = "";
    if (obj.data.prompt) {
      html += `<div style="font-size:16px;font-weight:600;color:var(--bb-text);margin-bottom:8px;">${obj.data.prompt}</div>`;
    }
    if (obj.data.inputType === "text") {
      html += `<input type="${obj.data.private ? "password" : "text"}" class="bb-input-field" placeholder="${obj.data.placeholder || "Type here..."}"
        style="width:100%;padding:10px 14px;border:1px solid var(--bb-border);border-radius:var(--bb-radius);background:var(--bb-surface-2);color:var(--bb-text);font-size:15px;outline:none;" />`;
      html += `<button class="bb-input-submit" style="margin-top:8px;padding:8px 20px;border:none;border-radius:var(--bb-radius);background:var(--bb-accent);color:white;font-size:14px;cursor:pointer;">Submit</button>`;
    }
    obj.element.innerHTML = html;
    const input = obj.element.querySelector(".bb-input-field");
    const submit = obj.element.querySelector(".bb-input-submit");
    if (input && submit) {
      const doSubmit = () => {
        if (obj.data.closed) return;
        const value = input.value.trim();
        if (!value) return;
        this._emitAction(obj.id, "text", value);
        input.value = "";
      };
      submit.addEventListener("click", doSubmit);
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") doSubmit(); });
    }
  }

  _inputChoice(cmd) {
    this._inputSelect(cmd, false);
  }

  _inputMultiChoice(cmd) {
    this._inputSelect(cmd, true);
  }

  _inputSelect(cmd, multiple) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "input", cmd.layer || "ui");
    if (!obj) return;
    obj.data.inputType = multiple ? "multiChoice" : "choice";
    obj.data.private = false;
    obj.data.prompt = cmd.content?.prompt ?? cmd.content ?? cmd.prompt ?? "";
    obj.data.options = cmd.content?.options ?? cmd.options ?? [];
    obj.data.closed = false;
    obj.data.responses = new Map();
    this._renderSelectInput(obj);
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
    if (cmd.style) this._applyStyle(obj.element, cmd.style);
    if (cmd.transition) this.transitionEngine.apply(obj.element, cmd.transition);
  }

  _renderSelectInput(obj) {
    if (obj.data.closed) {
      obj.element.innerHTML = `<div style="color:var(--bb-text-muted);font-style:italic;">Input closed.</div>`;
      return;
    }
    let html = "";
    if (obj.data.prompt) {
      html += `<div style="font-size:16px;font-weight:600;color:var(--bb-text);margin-bottom:12px;">${obj.data.prompt}</div>`;
    }
    const isMulti = obj.data.inputType === "multiChoice";
    obj.data.options.forEach((opt, idx) => {
      const label = typeof opt === "string" ? opt : opt.label ?? opt.text ?? String(opt);
      const value = typeof opt === "string" ? opt : opt.value ?? opt.label ?? String(opt);
      html += `<button class="bb-choice-btn" data-idx="${idx}" data-value="${value}"
        style="display:block;width:100%;padding:12px 16px;margin-bottom:6px;border:1px solid var(--bb-border);border-radius:var(--bb-radius);background:var(--bb-surface);color:var(--bb-text);font-size:15px;cursor:pointer;text-align:left;transition:all 200ms ease;">${label}</button>`;
    });
    if (isMulti) {
      html += `<button class="bb-choice-submit" style="margin-top:8px;padding:8px 20px;border:none;border-radius:var(--bb-radius);background:var(--bb-accent);color:white;font-size:14px;cursor:pointer;">Submit</button>`;
    }
    obj.element.innerHTML = html;
    const selected = new Set();
    obj.element.querySelectorAll(".bb-choice-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (obj.data.closed) return;
        const idx = parseInt(btn.dataset.idx);
        const value = btn.dataset.value;
        if (isMulti) {
          if (selected.has(idx)) { selected.delete(idx); btn.style.background = "var(--bb-surface)"; btn.style.borderColor = "var(--bb-border)"; }
          else { selected.add(idx); btn.style.background = "var(--bb-accent)"; btn.style.borderColor = "var(--bb-accent)"; btn.style.color = "white"; }
        } else {
          obj.element.querySelectorAll(".bb-choice-btn").forEach((b) => { b.style.background = "var(--bb-surface)"; b.style.borderColor = "var(--bb-border)"; b.style.color = "var(--bb-text)"; });
          btn.style.background = "var(--bb-accent)";
          btn.style.borderColor = "var(--bb-accent)";
          btn.style.color = "white";
          this._emitAction(obj.id, "choice", value);
        }
      });
    });
    const submitBtn = obj.element.querySelector(".bb-choice-submit");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        if (obj.data.closed) return;
        const values = Array.from(selected).map((i) => obj.data.options[i]);
        if (values.length) this._emitAction(obj.id, "multiChoice", values);
      });
    }
  }

  _inputVote(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "input", cmd.layer || "ui");
    if (!obj) return;
    obj.data.inputType = "vote";
    obj.data.private = false;
    obj.data.prompt = cmd.content?.prompt ?? cmd.content ?? cmd.question ?? "";
    obj.data.options = cmd.content?.options ?? cmd.options ?? [];
    obj.data.closed = false;
    obj.data.votes = new Map();
    obj.data.responses = new Map();
    this._renderVoteInput(obj);
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
    if (cmd.style) this._applyStyle(obj.element, cmd.style);
    if (cmd.transition) this.transitionEngine.apply(obj.element, cmd.transition);
  }

  _renderVoteInput(obj) {
    if (obj.data.closed) {
      this._renderVoteResults(obj);
      return;
    }
    let html = "";
    if (obj.data.prompt) {
      html += `<div style="font-size:16px;font-weight:600;color:var(--bb-text);margin-bottom:12px;">${obj.data.prompt}</div>`;
    }
    obj.data.options.forEach((opt, idx) => {
      const label = typeof opt === "string" ? opt : opt.label ?? opt.text ?? String(opt);
      html += `<button class="bb-vote-btn" data-idx="${idx}"
        style="display:block;width:100%;padding:12px 16px;margin-bottom:6px;border:1px solid var(--bb-border);border-radius:var(--bb-radius);background:var(--bb-surface);color:var(--bb-text);font-size:15px;cursor:pointer;text-align:left;transition:all 200ms ease;">${label}</button>`;
    });
    obj.element.innerHTML = html;
    obj.element.querySelectorAll(".bb-vote-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (obj.data.closed) return;
        const idx = parseInt(btn.dataset.idx);
        const value = obj.data.options[idx];
        const voterId = this.host.sourceUserId || this.host.boardUserId || "demo-local-user";
        obj.data.votes.set(voterId, idx);
        this._emitAction(obj.id, "vote", value);
        btn.style.background = "var(--bb-accent)";
        btn.style.borderColor = "var(--bb-accent)";
        btn.style.color = "white";
      });
    });
  }

  _renderVoteResults(obj) {
    const total = obj.data.votes.size || 0;
    let html = `<div style="font-size:16px;font-weight:600;color:var(--bb-text);margin-bottom:12px;">${obj.data.prompt}</div>`;
    obj.data.options.forEach((opt, idx) => {
      const label = typeof opt === "string" ? opt : opt.label ?? opt.text ?? String(opt);
      const count = Array.from(obj.data.votes.values()).filter((v) => v === idx).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      html += `<div style="margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-size:14px;color:var(--bb-text);margin-bottom:4px;">
          <span>${label}</span><span>${count} votes (${pct}%)</span>
        </div>
        <div style="width:100%;height:8px;background:var(--bb-surface-2);border-radius:4px;overflow:hidden;">
          <div style="width:${pct}%;height:100%;background:var(--bb-accent);border-radius:4px;transition:width 300ms ease;"></div>
        </div>
      </div>`;
    });
    obj.element.innerHTML = html;
  }

  _inputReaction(cmd) {
    const id = cmd.id || generateId();
    const obj = this._getOrCreateObject(id, "input", cmd.layer || "ui");
    if (!obj) return;
    obj.data.inputType = "reaction";
    obj.data.private = false;
    obj.data.prompt = cmd.content?.prompt ?? cmd.content ?? cmd.prompt ?? "";
    obj.data.reactions = cmd.content?.reactions ?? cmd.reactions ?? ["👍", "👎", "❤️", "🎉", "😂", "🤔"];
    obj.data.closed = false;
    obj.data.responses = new Map();
    this._renderReactionInput(obj);
    if (cmd.geometry) this._applyGeometry(obj.element, cmd.geometry);
    if (cmd.style) this._applyStyle(obj.element, cmd.style);
    if (cmd.transition) this.transitionEngine.apply(obj.element, cmd.transition);
  }

  _renderReactionInput(obj) {
    if (obj.data.closed) {
      obj.element.innerHTML = `<div style="color:var(--bb-text-muted);font-style:italic;">Input closed.</div>`;
      return;
    }
    let html = "";
    if (obj.data.prompt) {
      html += `<div style="font-size:16px;font-weight:600;color:var(--bb-text);margin-bottom:12px;">${obj.data.prompt}</div>`;
    }
    html += `<div style="display:flex;gap:8px;flex-wrap:wrap;">`;
    obj.data.reactions.forEach((r) => {
      html += `<button class="bb-reaction-btn" data-reaction="${r}"
        style="font-size:28px;padding:8px 12px;border:1px solid var(--bb-border);border-radius:var(--bb-radius);background:var(--bb-surface);cursor:pointer;transition:all 200ms ease;">${r}</button>`;
    });
    html += `</div>`;
    obj.element.innerHTML = html;
    obj.element.querySelectorAll(".bb-reaction-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (obj.data.closed) return;
        this._emitAction(obj.id, "reaction", btn.dataset.reaction);
        btn.style.transform = "scale(1.3)";
        setTimeout(() => { btn.style.transform = "scale(1)"; }, 200);
      });
    });
  }

  _inputClose(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    obj.data.closed = true;
    if (obj.data.inputType === "vote") this._renderVoteResults(obj);
    else this._renderInput(obj);
  }

  _inputStatus(cmd) {
    const obj = this.objects.get(cmd.id);
    if (!obj) return;
    const count = obj.data.responses?.size ?? 0;
    let status = obj.element.querySelector(".bb-input-status");
    if (!status) {
      status = document.createElement("div");
      status.className = "bb-input-status";
      status.style.fontSize = "13px";
      status.style.color = "var(--bb-text-muted)";
      status.style.marginTop = "8px";
      obj.element.appendChild(status);
    }
    status.textContent = `${count} response(s)`;
  }

  _inputClear(cmd) {
    this._objectDelete(cmd);
  }

  _emitAction(inputId, action, value) {
    const obj = this.objects.get(inputId);
    if (obj && obj.data.responses) {
      obj.data.responses.set(generateId(), { action, value, timestamp: Date.now() });
    }
    this.host.dispatchEvent(new CustomEvent("blackboard:action", {
      detail: {
        source: "agent-blackboard",
        agentId: this.host.agentId || "",
        boardUserId: this.host.boardUserId || "",
        sourceUserId: this.host.sourceUserId || "",
        sourceDisplayName: this.host.sourceDisplayName || "",
        inputId,
        action,
        value,
        correlationId: this.correlationId,
        timestamp: Date.now(),
      },
      bubbles: true,
      composed: true,
    }));
  }

  _setTTL(id, ms) {
    setTimeout(() => {
      const obj = this.objects.get(id);
      if (obj) this._objectDelete({ id });
    }, ms);
  }

  _extractYouTubeId(url) {
    const match = String(url).match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?/\s]+)/);
    return match ? match[1] : url;
  }

  _exportImage() {
    this.host.dispatchEvent(new CustomEvent("blackboard:export", {
      detail: { timestamp: Date.now() },
      bubbles: true,
      composed: true,
    }));
  }

  _restoreScene(data) {
    if (!data) return;
    if (data.theme) this.setTheme(data.theme);
    if (data.background) this.setBackground(data.background);
  }

  async applyCommands(commands) {
    const mode = commands.mode || "normal";
    if (mode === "atomic") {
      const snapshot = this._snapshot();
      try {
        for (const cmd of commands.commands || []) {
          await this.applyCommand(cmd);
        }
      } catch (e) {
        this._restoreSnapshot(snapshot);
        throw e;
      }
    } else {
      for (const cmd of commands.commands || []) {
        await this.applyCommand(cmd);
      }
    }
  }

  _snapshot() {
    return {
      objects: new Map(this.objects),
      theme: this.themeManager.currentTheme,
    };
  }

  _restoreSnapshot(snapshot) {
    this.clear();
    this.objects = new Map(snapshot.objects);
    this.themeManager.apply(snapshot.theme);
  }

  processProtocolLine(line) {
    const match = String(line).match(/^blackboard:([^:]*):([^:]*):(.+)$/);
    if (!match) return false;
    const agentId = match[1];
    const userId = match[2];
    const payloadB64 = match[3];
    try {
      const json = base64urlDecode(payloadB64);
      const payload = JSON.parse(json);
      this.host.agentId = agentId;
      this.host.boardUserId = userId || "";
      if (payload.correlationId) this.correlationId = payload.correlationId;
      if (payload.commands) {
        this.applyCommands(payload);
      } else {
        this.applyCommand(payload);
      }
      return true;
    } catch (e) {
      console.warn("[agent-blackboard] Invalid payload:", e);
      return false;
    }
  }
}

class AgentBlackboardElement extends HTMLElement {
  static get observedAttributes() {
    return ["theme", "show-ambient", "ambient-config"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.agentId = "";
    this.boardUserId = "";
    this.sourceUserId = "";
    this.sourceDisplayName = "";
    this._sceneManager = null;
    this._connected = false;
  }

  connectedCallback() {
    if (this._connected) return;
    this._connected = true;
    this._render();
    this._sceneManager = new SceneManager(this);
    this._sceneManager.init();
    this._setupObservers();
    this._applyAttributes();
    this.dispatchEvent(new CustomEvent("blackboard:ready", { bubbles: true, composed: true }));
  }

  disconnectedCallback() {
    this._teardownObservers();
    this._connected = false;
  }

  attributeChangedCallback() {
    if (!this._connected) return;
    this._applyAttributes();
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: var(--bb-bg, #0f172a);
          font-family: var(--bb-font, Inter, system-ui, sans-serif);
          color: var(--bb-text, #f1f5f9);
        }
        #scene {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .hidden {
          display: none !important;
        }
        .bb-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .bb-layer[data-layer="ui"],
        .bb-layer[data-layer="overlay"] {
          pointer-events: auto;
        }
        .bb-object {
          position: absolute;
          pointer-events: auto;
        }
        .bb-object[data-selectable="true"] {
          cursor: grab;
        }
        .bb-object.is-selected {
          outline: 2px dashed color-mix(in srgb, var(--bb-accent, #3b82f6) 85%, white);
          outline-offset: 4px;
        }
        .bb-object.is-dragging {
          cursor: grabbing !important;
        }
        .bb-type-box {
          min-width: 120px;
        }
        .bb-type-text {
          font-size: 16px;
          line-height: 1.5;
        }
        .bb-type-image img,
        .bb-type-screenshot img {
          max-width: 100%;
          max-height: 100%;
        }
        .bb-type-iframe {
          width: 100%;
          height: 100%;
        }
        .bb-type-iframe iframe {
          width: 100%;
          height: 100%;
          border: none;
          border-radius: var(--bb-radius, 8px);
        }
        #ambient-container {
          position: absolute;
          inset: 0;
          z-index: -1;
          opacity: 0.6;
          transition: opacity 500ms ease;
        }
        #ambient-container.hidden {
          opacity: 0;
          pointer-events: none;
        }
        #selection-editor {
          position: absolute;
          top: 14px;
          right: 14px;
          width: min(320px, calc(100% - 28px));
          z-index: 20;
          pointer-events: auto;
        }
        .bb-editor-card {
          border: 1px solid var(--bb-border, #475569);
          border-radius: 14px;
          padding: 14px;
          background: color-mix(in srgb, var(--bb-surface, #1e293b) 92%, white);
          box-shadow: var(--bb-shadow, 0 4px 24px rgba(0,0,0,0.3));
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .bb-editor-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .bb-editor-title {
          font-size: 15px;
          font-weight: 700;
        }
        .bb-editor-meta,
        .bb-editor-hint {
          color: var(--bb-text-muted, #94a3b8);
          font-size: 12px;
          line-height: 1.4;
        }
        .bb-editor-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }
        .bb-editor-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .bb-editor-field span {
          font-size: 12px;
          color: var(--bb-text-muted, #94a3b8);
        }
        .bb-editor-field input,
        .bb-editor-field textarea,
        .bb-editor-field button {
          font: inherit;
        }
        .bb-editor-field input,
        .bb-editor-field textarea {
          width: 100%;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid var(--bb-border, #475569);
          background: var(--bb-surface-2, #334155);
          color: var(--bb-text, #f1f5f9);
        }
        .bb-editor-field textarea {
          min-height: 108px;
          resize: vertical;
        }
        .bb-editor-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .bb-editor-actions button,
        .bb-editor-close {
          border: 1px solid var(--bb-border, #475569);
          border-radius: 10px;
          background: var(--bb-surface-2, #334155);
          color: var(--bb-text, #f1f5f9);
          padding: 8px 10px;
          cursor: pointer;
        }
        .bb-editor-close {
          min-width: 38px;
        }
        .bb-editor-actions .danger {
          color: var(--bb-danger, #ef4444);
        }
      </style>
      <div id="ambient-container"></div>
      <div id="scene"></div>
      <div id="selection-editor" class="hidden">
        <div class="bb-editor-card">
          <div class="bb-editor-head">
            <div>
              <div class="bb-editor-title" id="selection-editor-title">Selected object</div>
              <div class="bb-editor-meta" id="selection-editor-meta"></div>
            </div>
            <button type="button" class="bb-editor-close" id="selection-editor-close" aria-label="Close editor">×</button>
          </div>
          <div class="bb-editor-grid">
            <label class="bb-editor-field">
              <span>x</span>
              <input id="selection-editor-x" type="number" />
            </label>
            <label class="bb-editor-field">
              <span>y</span>
              <input id="selection-editor-y" type="number" />
            </label>
            <label class="bb-editor-field">
              <span>width</span>
              <input id="selection-editor-w" type="number" />
            </label>
            <label class="bb-editor-field">
              <span>height</span>
              <input id="selection-editor-h" type="number" />
            </label>
          </div>
          <label class="bb-editor-field hidden" id="selection-editor-title-field">
            <span>title</span>
            <input id="selection-editor-title-input" type="text" />
          </label>
          <label class="bb-editor-field">
            <span>content / payload</span>
            <textarea id="selection-editor-content"></textarea>
          </label>
          <div class="bb-editor-hint" id="selection-editor-hint"></div>
          <div class="bb-editor-actions">
            <button type="button" id="selection-editor-front">Bring front</button>
            <button type="button" id="selection-editor-save">Save</button>
            <button type="button" class="danger" id="selection-editor-delete">Delete</button>
          </div>
        </div>
      </div>
    `;
  }

  _setupObservers() {
    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(this);
  }

  _teardownObservers() {
    this._ro?.disconnect();
  }

  _resize() {
    // Scene auto-resizes via CSS
  }

  _applyAttributes() {
    const theme = this.getAttribute("theme");
    if (theme && this._sceneManager) this._sceneManager.setTheme(theme);
    const showAmbient = this.getAttribute("show-ambient");
    const ambientContainer = this.shadowRoot.getElementById("ambient-container");
    if (ambientContainer) {
      if (showAmbient === "false" || showAmbient === "hidden") {
        ambientContainer.classList.add("hidden");
      } else {
        ambientContainer.classList.remove("hidden");
      }
    }
  }

  get sceneManager() {
    return this._sceneManager;
  }

  clear() {
    this._sceneManager?.clear();
  }

  clearLayer(layer) {
    this._sceneManager?.clearLayer(layer);
  }

  setTheme(name) {
    this._sceneManager?.setTheme(name);
  }

  setBackground(params) {
    this._sceneManager?.setBackground(params);
  }

  setLayout(name) {
    this._sceneManager?.setLayout(name);
  }

  applyCommand(cmd) {
    return this._sceneManager?.applyCommand(cmd);
  }

  applyCommands(payload) {
    return this._sceneManager?.applyCommands(payload);
  }

  processProtocolLine(line) {
    return this._sceneManager?.processProtocolLine(line);
  }

  getState() {
    if (!this._sceneManager) return {};
    return {
      agentId: this.agentId,
      boardUserId: this.boardUserId,
      objectCount: this._sceneManager.objects.size,
      theme: this._sceneManager.themeManager.currentTheme,
      correlationId: this._sceneManager.correlationId,
    };
  }

  destroy() {
    this._sceneManager?.clear();
    this._teardownObservers();
    this._connected = false;
    this.dispatchEvent(new CustomEvent("blackboard:destroyed", { bubbles: true, composed: true }));
  }

  setupAmbient(options = {}) {
    const container = this.shadowRoot.getElementById("ambient-container");
    if (!container) return;
    if (!customElements.get("axi-ambient")) {
      console.warn("[agent-blackboard] axi-ambient not loaded");
      return;
    }
    const ambient = document.createElement("axi-ambient");
    ambient.setAttribute("effect", options.effect || "ambient");
    ambient.setAttribute("density", String(options.density || 600));
    ambient.setAttribute("speed", String(options.speed || 0.8));
    ambient.setAttribute("intensity", String(options.intensity || 0.6));
    ambient.style.width = "100%";
    ambient.style.height = "100%";
    container.innerHTML = "";
    container.appendChild(ambient);
    ambient.startCycle();
    this._ambientEl = ambient;
  }

  removeAmbient() {
    const container = this.shadowRoot.getElementById("ambient-container");
    if (container) {
      container.classList.add("hidden");
    }
    this._ambientEl = null;
  }

  showAmbient() {
    const container = this.shadowRoot.getElementById("ambient-container");
    if (container) container.classList.remove("hidden");
  }

  hideAmbient() {
    const container = this.shadowRoot.getElementById("ambient-container");
    if (container) container.classList.add("hidden");
  }
}

if (!customElements.get("agent-blackboard")) {
  customElements.define("agent-blackboard", AgentBlackboardElement);
}

function createBlackboardSDK(agentId, options = {}) {
  const sdk = {
    agentId,
    userId: options.userId || "",
    _lines: [],

    toAll() {
      sdk.userId = "";
      return sdk;
    },

    toUser(userId) {
      sdk.userId = userId;
      return sdk;
    },

    command(op, params = {}) {
      const cmd = { op, ...params };
      sdk._lines.push(cmd);
      return sdk;
    },

    batch(commands) {
      sdk._lines.push(...commands);
      return sdk;
    },

    clear() {
      return sdk.command("scene.clear");
    },

    theme(name) {
      return sdk.command("scene.theme", { content: name });
    },

    background(params) {
      return sdk.command("scene.background", { content: params });
    },

    exportImage(params) {
      return sdk.command("scene.exportImage", params);
    },

    text(id, text, options = {}) {
      return sdk.command("text.show", { id, content: text, layer: options.layer, geometry: options.geometry, style: options.style, transition: options.transition });
    },

    typeText(id, text, options = {}) {
      return sdk.command("text.show", { id, content: text, layer: options.layer, geometry: options.geometry, style: options.style, transition: { type: "typewriter", durationMs: options.durationMs || 1500 } });
    },

    box(id, options = {}) {
      return sdk.command("object.create", { id, type: "box", content: options.content, layer: options.layer || "ui", geometry: options.geometry, style: options.style, transition: options.transition });
    },

    image(id, asset, options = {}) {
      return sdk.command("image.show", { id, content: typeof asset === "string" ? asset : asset.url, layer: options.layer || "media", geometry: options.geometry, style: options.style, transition: options.transition });
    },

    svg(id, svgOrAsset, options = {}) {
      const content = typeof svgOrAsset === "string" ? svgOrAsset : (svgOrAsset.content || "");
      return sdk.command("svg.show", { id, content, layer: options.layer || "vector", geometry: options.geometry, style: options.style, transition: options.transition });
    },

    screenshot(id, asset, options = {}) {
      return sdk.command("screenshot.show", { id, content: typeof asset === "string" ? asset : asset.url, layer: options.layer || "media", geometry: options.geometry });
    },

    youtubeSegment(id, url, startSec, endSec, options = {}) {
      return sdk.command("youtube.segment", { id, content: { url, start: startSec, end: endSec }, layer: options.layer || "media", geometry: options.geometry });
    },

    table(id, dataOrRows, options = {}) {
      const isStructured = dataOrRows && typeof dataOrRows === "object" && !Array.isArray(dataOrRows);
      const headers = isStructured ? (dataOrRows.headers || options.headers || []) : (options.headers || []);
      const rows = isStructured ? (dataOrRows.rows || []) : dataOrRows;
      return sdk.command("table.show", { id, content: { headers, rows }, layer: options.layer || "ui", geometry: options.geometry, style: options.style, transition: options.transition });
    },

    list(id, items, options = {}) {
      return sdk.command("list.show", { id, content: items, layer: options.layer || "ui", geometry: options.geometry, style: options.style, transition: options.transition, title: options.title, hiddenItems: options.hiddenItems });
    },

    timer(id, seconds, options = {}) {
      return sdk.command("timer.show", { id, content: { seconds, mode: options.mode || "countdown", label: options.label || "" }, layer: options.layer || "ui", geometry: options.geometry, style: options.style, transition: options.transition });
    },

    progress(id, params, options = {}) {
      const content = typeof params === "number"
        ? { value: params, max: options.max || 100, label: options.label || "" }
        : { value: params?.value ?? 0, max: params?.max ?? 100, label: params?.label || options.label || "" };
      return sdk.command("progress.show", { id, content, layer: options.layer || "ui", geometry: options.geometry, style: options.style, transition: options.transition });
    },

    askText(id, prompt, options = {}) {
      return sdk.command("input.text", { id, content: { prompt, placeholder: options.placeholder || "" }, layer: options.layer || "ui", geometry: options.geometry, style: options.style, transition: options.transition });
    },

    askPrivateText(id, prompt, options = {}) {
      return sdk.command("input.privateText", { id, content: { prompt, placeholder: options.placeholder || "" }, layer: options.layer || "ui", geometry: options.geometry, style: options.style, transition: options.transition });
    },

    askChoice(id, prompt, options = {}) {
      return sdk.command("input.choice", { id, content: { prompt, options: options.options || [] }, layer: options.layer || "ui", geometry: options.geometry, style: options.style, transition: options.transition });
    },

    askMultiChoice(id, prompt, options = {}) {
      return sdk.command("input.multiChoice", { id, content: { prompt, options: options.options || [] }, layer: options.layer || "ui", geometry: options.geometry, style: options.style, transition: options.transition });
    },

    askVote(id, question, options = {}) {
      return sdk.command("input.vote", { id, content: { prompt: question, options: options.options || [] }, layer: options.layer || "ui", geometry: options.geometry, style: options.style, transition: options.transition });
    },

    askReaction(id, prompt, options = {}) {
      return sdk.command("input.reaction", { id, content: { prompt, reactions: options.reactions || ["👍", "👎", "❤️", "🎉", "😂", "🤔"] }, layer: options.layer || "ui", geometry: options.geometry, style: options.style, transition: options.transition });
    },

    closeInput(id) {
      return sdk.command("input.close", { id });
    },

    build() {
      const payload = {
        version: 1,
        commands: [...sdk._lines],
        mode: "normal",
        correlationId: options.correlationId || null,
        meta: options.meta || {},
      };
      sdk._lines = [];
      return payload;
    },

    emit() {
      const payload = sdk.build();
      const json = JSON.stringify(payload);
      const encoded = btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      const line = `blackboard:${sdk.agentId}:${sdk.userId}:${encoded}`;
      sdk._lines = [];
      return line;
    },

    applyTo(blackboardEl) {
      const line = sdk.emit();
      blackboardEl.processProtocolLine(line);
      sdk._lines = [];
      return sdk;
    },
  };

  return sdk;
}

export { AgentBlackboardElement, createBlackboardSDK, DEFAULT_THEMES, VALID_OPS, VALID_TYPES, VALID_LAYERS, VALID_TRANSITIONS };
