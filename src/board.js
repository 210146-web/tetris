/**
 * 遊戲板 - 管理遊戲網格
 * 10 寬 x 20 高
 */
export class GameBoard {
  constructor(width = 10, height = 20) {
    this.width = width;
    this.height = height;
    this.grid = this.createEmptyGrid();
  }

  /**
   * 創建空的遊戲網格
   */
  createEmptyGrid() {
    return Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => 0)
    );
  }

  /**
   * 檢查位置是否有效
   */
  isValidPosition(row, col) {
    return row >= 0 && row < this.height && col >= 0 && col < this.width;
  }

  /**
   * 檢查位置是否可以放置方塊
   */
  canPlacePiece(row, col) {
    return this.isValidPosition(row, col) && this.grid[row][col] === 0;
  }

  /**
   * 檢查一整行是否已滿
   */
  isLineFull(row) {
    if (!this.isValidPosition(row, 0)) return false;
    return this.grid[row].every(cell => cell !== 0);
  }

  /**
   * 獲取所有滿的行
   */
  getFullLines() {
    const fullLines = [];
    for (let row = 0; row < this.height; row++) {
      if (this.isLineFull(row)) {
        fullLines.push(row);
      }
    }
    return fullLines;
  }

  /**
   * 刪除指定的行
   */
  removeLines(lines) {
    if (lines.length === 0) return 0;
    
    const sortedLines = [...lines].sort((a, b) => b - a);
    for (const line of sortedLines) {
      this.grid.splice(line, 1);
    }
    // 在底部添加空行以保持高度不變
    for (let i = 0; i < lines.length; i++) {
      this.grid.push(Array.from({ length: this.width }, () => 0));
    }
    return lines.length;
  }

  /**
   * 設置方塊到網格中
   */
  setPiece(piece) {
    for (const [row, col] of piece.blocks) {
      if (this.isValidPosition(piece.row + row, piece.col + col)) {
        this.grid[piece.row + row][piece.col + col] = piece.color;
      }
    }
  }

  /**
   * 檢查遊戲是否結束（頂部有方塊）
   */
  isGameOver() {
    return this.grid[0].some(cell => cell !== 0);
  }

  /**
   * 重置遊戲板
   */
  reset() {
    this.grid = this.createEmptyGrid();
  }

  /**
   * 清除網格
   */
  clear() {
    this.reset();
  }
}
