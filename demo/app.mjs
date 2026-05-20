import { BlackboardEditor } from "./blackboard-editor.mjs";
import { AmbientPlayground } from "./ambient-playground.mjs";
import { buildAsciiLibraryIndex, loadAsciiLibrary } from "./ascii-library.mjs";

const elements = {
  bb: document.getElementById("bb"),
  stageFrame: document.querySelector(".stage-frame"),
  statusText: document.getElementById("statusText"),
  stateText: document.getElementById("stateText"),
  themeSelect: document.getElementById("themeSelect"),
  backgroundSelect: document.getElementById("backgroundSelect"),
  placementSelect: document.getElementById("placementSelect"),
  ambientRoot: document.getElementById("ambientRoot"),
  ambientPlaceholder: document.getElementById("ambientPlaceholder"),
  ambientMeta: document.getElementById("ambientMeta"),
  ambientTargetSelect: document.getElementById("ambientTargetSelect"),
  ambientAsciiUploadField: document.getElementById("ambientAsciiUploadField"),
  ambientAsciiFile: document.getElementById("ambientAsciiFile"),
  ambientLibraryFields: document.getElementById("ambientLibraryFields"),
  ambientLibraryCategorySelect: document.getElementById("ambientLibraryCategorySelect"),
  ambientLibrarySubcategorySelect: document.getElementById("ambientLibrarySubcategorySelect"),
  ambientLibraryArtSelect: document.getElementById("ambientLibraryArtSelect"),
  ambientLibraryPreview: document.getElementById("ambientLibraryPreview"),
  ambientHoldSelect: document.getElementById("ambientHoldSelect"),
  ambientExplosionSelect: document.getElementById("ambientExplosionSelect"),
  ambientAlphaSelect: document.getElementById("ambientAlphaSelect"),
  ambientDensityRange: document.getElementById("ambientDensityRange"),
  ambientDensityValue: document.getElementById("ambientDensityValue"),
  ambientSpeedRange: document.getElementById("ambientSpeedRange"),
  ambientSpeedValue: document.getElementById("ambientSpeedValue"),
  ambientPullRange: document.getElementById("ambientPullRange"),
  ambientPullValue: document.getElementById("ambientPullValue"),
  ambientSpreadRange: document.getElementById("ambientSpreadRange"),
  ambientSpreadValue: document.getElementById("ambientSpreadValue"),
  ambientDriftRange: document.getElementById("ambientDriftRange"),
  ambientDriftValue: document.getElementById("ambientDriftValue"),
  ambientDriftSpeedRange: document.getElementById("ambientDriftSpeedRange"),
  ambientDriftSpeedValue: document.getElementById("ambientDriftSpeedValue"),
  ambientIntensityRange: document.getElementById("ambientIntensityRange"),
  ambientIntensityValue: document.getElementById("ambientIntensityValue"),
  ambientParticleShapeSelect: document.getElementById("ambientParticleShapeSelect"),
  ambientColorModeSelect: document.getElementById("ambientColorModeSelect"),
  ambientBaseColor: document.getElementById("ambientBaseColor"),
  ambientShapeColor: document.getElementById("ambientShapeColor"),
  ambientExplodeColor: document.getElementById("ambientExplodeColor"),
  ambientPaletteSelect: document.getElementById("ambientPaletteSelect"),
  ambientSizeMinRange: document.getElementById("ambientSizeMinRange"),
  ambientSizeMinValue: document.getElementById("ambientSizeMinValue"),
  ambientSizeMaxRange: document.getElementById("ambientSizeMaxRange"),
  ambientSizeMaxValue: document.getElementById("ambientSizeMaxValue"),
  ambientSizeHoldRange: document.getElementById("ambientSizeHoldRange"),
  ambientSizeHoldValue: document.getElementById("ambientSizeHoldValue"),
  ambientChaosRange: document.getElementById("ambientChaosRange"),
  ambientChaosValue: document.getElementById("ambientChaosValue"),
  ambientConvergeRange: document.getElementById("ambientConvergeRange"),
  ambientConvergeValue: document.getElementById("ambientConvergeValue"),
  ambientHoldDurationRange: document.getElementById("ambientHoldDurationRange"),
  ambientHoldDurationValue: document.getElementById("ambientHoldDurationValue"),
  ambientExplodeDurationRange: document.getElementById("ambientExplodeDurationRange"),
  ambientExplodeDurationValue: document.getElementById("ambientExplodeDurationValue"),
  modal: document.getElementById("customModal"),
  customForm: document.getElementById("customForm"),
  modalKind: document.getElementById("modalKind"),
  modalLabel: document.getElementById("modalLabel"),
  modalBody: document.getElementById("modalBody"),
  modalUrl: document.getElementById("modalUrl"),
  modalOptions: document.getElementById("modalOptions"),
  modalUrlField: document.getElementById("modalUrlField"),
  modalOptionsField: document.getElementById("modalOptionsField"),
  boardContextMenu: document.getElementById("boardContextMenu"),
};

function setStatus(message) {
  elements.statusText.innerHTML = message;
}

function setObjectCount(count) {
  elements.stateText.textContent = `Objects: ${count}`;
}

function populateSelect(select, options, valueKey = "value", labelKey = "label") {
  select.innerHTML = "";
  for (const option of options) {
    const element = document.createElement("option");
    element.value = option[valueKey];
    element.textContent = option[labelKey];
    select.appendChild(element);
  }
}

function bindRangeValue(range, output, format = (value) => value) {
  const render = () => {
    output.textContent = format(range.value);
  };
  range.addEventListener("input", render);
  render();
}

bindRangeValue(elements.ambientDensityRange, elements.ambientDensityValue);
bindRangeValue(elements.ambientSpeedRange, elements.ambientSpeedValue, (value) => `${Number(value).toFixed(1)}x`);
bindRangeValue(elements.ambientPullRange, elements.ambientPullValue, (value) => Number(value).toFixed(1));
bindRangeValue(elements.ambientSpreadRange, elements.ambientSpreadValue);
bindRangeValue(elements.ambientDriftRange, elements.ambientDriftValue, (value) => Number(value).toFixed(1));
bindRangeValue(elements.ambientDriftSpeedRange, elements.ambientDriftSpeedValue, (value) => Number(value).toFixed(1));
bindRangeValue(elements.ambientIntensityRange, elements.ambientIntensityValue, (value) => Number(value).toFixed(2));
bindRangeValue(elements.ambientSizeMinRange, elements.ambientSizeMinValue, (value) => Number(value).toFixed(1));
bindRangeValue(elements.ambientSizeMaxRange, elements.ambientSizeMaxValue, (value) => Number(value).toFixed(1));
bindRangeValue(elements.ambientSizeHoldRange, elements.ambientSizeHoldValue, (value) => Number(value).toFixed(2));
bindRangeValue(elements.ambientChaosRange, elements.ambientChaosValue);
bindRangeValue(elements.ambientConvergeRange, elements.ambientConvergeValue);
bindRangeValue(elements.ambientHoldDurationRange, elements.ambientHoldDurationValue);
bindRangeValue(elements.ambientExplodeDurationRange, elements.ambientExplodeDurationValue);

let ambientUploadedAscii = "";
let pendingCreatePosition = null;
let ambientLibrary = { items: [] };
let ambientLibraryIndex = [];
let ambientLibraryPromise = null;

const editor = new BlackboardEditor({
  bb: elements.bb,
  stageFrame: elements.stageFrame,
  onStatus: setStatus,
  onStateChange: setObjectCount,
});

const ambient = new AmbientPlayground({
  root: elements.ambientRoot,
  placeholder: elements.ambientPlaceholder,
  meta: elements.ambientMeta,
  getSettings: () => ({
    target: elements.ambientTargetSelect.value,
    uploadedAscii: ambientUploadedAscii,
    libraryAscii: elements.ambientLibraryArtSelect.selectedOptions[0]?.dataset.ascii || "",
    hold: elements.ambientHoldSelect.value,
    explosion: elements.ambientExplosionSelect.value,
    alpha: elements.ambientAlphaSelect.value,
    density: Number.parseInt(elements.ambientDensityRange.value, 10),
    speed: Number.parseFloat(elements.ambientSpeedRange.value),
    pull: Number.parseFloat(elements.ambientPullRange.value),
    spread: Number.parseInt(elements.ambientSpreadRange.value, 10),
    driftAmplitude: Number.parseFloat(elements.ambientDriftRange.value),
    driftSpeed: Number.parseFloat(elements.ambientDriftSpeedRange.value),
    intensity: Number.parseFloat(elements.ambientIntensityRange.value),
    particleShape: elements.ambientParticleShapeSelect.value,
    colorMode: elements.ambientColorModeSelect.value,
    baseColor: elements.ambientBaseColor.value,
    shapeColor: elements.ambientShapeColor.value,
    explodeColor: elements.ambientExplodeColor.value,
    palettePreset: elements.ambientPaletteSelect.value,
    sizeMin: Number.parseFloat(elements.ambientSizeMinRange.value),
    sizeMax: Number.parseFloat(elements.ambientSizeMaxRange.value),
    sizeOnHold: Number.parseFloat(elements.ambientSizeHoldRange.value),
    chaosDuration: Number.parseInt(elements.ambientChaosRange.value, 10),
    convergeDuration: Number.parseInt(elements.ambientConvergeRange.value, 10),
    holdDuration: Number.parseInt(elements.ambientHoldDurationRange.value, 10),
    explodeDuration: Number.parseInt(elements.ambientExplodeDurationRange.value, 10),
  }),
  onStatus: setStatus,
});

editor.init();

elements.bb.addEventListener("blackboard:action", (event) => {
  setStatus(`Action from <strong>${event.detail.inputId}</strong>: ${event.detail.action} = ${JSON.stringify(event.detail.value)}`);
});

elements.bb.addEventListener("blackboard:export", () => {
  setStatus("Blackboard export event emitted.");
});

elements.bb.addEventListener("blackboard:scene-change", (event) => {
  setObjectCount(event.detail.objectCount || 0);
});

elements.bb.addEventListener("blackboard:selection-change", (event) => {
  if (event.detail.id) setStatus(`Selected <strong>${event.detail.id}</strong>. Use the popup on the board to edit and save it.`);
});

function updateAmbientTargetFields() {
  const target = elements.ambientTargetSelect.value;
  elements.ambientAsciiUploadField.classList.toggle("hidden", target !== "uploaded-ascii");
  elements.ambientLibraryFields.classList.toggle("hidden", target !== "library-ascii");
}

function syncLibraryPreview() {
  const selected = elements.ambientLibraryArtSelect.selectedOptions[0];
  elements.ambientLibraryPreview.value = selected?.dataset.ascii || "";
}

function populateLibraryArtSelect() {
  const categoryEntry = ambientLibraryIndex.find((entry) => entry.category === elements.ambientLibraryCategorySelect.value) || ambientLibraryIndex[0];
  const subcategoryEntry = categoryEntry?.subcategories.find((entry) => entry.subcategory === elements.ambientLibrarySubcategorySelect.value) || categoryEntry?.subcategories[0];
  elements.ambientLibraryArtSelect.innerHTML = "";
  for (const item of subcategoryEntry?.items || []) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.title;
    option.dataset.ascii = item.ascii;
    elements.ambientLibraryArtSelect.appendChild(option);
  }
  syncLibraryPreview();
}

function populateLibrarySubcategories() {
  const categoryEntry = ambientLibraryIndex.find((entry) => entry.category === elements.ambientLibraryCategorySelect.value) || ambientLibraryIndex[0];
  populateSelect(
    elements.ambientLibrarySubcategorySelect,
    (categoryEntry?.subcategories || []).map((entry) => ({ value: entry.subcategory, label: entry.subcategory })),
  );
  populateLibraryArtSelect();
}

async function initAsciiLibraryControls() {
  if (ambientLibraryIndex.length) return;
  if (ambientLibraryPromise) return ambientLibraryPromise;
  ambientLibraryPromise = (async () => {
  try {
    ambientLibrary = await loadAsciiLibrary();
    ambientLibraryIndex = buildAsciiLibraryIndex(ambientLibrary);
    populateSelect(
      elements.ambientLibraryCategorySelect,
      ambientLibraryIndex.map((entry) => ({ value: entry.category, label: `${entry.category} (${entry.subcategories.reduce((sum, item) => sum + item.items.length, 0)})` })),
    );
    populateLibrarySubcategories();
    setStatus(`Loaded <strong>${ambientLibrary.items.length}</strong> imported ASCII art entries into the Ambient library.`);
  } catch (error) {
    console.error(error);
    elements.ambientLibraryFields.classList.add("hidden");
    setStatus("Ambient ASCII library failed to load.");
  } finally {
    ambientLibraryPromise = null;
  }
  })();
  return ambientLibraryPromise;
}

function toggleAccordion(button) {
  const section = button.closest(".accordion");
  const next = !section.classList.contains("is-open");
  section.classList.toggle("is-open", next);
  button.setAttribute("aria-expanded", String(next));
}

document.querySelectorAll(".accordion-toggle").forEach((button) => {
  button.addEventListener("click", () => toggleAccordion(button));
});

function switchTab(tab) {
  document.querySelectorAll(".top-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tab);
  });
  document.getElementById("panel-blackboard").classList.toggle("is-active", tab === "blackboard");
  document.getElementById("panel-ambient").classList.toggle("is-active", tab === "ambient");
  document.getElementById("sidebar-blackboard").classList.toggle("is-active", tab === "blackboard");
  document.getElementById("sidebar-ambient").classList.toggle("is-active", tab === "ambient");
  if (tab === "ambient") ambient.onShow();
}

document.querySelectorAll(".top-tab").forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tab));
});

elements.themeSelect.addEventListener("change", () => editor.applyTheme(elements.themeSelect.value));
elements.backgroundSelect.addEventListener("change", () => editor.applyBackground(elements.backgroundSelect.value));
elements.placementSelect.addEventListener("change", () => {
  editor.setPlacementMode(elements.placementSelect.value);
  setStatus(`Placement set to <strong>${elements.placementSelect.value}</strong>.`);
});
elements.ambientTargetSelect.addEventListener("change", async () => {
  if (elements.ambientTargetSelect.value === "library-ascii") await initAsciiLibraryControls();
  updateAmbientTargetFields();
  ambient.resetAndApply({ trigger: "converge" });
});

function openModal() {
  hideBoardContextMenu();
  elements.modal.classList.add("is-open");
  elements.modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  elements.modal.classList.remove("is-open");
  elements.modal.setAttribute("aria-hidden", "true");
}

function updateModalFields() {
  const kind = elements.modalKind.value;
  elements.modalUrlField.classList.toggle("hidden", !["image", "youtube"].includes(kind));
  elements.modalOptionsField.classList.toggle("hidden", kind !== "choice");
}

elements.modalKind.addEventListener("change", updateModalFields);
document.getElementById("closeModalBtn").addEventListener("click", closeModal);
document.getElementById("cancelModalBtn").addEventListener("click", closeModal);
elements.modal.addEventListener("click", (event) => {
  if (event.target === elements.modal) closeModal();
});

elements.customForm.addEventListener("submit", (event) => {
  event.preventDefault();
  editor.createCustom({
    kind: elements.modalKind.value,
    label: elements.modalLabel.value.trim() || "Custom element",
    body: elements.modalBody.value.trim(),
    url: elements.modalUrl.value.trim(),
    options: elements.modalOptions.value.split("\n").map((value) => value.trim()).filter(Boolean),
    position: pendingCreatePosition,
  });
  pendingCreatePosition = null;
  closeModal();
});

const blackboardActions = {
  "add-title": (position) => editor.addTitle(undefined, position),
  "add-note": (position) => editor.addNote(undefined, position),
  "add-box": (position) => editor.addBox(position),
  "add-card": (position) => editor.addCard(position),
  "add-list": (position) => editor.addList(position),
  "add-table": (position) => editor.addTable(position),
  "add-timer": (position) => editor.addTimer(position),
  "add-progress": (position) => editor.addProgress(position),
  "add-choice": (position) => editor.addChoice(position),
  "add-vote": (position) => editor.addVote(position),
  "add-reaction": (position) => editor.addReaction(position),
  "add-image": (position) => editor.addImage(undefined, position),
  "add-youtube": (position) => editor.addYoutube(undefined, position),
  "add-svg": (position) => editor.addSvg(position),
  "shape-line": (position) => editor.addShape("line", position),
  "shape-arrow": (position) => editor.addShape("arrow", position),
  "shape-rect": (position) => editor.addShape("rect", position),
  "shape-circle": (position) => editor.addShape("circle", position),
  "shape-path": (position) => editor.addShape("path", position),
  "protocol-common": () => editor.runProtocolCommon(),
  "protocol-private": () => editor.runProtocolPrivate(),
  "sdk-quiz": () => editor.runSdkFlow("quiz-master"),
  "sdk-game": () => editor.runSdkFlow("game-host"),
  "sdk-pitch": () => editor.runSdkFlow("pitch-coach"),
  "sdk-recap": () => editor.runSdkFlow("recap-bot"),
  "scene-export": () => editor.exportScene(),
  "clear-ui": () => editor.clearUiLayer(),
  "clear-board": () => editor.clearBoard(),
  "open-custom": (position) => {
    pendingCreatePosition = position;
    openModal();
  },
};

const ambientActions = {
  "ambient-preview": () => ambient.resetAndApply({ trigger: "converge" }),
  "ambient-remove": () => ambient.remove(),
};

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    blackboardActions[action]?.(null);
    ambientActions[action]?.();
  });
});

[elements.ambientHoldSelect, elements.ambientExplosionSelect, elements.ambientAlphaSelect, elements.ambientDensityRange, elements.ambientSpeedRange, elements.ambientPullRange, elements.ambientSpreadRange, elements.ambientDriftRange, elements.ambientDriftSpeedRange, elements.ambientIntensityRange, elements.ambientParticleShapeSelect, elements.ambientColorModeSelect, elements.ambientBaseColor, elements.ambientShapeColor, elements.ambientExplodeColor, elements.ambientPaletteSelect, elements.ambientSizeMinRange, elements.ambientSizeMaxRange, elements.ambientSizeHoldRange, elements.ambientChaosRange, elements.ambientConvergeRange, elements.ambientHoldDurationRange, elements.ambientExplodeDurationRange].forEach((control) => {
  control.addEventListener("change", () => ambient.resetAndApply({ trigger: "converge" }));
});

elements.ambientAsciiFile.addEventListener("change", async (event) => {
  const [file] = event.target.files || [];
  if (!file) return;
  ambientUploadedAscii = await file.text();
  elements.ambientTargetSelect.value = "uploaded-ascii";
  updateAmbientTargetFields();
  setStatus(`Loaded ASCII target <strong>${file.name}</strong>.`);
  ambient.resetAndApply({ trigger: "converge" });
});

elements.ambientLibraryCategorySelect.addEventListener("change", () => {
  populateLibrarySubcategories();
  if (elements.ambientTargetSelect.value === "library-ascii") ambient.resetAndApply({ trigger: "converge" });
});

elements.ambientLibrarySubcategorySelect.addEventListener("change", () => {
  populateLibraryArtSelect();
  if (elements.ambientTargetSelect.value === "library-ascii") ambient.resetAndApply({ trigger: "converge" });
});

elements.ambientLibraryArtSelect.addEventListener("change", () => {
  syncLibraryPreview();
  if (elements.ambientTargetSelect.value === "library-ascii") ambient.resetAndApply({ trigger: "converge" });
});

function hideBoardContextMenu() {
  elements.boardContextMenu.classList.add("hidden");
}

function showBoardContextMenu(x, y) {
  const menu = elements.boardContextMenu;
  menu.classList.remove("hidden");
  const rect = menu.getBoundingClientRect();
  menu.style.left = `${Math.max(10, Math.min(x, window.innerWidth - rect.width - 10))}px`;
  menu.style.top = `${Math.max(10, Math.min(y, window.innerHeight - rect.height - 10))}px`;
}

function attachBoardContextMenu() {
  const scene = elements.bb.shadowRoot?.getElementById("scene");
  if (!scene) {
    requestAnimationFrame(attachBoardContextMenu);
    return;
  }

  scene.addEventListener("contextmenu", (event) => {
    const path = event.composedPath();
    const clickedObject = path.some((node) => node?.dataset?.objectId);
    const clickedEditor = path.some((node) => node?.id === "selection-editor");
    if (clickedObject || clickedEditor) return;
    event.preventDefault();
    pendingCreatePosition = editor.clientToBoardPosition(event.clientX, event.clientY);
    showBoardContextMenu(event.clientX, event.clientY);
  });
}

elements.boardContextMenu.addEventListener("click", (event) => {
  const action = event.target.closest("[data-create]")?.dataset.create;
  if (!action) return;
  hideBoardContextMenu();
  blackboardActions[action]?.(pendingCreatePosition);
  if (action !== "open-custom") pendingCreatePosition = null;
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("#boardContextMenu")) hideBoardContextMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideBoardContextMenu();
});

attachBoardContextMenu();

updateModalFields();
updateAmbientTargetFields();
setStatus("Ready. Right-click the blackboard to add content at the cursor.");
setObjectCount(0);
