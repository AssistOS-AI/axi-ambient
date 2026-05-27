export const asciiTargets = {
  axi: `
   #######
 ## AXI  ##
#  DEMO   #
 ## LAB  ##
   #######
  `,
  research: `
 @@@@@@@@
@@      @@
@RESEARCH@
@@      @@
 @@@@@@@@
  `,
};

export const sampleSVG = `
  <svg viewBox="0 0 220 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="14" width="84" height="84" rx="12" fill="none" stroke="#7a6c58" stroke-width="3"/>
    <circle cx="160" cy="56" r="32" fill="none" stroke="#8e7f69" stroke-width="3"/>
    <path d="M98 56 H128" fill="none" stroke="#b08d57" stroke-width="3" stroke-linecap="round"/>
  </svg>
`;

export const backgroundPresets = {
  paper: { color: "#f8f6f2", image: "" },
  "soft-gray": { color: "#efebe5", image: "" },
  "warm-gray": { color: "#e6ddd2", image: "" },
  gradient: {
    gradient: {
      direction: "180deg",
      stops: ["#faf7f2", "#ece4d8", "#dfd4c4"],
    },
    image: "",
  },
};

export const alphaPresets = {
  none: {
    alphaField: { type: "none", stops: [{ pos: 0, alpha: 1 }, { pos: 1, alpha: 1 }] },
    alphaMasks: [],
  },
  vertical: {
    alphaField: { type: "vertical", stops: [{ pos: 0, alpha: 0.04 }, { pos: 0.4, alpha: 0.12 }, { pos: 1, alpha: 0.9 }] },
    alphaMasks: [],
  },
  horizontal: {
    alphaField: { type: "horizontal", stops: [{ pos: 0, alpha: 0.04 }, { pos: 0.45, alpha: 0.1 }, { pos: 1, alpha: 0.88 }] },
    alphaMasks: [],
  },
  radial: {
    alphaField: { type: "radial", stops: [{ pos: 0, alpha: 0.95 }, { pos: 1, alpha: 0.08 }] },
    alphaMasks: [],
  },
  linear: {
    alphaField: {
      type: "linear",
      linear: { x1: 0.08, y1: 0.1, x2: 0.92, y2: 0.9 },
      stops: [{ pos: 0, alpha: 0.05 }, { pos: 0.55, alpha: 0.18 }, { pos: 1, alpha: 0.9 }],
    },
    alphaMasks: [],
  },
  "hero-mask": {
    alphaField: { type: "vertical", stops: [{ pos: 0, alpha: 0.05 }, { pos: 0.35, alpha: 0.12 }, { pos: 1, alpha: 0.86 }] },
    alphaMasks: [{ x: 0.05, y: 0.08, w: 0.42, h: 0.22, alpha: 0.03, feather: 0.16 }],
  },
  "dashboard-mask": {
    alphaField: { type: "horizontal", stops: [{ pos: 0, alpha: 0.05 }, { pos: 0.45, alpha: 0.1 }, { pos: 1, alpha: 0.84 }] },
    alphaMasks: [
      { x: 0.06, y: 0.08, w: 0.38, h: 0.2, alpha: 0.03, feather: 0.16 },
      { x: 0.58, y: 0.58, w: 0.28, h: 0.22, alpha: 0.06, feather: 0.14 },
    ],
  },
};

const placementSlots = {
  title: [{ x: 0.04, y: 0.04, w: 0.5, h: 0.08 }],
  note: [{ x: 0.04, y: 0.14, w: 0.48, h: 0.08 }],
  box: [{ x: 0.04, y: 0.28, w: 0.28, h: 0.18 }],
  card: [{ x: 0.36, y: 0.28, w: 0.26, h: 0.18 }],
  list: [{ x: 0.68, y: 0.24, w: 0.26, h: 0.22 }],
  table: [{ x: 0.04, y: 0.72, w: 0.42, h: 0.2 }],
  timer: [{ x: 0.78, y: 0.04, w: 0.15, h: 0.12 }],
  progress: [{ x: 0.72, y: 0.18, w: 0.22, h: 0.08 }],
  input: [{ x: 0.67, y: 0.56, w: 0.28, h: 0.18 }],
  image: [{ x: 0.38, y: 0.46, w: 0.34, h: 0.26 }],
  youtube: [{ x: 0.29, y: 0.4, w: 0.44, h: 0.36 }],
  svg: [{ x: 0.68, y: 0.72, w: 0.22, h: 0.16 }],
  line: [{ x: 0.05, y: 0.58, w: 0.34, h: 0.04 }],
  arrow: [{ x: 0.05, y: 0.64, w: 0.3, h: 0.06 }],
  rect: [{ x: 0.7, y: 0.5, w: 0.14, h: 0.12 }],
  circle: [{ x: 0.84, y: 0.48, w: 0.08, h: 0.08 }],
  path: [{ x: 0.05, y: 0.7, w: 0.22, h: 0.08 }],
};

export function createPlacementPlanner() {
  const counters = new Map();

  return {
    reset() {
      counters.clear();
    },

    next(slotName, mode, stage, extras = {}) {
      const slot = placementSlots[slotName] || placementSlots.box;
      const index = counters.get(slotName) || 0;
      counters.set(slotName, index + 1);
      const base = slot[index % slot.length];
      const width = Math.round(stage.width * base.w);
      const height = Math.round(stage.height * base.h);
      let x = Math.round(stage.width * base.x);
      let y = Math.round(stage.height * base.y);

      if (mode === "staggered") {
        const offset = Math.min(index * 16, 48);
        x += offset;
        y += offset;
      } else if (mode === "random-safe") {
        const margin = 12;
        const maxX = Math.max(margin, stage.width - width - margin);
        const maxY = Math.max(margin, stage.height - height - margin);
        x = Math.round(margin + Math.random() * Math.max(0, maxX - margin));
        y = Math.round(margin + Math.random() * Math.max(0, maxY - margin));
      } else {
        const offset = Math.min(index * 8, 24);
        x += offset;
        y += offset;
      }

      return { x, y, width, height, ...extras };
    },
  };
}
