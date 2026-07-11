export class AudioEngine {
  constructor(basePath = "./src/tunes") {
    this.basePath = basePath;
    this.volume = 0.7;
    this.activeAudios = new Set();
  }

  setVolume(value) {
    const parsedValue = Number(value);
    this.volume = Number.isFinite(parsedValue) ? Math.min(1, Math.max(0, parsedValue)) : 0.7;
    this.activeAudios.forEach((audio) => { audio.volume = this.volume; });
  }

  play(key) {
    const audio = new Audio(`${this.basePath}/${encodeURIComponent(key)}.wav`);
    audio.volume = this.volume;
    this.activeAudios.add(audio);

    const cleanup = () => this.activeAudios.delete(audio);
    audio.addEventListener("ended", cleanup, { once: true });
    audio.addEventListener("error", cleanup, { once: true });

    audio.play().catch((error) => {
      cleanup();
      console.error(`Não foi possível reproduzir a tecla ${key}.`, error);
    });
  }

  stopAll() {
    this.activeAudios.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.activeAudios.clear();
  }
}
