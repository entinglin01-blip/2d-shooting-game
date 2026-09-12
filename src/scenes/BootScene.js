import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // 加載游戲資源
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('background', 'assets/background.png');
  }

  create() {
    // 如果資源加載失敗，使用簡單的幾何形狀代替
    this.scene.start('MenuScene');
  }
}
