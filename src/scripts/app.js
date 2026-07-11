import { notes, songs } from "./config.js";
import { AudioEngine } from "./audio.js";

const elements = {
  pianoKeys: document.querySelector("#pianoKeys"),
  volumeControl: document.querySelector("#volumeControl"),
  volumeValue: document.querySelector("#volumeValue"),
  labelsToggle: document.querySelector("#labelsToggle"),
  songSelect: document.querySelector("#songSelect"),
  playSongBtn: document.querySelector("#playSongBtn"),
  pauseSongBtn: document.querySelector("#pauseSongBtn"),
  stopSongBtn: document.querySelector("#stopSongBtn"),
  progressBar: document.querySelector("#progressBar"),
  statusText: document.querySelector("#statusText"),
  recordBtn: document.querySelector("#recordBtn"),
  playRecordingBtn: document.querySelector("#playRecordingBtn"),
  clearRecordingBtn: document.querySelector("#clearRecordingBtn"),
  recordingInfo: document.querySelector("#recordingInfo"),
};

const audioEngine = new AudioEngine();
const validKeys = new Set(notes.map(({ key }) => key));
const timers = new Set();
const activeKeyboardKeys = new Set();

const playback = {
  sequence: [],
  index: 0,
  paused: false,
  playing: false,
  source: null,
};

const recorder = {
  recording: false,
  startedAt: 0,
  sequence: [],
};

function renderPiano() {
  const fragment = document.createDocumentFragment();

  notes.forEach(({ key, note, type }) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = `piano-key piano-key--${type}`;
    button.dataset.key = key;
    button.setAttribute("aria-label", `Tocar nota ${note} pela tecla ${key}`);
    button.innerHTML = `<span class="piano-key__label" aria-hidden="true">${key}</span>`;
    item.appendChild(button);
    fragment.appendChild(item);
  });

  elements.pianoKeys.appendChild(fragment);
}

function setStatus(message) {
  elements.statusText.textContent = message;
}

function highlightKey(key, active = true) {
  const keyElement = elements.pianoKeys.querySelector(`[data-key="${CSS.escape(key)}"]`);
  if (!keyElement) return;
  keyElement.classList.toggle("is-active", active);
}

function recordNote(key) {
  if (!recorder.recording) return;
  recorder.sequence.push({ key, at: performance.now() - recorder.startedAt });
  updateRecordingInfo();
}

function playNote(key, { record = true } = {}) {
  if (!validKeys.has(key)) return;
  audioEngine.play(key);
  highlightKey(key, true);
  window.setTimeout(() => highlightKey(key, false), 160);
  if (record) recordNote(key);
}

function clearTimers() {
  timers.forEach((timerId) => window.clearTimeout(timerId));
  timers.clear();
}

function schedule(callback, delay) {
  const timerId = window.setTimeout(() => {
    timers.delete(timerId);
    callback();
  }, delay);
  timers.add(timerId);
}

function updatePlaybackControls() {
  elements.playSongBtn.disabled = playback.playing && !playback.paused;
  elements.pauseSongBtn.disabled = !playback.playing;
  elements.pauseSongBtn.textContent = playback.paused ? "Continuar" : "Pausar";
  elements.stopSongBtn.disabled = !playback.playing;
}

function updateProgress() {
  const total = playback.sequence.length;
  const progress = total ? (playback.index / total) * 100 : 0;
  elements.progressBar.style.width = `${Math.min(progress, 100)}%`;
}

function finishPlayback(message = "Reprodução concluída") {
  clearTimers();
  playback.playing = false;
  playback.paused = false;
  playback.index = 0;
  playback.sequence = [];
  playback.source = null;
  updateProgress();
  updatePlaybackControls();
  setStatus(message);
}

function playNextSequenceNote() {
  if (!playback.playing || playback.paused) return;
  if (playback.index >= playback.sequence.length) {
    finishPlayback();
    return;
  }

  const current = playback.sequence[playback.index];
  playNote(current.key, { record: false });
  playback.index += 1;
  updateProgress();
  schedule(playNextSequenceNote, current.duration ?? 420);
}

function startSongPlayback() {
  stopPlayback(false);
  const song = songs[elements.songSelect.value];
  if (!song) return;

  playback.sequence = song.notes;
  playback.index = 0;
  playback.playing = true;
  playback.paused = false;
  playback.source = "song";
  setStatus(`Tocando: ${song.title}`);
  updatePlaybackControls();
  playNextSequenceNote();
}

function togglePause() {
  if (!playback.playing) return;
  playback.paused = !playback.paused;
  clearTimers();
  setStatus(playback.paused ? "Reprodução pausada" : "Reprodução retomada");
  updatePlaybackControls();
  if (!playback.paused) playNextSequenceNote();
}

function stopPlayback(updateStatus = true) {
  if (!playback.playing && !playback.sequence.length) return;
  clearTimers();
  audioEngine.stopAll();
  playback.playing = false;
  playback.paused = false;
  playback.index = 0;
  playback.sequence = [];
  playback.source = null;
  updateProgress();
  updatePlaybackControls();
  if (updateStatus) setStatus("Reprodução interrompida");
}

function toggleRecording() {
  if (recorder.recording) {
    recorder.recording = false;
    elements.recordBtn.classList.remove("is-recording");
    elements.recordBtn.textContent = "Gravar";
    setStatus("Gravação finalizada");
  } else {
    stopPlayback(false);
    recorder.sequence = [];
    recorder.recording = true;
    recorder.startedAt = performance.now();
    elements.recordBtn.classList.add("is-recording");
    elements.recordBtn.textContent = "Finalizar gravação";
    setStatus("Gravando sua sequência");
  }
  updateRecordingInfo();
}

function updateRecordingInfo() {
  const count = recorder.sequence.length;
  elements.recordingInfo.textContent = count
    ? `${count} ${count === 1 ? "nota gravada" : "notas gravadas"}.`
    : "Nenhuma nota gravada.";
  elements.playRecordingBtn.disabled = !count || recorder.recording;
  elements.clearRecordingBtn.disabled = !count || recorder.recording;
}

function playRecording() {
  if (!recorder.sequence.length) return;
  stopPlayback(false);

  playback.sequence = recorder.sequence.map((item, index, sequence) => ({
    key: item.key,
    duration: Math.max(120, (sequence[index + 1]?.at ?? item.at + 450) - item.at),
  }));
  playback.index = 0;
  playback.playing = true;
  playback.paused = false;
  playback.source = "recording";
  setStatus("Reproduzindo sua gravação");
  updatePlaybackControls();
  playNextSequenceNote();
}

function clearRecording() {
  recorder.sequence = [];
  updateRecordingInfo();
  setStatus("Gravação apagada");
}

function normalizeKey(event) {
  return event.key.length === 1 ? event.key.toLowerCase() : event.key;
}

function bindEvents() {
  elements.pianoKeys.addEventListener("pointerdown", (event) => {
    const keyElement = event.target.closest("[data-key]");
    if (!keyElement) return;
    playNote(keyElement.dataset.key);
  });

  document.addEventListener("keydown", (event) => {
    const key = normalizeKey(event);
    if (!validKeys.has(key) || event.repeat || activeKeyboardKeys.has(key)) return;
    event.preventDefault();
    activeKeyboardKeys.add(key);
    highlightKey(key, true);
    audioEngine.play(key);
    recordNote(key);
  });

  document.addEventListener("keyup", (event) => {
    const key = normalizeKey(event);
    activeKeyboardKeys.delete(key);
    highlightKey(key, false);
  });

  window.addEventListener("blur", () => {
    activeKeyboardKeys.forEach((key) => highlightKey(key, false));
    activeKeyboardKeys.clear();
  });

  elements.volumeControl.addEventListener("input", ({ target }) => {
    audioEngine.setVolume(target.value);
    elements.volumeValue.value = `${Math.round(Number(target.value) * 100)}%`;
  });

  elements.labelsToggle.addEventListener("change", ({ target }) => {
    elements.pianoKeys.classList.toggle("hide-labels", !target.checked);
  });

  elements.playSongBtn.addEventListener("click", startSongPlayback);
  elements.pauseSongBtn.addEventListener("click", togglePause);
  elements.stopSongBtn.addEventListener("click", () => stopPlayback(true));
  elements.recordBtn.addEventListener("click", toggleRecording);
  elements.playRecordingBtn.addEventListener("click", playRecording);
  elements.clearRecordingBtn.addEventListener("click", clearRecording);
}

renderPiano();
bindEvents();
audioEngine.setVolume(elements.volumeControl.value);
updatePlaybackControls();
updateRecordingInfo();
