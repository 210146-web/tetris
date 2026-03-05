import { Game } from './game.js';
import { GameRenderer } from './renderer.js';

// 初始化遊戲
const game = new Game(10, 20);
const renderer = new GameRenderer('game-board');

// 遊戲速度（毫秒）
let gameSpeed = 1000;
let gameLoopId = null;

// 初始化事件監聽器
function setupEventListeners() {
  // 按鈕事件
  document.getElementById('toggle-btn').addEventListener('click', () => {
    if (!game.isRunning) {
      game.start();
      startGameLoop();
    } else {
      game.pause();
    }
    updateDisplay();
  });

  // 鍵盤事件
  document.addEventListener('keydown', (e) => {
    if (!game.isRunning || game.isPaused) return;

    switch (e.key) {
      case 'ArrowLeft':
        game.moveLeft();
        e.preventDefault();
        break;
      case 'ArrowRight':
        game.moveRight();
        e.preventDefault();
        break;
      case 'ArrowDown':
        game.moveDown();
        e.preventDefault();
        break;
      case ' ':
        game.hardDrop();
        e.preventDefault();
        break;
      case 'z':
      case 'Z':
        game.rotate();
        e.preventDefault();
        break;
    }
    updateDisplay();
  });

  // 遊戲結束事件
  game.onGameOver((score) => {
    stopGameLoop();
    const restartBtn = renderer.showGameOver(score);
    restartBtn.addEventListener('click', () => {
      renderer.hideGameOver();
      game.reset();
      updateDisplay();
    });
  });

  // 分數變化事件
  game.onScoreChange((stats) => {
    // 根據等級調整速度
    gameSpeed = Math.max(200, 1000 - (stats.level - 1) * 100);
  });
}

/**
 * 開始遊戲循環
 */
function startGameLoop() {
  if (gameLoopId) clearInterval(gameLoopId);
  
  gameLoopId = setInterval(() => {
    game.tick();
    updateDisplay();
  }, gameSpeed);
}

/**
 * 停止遊戲循環
 */
function stopGameLoop() {
  if (gameLoopId) {
    clearInterval(gameLoopId);
    gameLoopId = null;
  }
}

/**
 * 更新顯示
 */
function updateDisplay() {
  const gameState = game.getState();
  renderer.render(gameState);
}

// 初始化
setupEventListeners();
updateDisplay();

// 導出遊戲實例供測試使用
export { game, renderer };
