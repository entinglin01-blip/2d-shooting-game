// 音效管理器
export default class SoundManager {
  constructor(scene) {
    this.scene = scene;
    this.soundsEnabled = true;
    this.masterVolume = 0.5;
  }

  playShoot() {
    if (!this.soundsEnabled) return;
    // 射擊音效 - 使用簡單的合成音
    this.playTone(400, 50);
  }

  playExplosion() {
    if (!this.soundsEnabled) return;
    this.playTone(100, 150);
  }

  playHit() {
    if (!this.soundsEnabled) return;
    this.playTone(800, 100);
  }

  playLevelUp() {
    if (!this.soundsEnabled) return;
    this.playTone(1000, 200);
  }

  playGameOver() {
    if (!this.soundsEnabled) return;
    this.playTone(200, 500);
  }

  toggleSound() {
    this.soundsEnabled = !this.soundsEnabled;
    return this.soundsEnabled;
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  playTone(frequency, duration) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(this.masterVolume * 0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
      // 瀏覽器不支援音效
    }
  }
}
