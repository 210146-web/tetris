import { Piece, PIECE_SHAPES, createRandomPiece } from '../src/piece.js';

describe('Piece', () => {
  describe('初始化', () => {
    test('應該創建一個有效的方塊', () => {
      const piece = new Piece('O', 0, 3);
      expect(piece.shapeKey).toBe('O');
      expect(piece.row).toBe(0);
      expect(piece.col).toBe(3);
      expect(piece.color).toBe(PIECE_SHAPES['O'].color);
    });

    test('應該支持所有 7 種標準方塊形狀', () => {
      const shapes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      shapes.forEach(shape => {
        const piece = new Piece(shape);
        expect(piece.shapeKey).toBe(shape);
        expect(piece.color).toBeDefined();
      });
    });

    test('應該在無效形狀時拋出錯誤', () => {
      expect(() => {
        new Piece('INVALID');
      }).toThrow('Invalid piece shape: INVALID');
    });

    test('方塊應該包含正確的方塊坐標', () => {
      const piece = new Piece('O');
      // O 方塊是 2x2 的正方形
      expect(piece.blocks.length).toBe(4);
    });
  });

  describe('位置和移動', () => {
    test('getAbsoluteBlocks 應該返回絕對位置', () => {
      const piece = new Piece('I', 5, 3);
      const absoluteBlocks = piece.getAbsoluteBlocks();
      
      // 檢查每個方塊的相對位置都加上了行列偏移
      for (let i = 0; i < piece.blocks.length; i++) {
        expect(absoluteBlocks[i][0]).toBe(piece.blocks[i][0] + 5);
        expect(absoluteBlocks[i][1]).toBe(piece.blocks[i][1] + 3);
      }
    });

    test('move 應該改變位置', () => {
      const piece = new Piece('O', 0, 0);
      piece.move(1, 2);
      expect(piece.row).toBe(1);
      expect(piece.col).toBe(2);
    });

    test('moveDown 應該增加行數', () => {
      const piece = new Piece('O', 5, 3);
      piece.moveDown();
      expect(piece.row).toBe(6);
      expect(piece.col).toBe(3);
    });

    test('moveLeft 應該減少列數', () => {
      const piece = new Piece('O', 5, 3);
      piece.moveLeft();
      expect(piece.row).toBe(5);
      expect(piece.col).toBe(2);
    });

    test('moveRight 應該增加列數', () => {
      const piece = new Piece('O', 5, 3);
      piece.moveRight();
      expect(piece.row).toBe(5);
      expect(piece.col).toBe(4);
    });

    test('reset 應該重置位置', () => {
      const piece = new Piece('O', 10, 5);
      piece.reset(2, 4);
      expect(piece.row).toBe(2);
      expect(piece.col).toBe(4);
    });

    test('reset 應該有默認值', () => {
      const piece = new Piece('O', 10, 5);
      piece.reset();
      expect(piece.row).toBe(0);
      expect(piece.col).toBe(3);
    });
  });

  describe('複製', () => {
    test('clone 應該創建獨立的副本', () => {
      const original = new Piece('T', 5, 3);
      const cloned = original.clone();

      expect(cloned.shapeKey).toBe(original.shapeKey);
      expect(cloned.row).toBe(original.row);
      expect(cloned.col).toBe(original.col);

      // 修改複製品不應該影響原始
      cloned.move(1, 1);
      expect(original.row).toBe(5);
      expect(original.col).toBe(3);
    });

    test('clone 應該複製旋轉狀態', () => {
      const piece = new Piece('T', 0, 0);
      piece.rotationState = 2;
      const cloned = piece.clone();
      expect(cloned.rotationState).toBe(2);
    });
  });

  describe('旋轉', () => {
    test('rotate 應該返回旋轉後的方塊', () => {
      const piece = new Piece('T', 0, 0);
      const rotated = piece.rotate();
      
      expect(rotated).toBeDefined();
      expect(rotated.shapeKey).toBe('T');
    });

    test('rotateClockwise 應該改變方塊形狀', () => {
      const piece = new Piece('T', 0, 0);
      const originalBlocks = piece.blocks.map(b => [...b]);
      
      const rotated = piece.rotateClockwise();
      // 旋轉後應該有相同數量的方塊但位置不同
      expect(rotated.blocks.length).toBe(piece.blocks.length);
      
      // 至少某些方塊位置應該改變
      let hasChange = false;
      for (let i = 0; i < rotated.blocks.length; i++) {
        if (rotated.blocks[i][0] !== originalBlocks[i][0] || 
            rotated.blocks[i][1] !== originalBlocks[i][1]) {
          hasChange = true;
          break;
        }
      }
      expect(hasChange).toBe(true);
    });

    test('rotationState 應該更新', () => {
      const piece = new Piece('T', 0, 0);
      expect(piece.rotationState).toBe(0);
      
      const rotated = piece.rotateClockwise();
      expect(rotated.rotationState).toBe(1);
    });
  });
});

describe('createRandomPiece', () => {
  test('應該創建一個有效的方塊', () => {
    const piece = createRandomPiece();
    expect(piece).toBeDefined();
    expect(piece).toBeInstanceOf(Piece);
  });

  test('應該創建不同的方塊', () => {
    const pieces = new Set();
    for (let i = 0; i < 50; i++) {
      pieces.add(createRandomPiece().shapeKey);
    }
    // 如果隨機性工作，應該創建多於一種形狀
    expect(pieces.size).toBeGreaterThan(1);
  });
});
