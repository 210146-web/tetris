/**
 * 遊戲 UI 渲染器
 */
export class GameRenderer {
  constructor(gameBoard, gameInfoElementId = 'game-board') {
    this.gameBoardElement = document.getElementById(gameBoard);
    this.scoreElement = document.getElementById('score');
    this.levelElement = document.getElementById('level');
    this.linesElement = document.getElementById('lines');
    this.nextPieceElement = document.querySelector('.next-piece-grid');
    this.toggleButton = document.getElementById('toggle-btn');
  }

  /**
   * 清空遊戲板的 DOM
   */
  clearBoard() {
    this.gameBoardElement.innerHTML = '';
  }

  /**
   * 渲染遊戲板
   */
  renderBoard(board) {
    this.clearBoard();
    
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const cell = document.createElement('div');
        cell.className = 'game-cell';
        if (board[row][col] !== 0) {
          cell.classList.add('filled');
          cell.style.backgroundColor = this.getColorForPiece(board[row][col]);
        }
        this.gameBoardElement.appendChild(cell);
      }
    }
  }

  /**
   * 渲染當前方塊
   */
  renderCurrentPiece(piece, board) {
    const blocks = piece.getAbsoluteBlocks();
    for (const [row, col] of blocks) {
      if (row >= 0 && row < board.length && col >= 0 && col < board[0].length) {
        const cellIndex = row * board[0].length + col;
        const cell = this.gameBoardElement.children[cellIndex];
        if (cell) {
          cell.classList.add('filled');
          cell.style.backgroundColor = this.getColorForPiece(piece.color);
        }
      }
    }
  }

  /**
   * 渲染下一個方塊預覽
   */
  renderNextPiece(piece) {
    this.nextPieceElement.innerHTML = '';
    
    // 創建 4x4 的網格預覽
    for (let i = 0; i < 16; i++) {
      const cell = document.createElement('div');
      cell.className = 'next-piece-cell';
      this.nextPieceElement.appendChild(cell);
    }

    // 在預覽區域中繪製方塊
    const blocks = piece.getAbsoluteBlocks();
    const minRow = Math.min(...blocks.map(b => b[0]));
    const minCol = Math.min(...blocks.map(b => b[1]));

    for (const [row, col] of blocks) {
      const previewRow = row - minRow;
      const previewCol = col - minCol;
      if (previewRow < 4 && previewCol < 4) {
        const cellIndex = previewRow * 4 + previewCol;
        const cell = this.nextPieceElement.children[cellIndex];
        if (cell) {
          cell.classList.add('filled');
          cell.style.backgroundColor = this.getColorForPiece(piece.color);
        }
      }
    }
  }

  /**
   * 更新遊戲信息
   */
  updateInfo(score, lines, level) {
    this.scoreElement.textContent = score;
    this.linesElement.textContent = lines;
    this.levelElement.textContent = level;
  }

  /**
   * 根據顏色編號獲取顏色
   */
  getColorForPiece(colorId) {
    const colors = {
      1: '#3498db', // 藍色 (I)
      2: '#f1c40f', // 黃色 (O)
      3: '#9b59b6', // 紫色 (T)
      4: '#2ecc71', // 綠色 (S)
      5: '#e74c3c', // 紅色 (Z)
      6: '#e67e22', // 橙色 (J)
      7: '#1abc9c'  // 青色 (L)
    };
    return colors[colorId] || '#95a5a6';
  }

  /**
   * 渲染遊戲結束畫面
   */
  showGameOver(score) {
    const overlay = document.createElement('div');
    overlay.className = 'game-over-overlay';
    overlay.innerHTML = `
      <div class="game-over-modal">
        <h2>遊戲結束！</h2>
        <p>最終分數: ${score}</p>
        <button class="btn restart-btn">重新開始</button>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay.querySelector('.restart-btn');
  }

  /**
   * 隱藏遊戲結束畫面
   */
  hideGameOver() {
    const overlay = document.querySelector('.game-over-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  /**
   * 渲染完整的遊戲狀態
   */
  render(gameState) {
    this.renderBoard(gameState.board);
    this.renderCurrentPiece(gameState.currentPiece, gameState.board);
    this.renderNextPiece(gameState.nextPiece);
    this.updateInfo(gameState.score, gameState.lines, gameState.level);
    
    // 更新按鈕狀態
    if (gameState.isPaused) {
      this.toggleButton.textContent = '繼續遊戲';
      this.toggleButton.classList.add('paused');
    } else if (gameState.isRunning) {
      this.toggleButton.textContent = '暫停遊戲';
      this.toggleButton.classList.remove('paused');
    } else {
      this.toggleButton.textContent = '開始遊戲';
      this.toggleButton.classList.remove('paused');
    }
  }
}
