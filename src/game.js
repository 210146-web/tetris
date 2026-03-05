import { GameBoard } from './board.js';
import { createRandomPiece } from './piece.js';

/**
 * 主遊戲類
 */
export class Game {
  constructor(width = 10, height = 20) {
    this.board = new GameBoard(width, height);
    this.currentPiece = createRandomPiece();
    this.nextPiece = createRandomPiece();
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.isRunning = false;
    this.isPaused = false;
    this.gameOverCallbacks = [];
    this.scoreCallbacks = [];
  }

  /**
   * 開始遊戲
   */
  start() {
    this.isRunning = true;
    this.isPaused = false;
  }

  /**
   * 暫停遊戲
   */
  pause() {
    if (this.isRunning) {
      this.isPaused = !this.isPaused;
    }
  }

  /**
   * 重置遊戲
   */
  reset() {
    this.board.reset();
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.isRunning = false;
    this.isPaused = false;
    this.currentPiece = createRandomPiece();
    this.nextPiece = createRandomPiece();
  }

  /**
   * 檢查方塊是否可以移動到指定位置
   */
  canMoveTo(piece) {
    const blocks = piece.getAbsoluteBlocks();
    for (const [row, col] of blocks) {
      // 檢查邊界
      if (col < 0 || col >= this.board.width) return false;
      if (row < 0) return false;
      if (row >= this.board.height) return false;
      // 檢查是否與已有方塊碰撞
      if (this.board.grid[row][col] !== 0) return false;
    }
    return true;
  }

  /**
   * 移動方塊
   */
  move(dr, dc) {
    const newPiece = this.currentPiece.clone();
    newPiece.move(dr, dc);
    
    if (this.canMoveTo(newPiece)) {
      this.currentPiece = newPiece;
      return true;
    }
    return false;
  }

  /**
   * 向下移動方塊
   */
  moveDown() {
    return this.move(1, 0);
  }

  /**
   * 向左移動方塊
   */
  moveLeft() {
    return this.move(0, -1);
  }

  /**
   * 向右移動方塊
   */
  moveRight() {
    return this.move(0, 1);
  }

  /**
   * 旋轉方塊
   */
  rotate() {
    const rotated = this.currentPiece.rotate();
    if (this.canMoveTo(rotated)) {
      this.currentPiece = rotated;
      return true;
    }
    return false;
  }

  /**
   * 立即放下方塊
   */
  hardDrop() {
    let drops = 0;
    while (this.moveDown()) {
      drops++;
    }
    this.placePiece();
    return drops;
  }

  /**
   * 放置方塊
   */
  placePiece() {
    this.board.setPiece(this.currentPiece);
    
    // 檢查是否有完整的行
    const fullLines = this.board.getFullLines();
    if (fullLines.length > 0) {
      this.board.removeLines(fullLines);
      this.addScore(fullLines.length);
    }

    // 生成下一個方塊
    this.currentPiece = this.nextPiece;
    this.nextPiece = createRandomPiece();

    // 檢查遊戲是否結束
    if (!this.canMoveTo(this.currentPiece)) {
      this.endGame();
    }
  }

  /**
   * 添加分數
   */
  addScore(linesCleared) {
    const points = [0, 40, 100, 300, 1200];
    const score = points[linesCleared] * (this.level);
    
    this.score += score;
    this.lines += linesCleared;
    
    // 更新等級
    const newLevel = Math.floor(this.lines / 10) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
    }

    this.notifyScoreChange();
  }

  /**
   * 模擬一個遊戲 tick
   */
  tick() {
    if (!this.isRunning || this.isPaused) return;
    
    if (!this.moveDown()) {
      this.placePiece();
    }
  }

  /**
   * 結束遊戲
   */
  endGame() {
    this.isRunning = false;
    this.notifyGameOver();
  }

  /**
   * 註冊遊戲結束回調
   */
  onGameOver(callback) {
    this.gameOverCallbacks.push(callback);
  }

  /**
   * 註冊分數變化回調
   */
  onScoreChange(callback) {
    this.scoreCallbacks.push(callback);
  }

  /**
   * 通知遊戲結束
   */
  notifyGameOver() {
    this.gameOverCallbacks.forEach(cb => cb(this.score));
  }

  /**
   * 通知分數變化
   */
  notifyScoreChange() {
    this.scoreCallbacks.forEach(cb => cb({
      score: this.score,
      lines: this.lines,
      level: this.level
    }));
  }

  /**
   * 獲取遊戲狀態
   */
  getState() {
    return {
      board: this.board.grid,
      currentPiece: this.currentPiece,
      nextPiece: this.nextPiece,
      score: this.score,
      lines: this.lines,
      level: this.level,
      isRunning: this.isRunning,
      isPaused: this.isPaused
    };
  }
}
