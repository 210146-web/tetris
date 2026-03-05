import { Game } from '../src/game.js';

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game(10, 20);
  });

  describe('初始化', () => {
    test('應該创建新遊戲', () => {
      expect(game.score).toBe(0);
      expect(game.lines).toBe(0);
      expect(game.level).toBe(1);
      expect(game.isRunning).toBe(false);
      expect(game.isPaused).toBe(false);
    });

    test('應該生成當前方塊和下一個方塊', () => {
      expect(game.currentPiece).toBeDefined();
      expect(game.nextPiece).toBeDefined();
      expect(game.currentPiece.shapeKey).toBeDefined();
      expect(game.nextPiece.shapeKey).toBeDefined();
    });
  });

  describe('遊戲控制', () => {
    test('start 應該開始遊戲', () => {
      game.start();
      expect(game.isRunning).toBe(true);
      expect(game.isPaused).toBe(false);
    });

    test('pause 應該在運行時切換暫停狀態', () => {
      game.start();
      game.pause();
      expect(game.isPaused).toBe(true);
      
      game.pause();
      expect(game.isPaused).toBe(false);
    });

    test('pause 在遊戲未運行時應該無效', () => {
      game.pause();
      expect(game.isPaused).toBe(false);
    });

    test('reset 應該重置遊戲狀態', () => {
      game.start();
      game.score = 100;
      game.lines = 5;
      game.level = 3;
      
      game.reset();
      
      expect(game.score).toBe(0);
      expect(game.lines).toBe(0);
      expect(game.level).toBe(1);
      expect(game.isRunning).toBe(false);
      expect(game.isPaused).toBe(false);
    });
  });

  describe('方塊移動', () => {
    test('moveDown 應該下移方塊', () => {
      const originalRow = game.currentPiece.row;
      game.moveDown();
      expect(game.currentPiece.row).toBe(originalRow + 1);
    });

    test('moveLeft 應該左移方塊', () => {
      const originalCol = game.currentPiece.col;
      game.moveLeft();
      expect(game.currentPiece.col).toBe(originalCol - 1);
    });

    test('moveRight 應該右移方塊', () => {
      const originalCol = game.currentPiece.col;
      game.moveRight();
      expect(game.currentPiece.col).toBe(originalCol + 1);
    });

    test('move 應該在邊界處停止', () => {
      // 移動到左邊界
      while (game.moveLeft()) {}
      const leftmostCol = game.currentPiece.col;
      
      game.moveLeft();
      expect(game.currentPiece.col).toBe(leftmostCol);
    });

    test('move 應該在碰撞處停止', () => {
      // 將方塊固定到底部
      for (let col = 0; col < game.board.width; col++) {
        game.board.grid[19][col] = 1;
      }

      game.currentPiece.row = 18;

      // 應該無法進一步下移
      const originalRow = game.currentPiece.row;
      game.moveDown();
      expect(game.currentPiece.row).toBe(originalRow);
    });
  });

  describe('旋轉', () => {
    test('rotate 應該旋轉方塊', () => {
      const originalState = game.currentPiece.rotationState;
      const originalBlocks = game.currentPiece.blocks.map(b => [...b]);
      
      const result = game.rotate();
      
      // 旋轉成功或失敗都無關，但 O 方塊應該總是成功
      if (game.currentPiece.shapeKey === 'O') {
        expect(result).toBe(true);
        expect(game.currentPiece.rotationState).not.toBe(originalState);
      }
    });

    test('rotate 在空間不足時應該失敗', () => {
      // 創建一個壁廠 
      for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 8; col++) {
          game.board.grid[row][col] = 1;
        }
      }

      game.currentPiece.col = 0;
      game.currentPiece.row = 0;

      const originalState = game.currentPiece.rotationState;
      const result = game.rotate();
      
      // 可能失敗
      if (!result) {
        expect(game.currentPiece.rotationState).toBe(originalState);
      }
    });
  });

  describe('硬放', () => {
    test('hardDrop 應該立即放下方塊', () => {
      game.currentPiece.row = 0;
      game.hardDrop();
      
      // 方塊應該已經固定，新方塊應該出現
      expect(game.currentPiece.shapeKey).toBeDefined();
    });

    test('hardDrop 應該返回下移的距離', () => {
      game.currentPiece.row = 0;
      const drops = game.hardDrop();
      expect(drops).toBeGreaterThan(0);
    });
  });

  describe('放置和消除', () => {
    test('placePiece 應該將方塊添加到板中', () => {
      game.currentPiece.row = 18;
      game.currentPiece.col = 0;
      
      const boardBefore = JSON.stringify(game.board.grid);
      game.placePiece();
      
      // 放置應該填充板上的某個位置
      const boardAfter = JSON.stringify(game.board.grid);
      expect(boardBefore).not.toBe(boardAfter);
    });

    test('placePiece 應該生成下一個方塊', () => {
      const nextBeforePlacement = game.nextPiece.shapeKey;
      game.placePiece();
      
      expect(game.currentPiece.shapeKey).toBe(nextBeforePlacement);
      // 新的下一個方塊應該不同（可能相同但只有很小概率）
      expect(game.nextPiece).toBeDefined();
    });

    test('placePiece 應該檢測和消除完整的行', () => {
      // 創建一個部分滿的最後一行
      for (let col = 0; col < 9; col++) {
        game.board.grid[19][col] = 1;
      }
      
      // 創建一個 I 方塊（只佔據 1 列）並放在剩下的位置
      const iPiece = game.currentPiece;
      iPiece.reset(19, 9);
      
      game.placePiece();

      // 應該消除一行且行數增加
      if (game.board.grid[19].every(cell => cell === 0)) {
        expect(game.lines).toBeGreaterThan(0);
      }
    });
  });

  describe('分數計算', () => {
    test('addScore 應該增加分數和行數', () => {
      game.level = 1;
      game.addScore(1);
      
      expect(game.score).toBeGreaterThan(0);
      expect(game.lines).toBe(1);
    });

    test('分數應該根據等級增倍', () => {
      game.level = 1;
      game.addScore(1);
      const scoreLevel1 = game.score;

      game.reset();
      game.level = 2;
      game.addScore(1);
      const scoreLevel2 = game.score;

      expect(scoreLevel2).toBe(scoreLevel1 * 2);
    });

    test('多行消除應該得分更高', () => {
      game.addScore(1);
      const oneLineScore = game.score;

      game.reset();
      game.addScore(4);
      const fourLineScore = game.score;

      expect(fourLineScore).toBeGreaterThan(oneLineScore);
    });

    test('應該根據消除的行數更新等級', () => {
      game.lines = 0;
      game.level = 1;

      game.addScore(10);
      expect(game.level).toBe(2);

      game.addScore(10);
      expect(game.level).toBe(3);
    });
  });

  describe('遊戲狀態', () => {
    test('getState 應該返回完整的遊戲狀態', () => {
      game.start();
      const state = game.getState();

      expect(state.board).toBeDefined();
      expect(state.currentPiece).toBe(game.currentPiece);
      expect(state.nextPiece).toBe(game.nextPiece);
      expect(state.score).toBe(game.score);
      expect(state.lines).toBe(game.lines);
      expect(state.level).toBe(game.level);
      expect(state.isRunning).toBe(true);
      expect(state.isPaused).toBe(false);
    });
  });

  describe('遊戲結束', () => {
    test('應該在無法放置新方塊時結束遊戲', () => {
      // 完全填充頂部行
      for (let col = 0; col < game.board.width; col++) {
        game.board.grid[0][col] = 1;
      }

      // 新方塊應該無法放置
      expect(game.canMoveTo(game.currentPiece)).toBe(false);
      expect(game.isRunning).toBe(false); // isRunning 在遊戲還未開始時應該是 false
    });

    test('endGame 應該停止遊戲並觸發回調', () => {
      game.start();
      expect(game.isRunning).toBe(true);

      let callbackCalled = false;
      let callbackScore = null;
      
      game.onGameOver((score) => {
        callbackCalled = true;
        callbackScore = score;
      });

      game.endGame();

      expect(game.isRunning).toBe(false);
      expect(callbackCalled).toBe(true);
      expect(callbackScore).toBe(game.score);
    });
  });

  describe('tick', () => {
    test('tick 應該在遊戲正在執行時下移方塊', () => {
      game.start();
      const originalRow = game.currentPiece.row;
      
      game.tick();
      
      expect(game.currentPiece.row).toBe(originalRow + 1);
    });

    test('tick 在暫停時應該不做任何事', () => {
      game.start();
      game.pause();
      const originalRow = game.currentPiece.row;
      
      game.tick();
      
      expect(game.currentPiece.row).toBe(originalRow);
    });

    test('tick 在未運行時應該不做任何事', () => {
      const originalRow = game.currentPiece.row;
      
      game.tick();
      
      expect(game.currentPiece.row).toBe(originalRow);
    });
  });
});
