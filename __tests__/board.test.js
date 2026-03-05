import { GameBoard } from '../src/board.js';

describe('GameBoard', () => {
  let board;

  beforeEach(() => {
    board = new GameBoard(10, 20);
  });

  describe('初始化', () => {
    test('應該創建正確尺寸的遊戲板', () => {
      expect(board.width).toBe(10);
      expect(board.height).toBe(20);
      expect(board.grid.length).toBe(20);
      expect(board.grid[0].length).toBe(10);
    });

    test('遊戲板應該初始為空', () => {
      for (let row of board.grid) {
        for (let cell of row) {
          expect(cell).toBe(0);
        }
      }
    });
  });

  describe('位置驗證', () => {
    test('isValidPosition 應該正確驗證邊界', () => {
      expect(board.isValidPosition(0, 0)).toBe(true);
      expect(board.isValidPosition(19, 9)).toBe(true);
      expect(board.isValidPosition(-1, 0)).toBe(false);
      expect(board.isValidPosition(20, 0)).toBe(false);
      expect(board.isValidPosition(0, -1)).toBe(false);
      expect(board.isValidPosition(0, 10)).toBe(false);
    });

    test('canPlacePiece 應該检查邊界和空位', () => {
      expect(board.canPlacePiece(5, 5)).toBe(true);
      expect(board.canPlacePiece(-1, 5)).toBe(false);
      expect(board.canPlacePiece(20, 5)).toBe(false);
      
      // 放置一個方塊後，該位置應該不可用
      board.grid[5][5] = 1;
      expect(board.canPlacePiece(5, 5)).toBe(false);
    });
  });

  describe('行滿檢測', () => {
    test('isLineFull 應該檢測滿行', () => {
      expect(board.isLineFull(0)).toBe(false);
      
      // 填滿第 0 行
      for (let col = 0; col < board.width; col++) {
        board.grid[0][col] = 1;
      }
      expect(board.isLineFull(0)).toBe(true);
    });

    test('getFullLines 應該返回所有滿行', () => {
      // 填滿第 0 行和第 5 行
      for (let col = 0; col < board.width; col++) {
        board.grid[0][col] = 1;
        board.grid[5][col] = 1;
      }
      
      const fullLines = board.getFullLines();
      expect(fullLines).toEqual([0, 5]);
    });

    test('getFullLines 應該在沒有滿行時返回空陣列', () => {
      const fullLines = board.getFullLines();
      expect(fullLines).toEqual([]);
    });
  });

  describe('行消除', () => {
    test('removeLines 應該刪除指定的行', () => {
      // 填滿第 0 行
      for (let col = 0; col < board.width; col++) {
        board.grid[0][col] = 1;
      }
      // 在第 1 行放置一些方塊
      board.grid[1][0] = 1;
      board.grid[1][1] = 1;

      board.removeLines([0]);

      // 原始的第 1 行應該現在在第 0 行
      expect(board.grid[0][0]).toBe(1);
      expect(board.grid[0][1]).toBe(1);
      // 新的最後一行應該是空的
      expect(board.grid[19].every(cell => cell === 0)).toBe(true);
    });

    test('removeLines 應該返回刪除的行數', () => {
      for (let col = 0; col < board.width; col++) {
        board.grid[0][col] = 1;
        board.grid[5][col] = 1;
      }

      const removed = board.removeLines([0, 5]);
      expect(removed).toBe(2);
    });
  });

  describe('遊戲結束檢測', () => {
    test('isGameOver 應該在頂部有方塊時返回 true', () => {
      expect(board.isGameOver()).toBe(false);
      
      board.grid[0][0] = 1;
      expect(board.isGameOver()).toBe(true);
    });

    test('isGameOver 應該只檢測頂部', () => {
      board.grid[19][0] = 1;
      expect(board.isGameOver()).toBe(false);
    });
  });

  describe('重置和清除', () => {
    test('reset 應該清空遊戲板', () => {
      // 填充一些方塊
      for (let col = 0; col < board.width; col++) {
        board.grid[0][col] = 1;
      }

      board.reset();

      // 檢查是否所有都是 0
      for (let row of board.grid) {
        for (let cell of row) {
          expect(cell).toBe(0);
        }
      }
    });

    test('clear 應該是 reset 的別名', () => {
      board.grid[0][0] = 1;
      board.clear();
      expect(board.grid[0][0]).toBe(0);
    });
  });
});
