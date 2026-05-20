import { createBlackboardSDK } from "../agent-blackboard.mjs";
import { backgroundPresets, createPlacementPlanner, sampleSVG } from "./presets.mjs";

function encodeProtocol(agentId, userId, payload) {
  const json = JSON.stringify(payload);
  const encoded = btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  return `blackboard:${agentId}:${userId}:${encoded}`;
}

export class BlackboardEditor {
  constructor({ bb, stageFrame, onStatus, onStateChange }) {
    this.bb = bb;
    this.stageFrame = stageFrame;
    this.onStatus = onStatus;
    this.onStateChange = onStateChange;
    this.idCounters = new Map();
    this.placementMode = "random-safe";
    this.planner = createPlacementPlanner();
  }

  init() {
    this.applyTheme("minimal");
    this.applyBackground("paper");
    this.syncState();
  }

  syncState() {
    this.onStateChange(this.bb.getState().objectCount || 0);
  }

  getStageSize() {
    const rect = this.stageFrame.getBoundingClientRect();
    return {
      width: Math.max(480, Math.round(rect.width)),
      height: Math.max(270, Math.round(rect.height)),
    };
  }

  nextId(prefix) {
    const value = (this.idCounters.get(prefix) || 0) + 1;
    this.idCounters.set(prefix, value);
    return `${prefix}-${value}`;
  }

  resetIds() {
    this.idCounters.clear();
    this.planner.reset();
  }

  normalizePosition(position) {
    if (!position) return null;
    const stage = this.getStageSize();
    return {
      x: Math.max(12, Math.min(stage.width - 24, Math.round(position.x))),
      y: Math.max(12, Math.min(stage.height - 24, Math.round(position.y))),
    };
  }

  geometry(slot, extras = {}) {
    return this.planner.next(slot, this.placementMode, this.getStageSize(), extras);
  }

  placedGeometry(slot, position = null, extras = {}) {
    const next = this.normalizePosition(position);
    if (!next) return this.geometry(slot, extras);
    return this.geometry(slot, { ...extras, x: next.x, y: next.y });
  }

  clientToBoardPosition(clientX, clientY) {
    const rect = this.bb.getBoundingClientRect();
    return this.normalizePosition({ x: clientX - rect.left, y: clientY - rect.top });
  }

  setPlacementMode(mode) {
    this.placementMode = mode;
  }

  applyTheme(theme) {
    this.bb.setTheme(theme);
    this.onStatus(`Theme changed to <strong>${theme}</strong>.`);
  }

  applyBackground(name) {
    if (name === "live-ambient") {
      this.bb.setupAmbient({ effect: "ambient", density: 520, speed: 1.8, intensity: 0.45 });
      this.bb.showAmbient();
      this.bb.setBackground({ color: "transparent", image: "" });
      this.onStatus("Blackboard background switched to live ambient.");
      return;
    }

    this.bb.hideAmbient();
    this.bb.setBackground(backgroundPresets[name] || backgroundPresets.paper);
    this.onStatus(`Blackboard background changed to <strong>${name}</strong>.`);
  }

  clearBoard() {
    this.bb.clear();
    this.resetIds();
    this.syncState();
    this.onStatus("Blackboard cleared.");
  }

  clearUiLayer() {
    this.bb.clearLayer("ui");
    this.syncState();
    this.onStatus("UI layer cleared.");
  }

  exportScene() {
    this.bb.applyCommand({ op: "scene.exportImage" });
    this.onStatus("Export event emitted from blackboard.");
  }

  addTitle(text = "Agent-controlled board", position = null) {
    const id = this.nextId("title");
    this.bb.applyCommand({
      op: "text.show",
      id,
      content: text,
      geometry: this.placedGeometry("title", position),
      style: { fontSize: "32px", fontWeight: "700", color: "var(--bb-accent)" },
      transition: { type: "slideIn", durationMs: 320 },
    });
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  addNote(text = "Select any object directly on the board to edit its stored command, move it, or delete it.", position = null) {
    const id = this.nextId("note");
    this.bb.applyCommand({
      op: "text.show",
      id,
      content: text,
      geometry: this.placedGeometry("note", position),
      style: { fontSize: "15px", color: "var(--bb-text-muted)" },
      transition: { type: "fadeIn", durationMs: 280 },
    });
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  addBox(position = null) {
    const id = this.nextId("box");
    this.bb.applyCommand({
      op: "object.create",
      id,
      type: "box",
      content: "Editable box\n\nThe blackboard now owns the selection popup and save flow.",
      geometry: this.placedGeometry("box", position),
      style: { padding: "18px", borderWidth: "2px", borderStyle: "solid", borderColor: "var(--bb-accent)" },
      transition: { type: "scaleIn", durationMs: 260 },
    });
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  addCard(position = null) {
    const id = this.nextId("card");
    this.bb.applyCommand({
      op: "object.create",
      id,
      type: "box",
      content: "Card block\n\nClick to select, drag to move, then edit the remembered command in the popup.",
      geometry: this.placedGeometry("card", position),
      style: {
        padding: "18px",
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "var(--bb-success)",
        backgroundColor: "rgba(34,197,94,0.08)",
      },
      transition: { type: "scaleIn", durationMs: 260 },
    });
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  addList(position = null) {
    const id = this.nextId("list");
    this.bb.applyCommand({
      op: "list.show",
      id,
      title: "Checklist",
      content: ["Add objects", "Drag them", "Click one", "Edit the saved payload"],
      geometry: this.placedGeometry("list", position),
      hiddenItems: [3],
      style: { padding: "12px" },
      transition: { type: "slideIn", durationMs: 260 },
    });
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  addTable(position = null) {
    const id = this.nextId("table");
    this.bb.applyCommand({
      op: "table.show",
      id,
      content: {
        headers: ["Area", "Status", "Mode"],
        rows: [["Stage", "Bounded", "manual"], ["Editor", "Component-owned", "popup"], ["Placement", "Random", "default"]],
      },
      geometry: this.placedGeometry("table", position),
      style: { padding: "8px" },
      transition: { type: "fadeIn", durationMs: 260 },
    });
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  addTimer(position = null) {
    const id = this.nextId("timer");
    this.bb.applyCommand({
      op: "timer.show",
      id,
      content: { seconds: 60, label: "Round timer" },
      geometry: this.placedGeometry("timer", position),
      transition: { type: "scaleIn", durationMs: 240 },
    });
    this.bb.applyCommand({ op: "timer.start", id });
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  addProgress(position = null) {
    const id = this.nextId("progress");
    this.bb.applyCommand({
      op: "progress.show",
      id,
      content: { value: 55, max: 100, label: "Scene progress" },
      geometry: this.placedGeometry("progress", position),
    });
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  addChoice(position = null) {
    const id = this.nextId("choice");
    this.bb.applyCommand({
      op: "input.choice",
      id,
      content: { prompt: "Select a layout:", options: ["Structured", "Staggered", "Random safe"] },
      geometry: this.placedGeometry("input", position),
      transition: { type: "fadeIn", durationMs: 240 },
    });
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  addVote(position = null) {
    const id = this.nextId("vote");
    this.bb.applyCommand({
      op: "input.vote",
      id,
      content: { prompt: "What should be revealed next?", options: ["Scoreboard", "Hint", "Recap"] },
      geometry: this.placedGeometry("input", position),
      transition: { type: "fadeIn", durationMs: 240 },
    });
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  addReaction(position = null) {
    const id = this.nextId("reaction");
    this.bb.applyCommand({
      op: "input.reaction",
      id,
      content: { prompt: "Quick reaction", reactions: ["👍", "👏", "🔥", "🎯", "🤔", "🚀"] },
      geometry: this.placedGeometry("input", position),
      transition: { type: "fadeIn", durationMs: 240 },
    });
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  addImage(url = "https://picsum.photos/seed/axi-editor/720/420", position = null) {
    const id = this.nextId("image");
    this.bb.applyCommand({
      op: "image.show",
      id,
      content: url,
      geometry: this.placedGeometry("image", position),
      transition: { type: "fadeIn", durationMs: 260 },
    });
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  addYoutube(url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ", position = null) {
    const id = this.nextId("youtube");
    this.bb.applyCommand({
      op: "youtube.segment",
      id,
      content: { url, start: 0, end: 20 },
      geometry: this.placedGeometry("youtube", position),
    });
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  addSvg(position = null) {
    const id = this.nextId("svg");
    this.bb.applyCommand({
      op: "svg.show",
      id,
      content: sampleSVG,
      geometry: this.placedGeometry("svg", position),
      transition: { type: "scaleIn", durationMs: 240 },
    });
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  addShape(kind, position = null) {
    const id = this.nextId(kind);
    if (kind === "line") {
      this.bb.applyCommand({
        op: "shape.line",
        id,
        geometry: this.placedGeometry("line", position, { x1: 0, y1: 6, x2: 320, y2: 6, height: 12 }),
        style: { color: "var(--bb-accent)", strokeWidth: 3 },
        transition: { type: "draw", durationMs: 340 },
      });
    } else if (kind === "arrow") {
      this.bb.applyCommand({
        op: "shape.arrow",
        id,
        geometry: this.placedGeometry("arrow", position, { x1: 0, y1: 18, x2: 270, y2: 18, height: 38 }),
        style: { color: "var(--bb-success)", strokeWidth: 3 },
        transition: { type: "draw", durationMs: 340 },
      });
    } else if (kind === "rect") {
      this.bb.applyCommand({
        op: "shape.rect",
        id,
        geometry: this.placedGeometry("rect", position),
        style: { fill: "rgba(122,108,88,0.12)", color: "var(--bb-accent)", strokeWidth: 2, rx: 10 },
      });
    } else if (kind === "circle") {
      const circle = this.placedGeometry("circle", position);
      this.bb.applyCommand({
        op: "shape.circle",
        id,
        geometry: { x: circle.x, y: circle.y, radius: 34 },
        style: { fill: "rgba(34,197,94,0.12)", color: "var(--bb-success)", strokeWidth: 2 },
      });
    } else {
      this.bb.applyCommand({
        op: "shape.path",
        id,
        content: "M 10 58 Q 60 14 112 58 T 214 58",
        geometry: this.placedGeometry("path", position),
        style: { fill: "none", color: "var(--bb-warning)", strokeWidth: 3 },
        transition: { type: "draw", durationMs: 420 },
      });
    }
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  createCustom({ kind, label, body, url, options, position = null }) {
    if (kind === "text") {
      this.addNote(body || label, position);
      return;
    }
    if (kind === "box") {
      const id = this.nextId("custom-box");
      this.bb.applyCommand({
        op: "object.create",
        id,
        type: "box",
        content: `${label}\n\n${body}`,
        geometry: this.placedGeometry("box", position),
        style: { padding: "18px", borderWidth: "2px", borderStyle: "solid", borderColor: "var(--bb-accent)" },
      });
      this.syncState();
      this.onStatus(`Added <strong>${id}</strong>.`);
      return;
    }
    if (kind === "image") {
      this.addImage(url, position);
      return;
    }
    if (kind === "youtube") {
      this.addYoutube(url, position);
      return;
    }
    if (kind === "choice") {
      const id = this.nextId("custom-choice");
      this.bb.applyCommand({
        op: "input.choice",
        id,
        content: { prompt: label, options: options.length ? options : ["Option A", "Option B", "Option C"] },
        geometry: this.placedGeometry("input", position),
      });
      this.syncState();
      this.onStatus(`Added <strong>${id}</strong>.`);
      return;
    }
    const id = this.nextId("private");
    this.bb.applyCommand({
      op: "input.privateText",
      id,
      content: { prompt: label, placeholder: body },
      geometry: this.placedGeometry("input", position),
    });
    this.syncState();
    this.onStatus(`Added <strong>${id}</strong>.`);
  }

  runProtocolCommon() {
    const payload = {
      version: 1,
      commands: [
        { op: "scene.clear" },
        { op: "scene.theme", content: "quiz" },
        { op: "text.show", id: "proto-title", content: "Protocol / common board", geometry: { x: 40, y: 24, width: 420 }, style: { fontSize: "28px", fontWeight: "700", color: "var(--bb-accent)" } },
        { op: "timer.show", id: "proto-timer", content: { seconds: 25, label: "Fast round" }, geometry: { x: 690, y: 24, width: 170 } },
        { op: "list.show", id: "proto-list", title: "Reveal order", content: ["Briefing", "Prompt", "Vote"], geometry: { x: 40, y: 120, width: 260 }, hiddenItems: [2] },
      ],
    };
    this.bb.processProtocolLine(encodeProtocol("socrates", "", payload));
    this.syncState();
    this.onStatus("Applied common-board protocol flow.");
  }

  runProtocolPrivate() {
    const payload = {
      version: 1,
      commands: [
        { op: "scene.clear" },
        { op: "scene.theme", content: "mystery" },
        { op: "text.show", id: "private-title", content: "Private board for user-ana", geometry: { x: 40, y: 24, width: 420 }, style: { fontSize: "26px", fontWeight: "700", color: "var(--bb-warning)" } },
        { op: "input.privateText", id: "private-role", content: { prompt: "Your hidden role", placeholder: "type here..." }, geometry: { x: 40, y: 110, width: 320 } },
      ],
    };
    this.bb.processProtocolLine(encodeProtocol("socrates", "user-ana", payload));
    this.syncState();
    this.onStatus("Applied private-board protocol flow.");
  }

  runSdkFlow(kind) {
    const sdk = createBlackboardSDK(kind);
    if (kind === "quiz-master") {
      sdk.clear()
        .theme("quiz")
        .text("quiz-title", "Quiz Time!", { geometry: { x: 40, y: 24, width: 420 }, style: { fontSize: "30px", fontWeight: "700", color: "var(--bb-accent)" } })
        .timer("quiz-timer", 30, { geometry: { x: 700, y: 24, width: 160 }, label: "Time left" })
        .text("quiz-question", "Which layer stores list and input widgets?", { geometry: { x: 40, y: 100, width: 520 }, style: { fontSize: "18px" } })
        .askChoice("quiz-answer", "Choose:", { options: ["vector", "ui", "overlay"], geometry: { x: 40, y: 180, width: 320 } })
        .applyTo(this.bb);
      this.syncState();
      this.onStatus("Ran SDK quiz flow.");
      return;
    }
    if (kind === "game-host") {
      sdk.clear()
        .theme("playful")
        .text("game-title", "Social game board", { geometry: { x: 40, y: 24, width: 360 }, style: { fontSize: "28px", fontWeight: "700", color: "var(--bb-accent-2)" } })
        .list("game-roles", ["Detective", "Impostor", "Witness", "Analyst"], { title: "Roles", geometry: { x: 40, y: 100, width: 260 }, hiddenItems: [0, 1, 2, 3] })
        .askPrivateText("game-role", "Your secret role", { geometry: { x: 40, y: 300, width: 320 } })
        .applyTo(this.bb);
      this.syncState();
      this.onStatus("Ran SDK game flow.");
      return;
    }
    if (kind === "pitch-coach") {
      sdk.clear()
        .theme("formal")
        .text("pitch-title", "Absurd pitch challenge", { geometry: { x: 40, y: 24, width: 440 }, style: { fontSize: "28px", fontWeight: "700", color: "var(--bb-accent)" } })
        .timer("pitch-timer", 60, { geometry: { x: 700, y: 24, width: 160 }, label: "Pitch time" })
        .table("pitch-score", { headers: ["Team", "Score", "Creativity"], rows: [["Team A", 0, "pending"], ["Team B", 0, "pending"]] }, { geometry: { x: 40, y: 120, width: 430 } })
        .askReaction("pitch-ready", "Ready to pitch?", { geometry: { x: 40, y: 330, width: 320 }, reactions: ["🚀", "💡", "🎯", "🔥"] })
        .applyTo(this.bb);
      this.syncState();
      this.onStatus("Ran SDK pitch flow.");
      return;
    }
    sdk.clear()
      .theme("minimal")
      .text("recap-title", "Session recap", { geometry: { x: 40, y: 24, width: 320 }, style: { fontSize: "28px", fontWeight: "700", color: "var(--bb-accent)" } })
      .list("recap-items", ["Empty start", "Accordion controls", "Component popup", "Ambient side"], { geometry: { x: 40, y: 100, width: 340 } })
      .progress("recap-progress", { value: 100, max: 100, label: "Coverage" }, { geometry: { x: 40, y: 290, width: 320 } })
      .text("recap-end", "SDK recap now runs end to end.", { geometry: { x: 40, y: 350, width: 420 }, style: { fontSize: "18px", color: "var(--bb-success)" } })
      .applyTo(this.bb);
    this.syncState();
    this.onStatus("Ran SDK recap flow.");
  }
}
