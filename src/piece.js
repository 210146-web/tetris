/**
 * 俄羅斯方塊片段
 * 支持所有標準的 7 個 Tetris 方塊
 */
export const PIECE_SHAPES = {
  I: { blocks: [[0, 0], [0, 1], [0, 2], [0, 3]], color: 1 },      // 藍色
  O: { blocks: [[0, 0], [0, 1], [1, 0], [1, 1]], color: 2 },      // 黃色
  T: { blocks: [[0, 1], [1, 0], [1, 1], [1, 2]], color: 3 },      // 紫色
  S: { blocks: [[0, 1], [0, 2], [1, 0], [1, 1]], color: 4 },      // 綠色
  Z: { blocks: [[0, 0], [0, 1], [1, 1], [1, 2]], color: 5 },      // 紅色
  J: { blocks: [[0, 0], [1, 0], [1, 1], [1, 2]], color: 6 },      // 橙色
  L: { blocks: [[0, 2], [1, 0], [1, 1], [1, 2]], color: 7 }       // 青色
};

export class Piece {
  constructor(shapeKey = 'O', row = 0, col = 3) {
    const shape = PIECE_SHAPES[shapeKey];
    if (!shape) {
      throw new Error(`Invalid piece shape: ${shapeKey}`);
    }
    
    this.shapeKey = shapeKey;
    this.blocks = shape.blocks.map(([r, c]) => [r, c]);
    this.color = shape.color;
    this.row = row;
    this.col = col;
    this.rotationState = 0;
  }

  /**
   * 獲取方塊的絕對位置
   */
  getAbsoluteBlocks() {
    return this.blocks.map(([r, c]) => [this.row + r, this.col + c]);
  }

  /**
   * 移動方塊
   */
  move(dr, dc) {
    this.row += dr;
    this.col += dc;
  }

  /**
   * 向下移動
   */
  moveDown() {
    this.move(1, 0);
  }

  /**
   * 向左移動
   */
  moveLeft() {
    this.move(0, -1);
  }

  /**
   * 向右移動
   */
  moveRight() {
    this.move(0, 1);
  }

  /**
   * 重置位置
   */
  reset(row = 0, col = 3) {
    this.row = row;
    this.col = col;
  }

  /**
   * 複製方塊
   */
  clone() {
    const cloned = new Piece(this.shapeKey, this.row, this.col);
    cloned.rotationState = this.rotationState;
    return cloned;
  }

  /**
   * 旋轉方塊（基本實現）
   * SRS (Super Rotation System) 簡化版本
   */
  rotate() {
    // O 方塊不旋轉
    if (this.shapeKey === 'O') {
      const rotated = new Piece(this.shapeKey, this.row, this.col);
      rotated.rotationState = (this.rotationState + 1) % 4;
      return rotated;
    }
    
    // 臨時旋轉
    const rotated = this.rotateClockwise();
    return rotated;
  }

  rotateClockwise() {
    const rotated = new Piece(this.shapeKey, this.row, this.col);
    rotated.rotationState = (this.rotationState + 1) % 4;
    
    // 對於 O 方塊，不改變形狀
    if (this.shapeKey === 'O') {
      rotated.blocks = this.blocks.map(b => [...b]);
      return rotated;
    }
    
    // 其他方塊使用標準旋轉公式
    rotated.blocks = this.blocks.map(([r, c]) => [-c, r]);
    return rotated;
  }
}

/**
 * 生成隨機方塊
 */
export function createRandomPiece() {
  const shapes = Object.keys(PIECE_SHAPES);
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  return new Piece(randomShape, 0, 3);
}
