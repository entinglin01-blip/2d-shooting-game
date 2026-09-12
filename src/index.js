import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import MenuScene from './scenes/MenuScene';
import DifficultyScene from './scenes/DifficultyScene';
import GameScene from './scenes/GameScene';
import AchievementScene from './scenes/AchievementScene';
import SettingsScene from './scenes/SettingsScene';
import GameOverScene from './scenes/GameOverScene';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a1a',
  parent: 'game-container',
  scene: [
    BootScene,
    MenuScene,
    DifficultyScene,
    GameScene,
    AchievementScene,
    SettingsScene,
    GameOverScene,
  ],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
