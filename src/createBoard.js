// ボード初期化(セルの値) -> 地雷の設置 -> 地雷情報の取得and付加
const createBorad = (row, col, mine) => {
  let board = [];

  // ボードの初期化
  for (let x = 0; x < row; x++) {
    let r = [];
    for (let y = 0; y < col; y++) {
      // これが1マス分のセルの状態
      r.push({
        value: 0, // マスの周り3*3の地雷数, 地雷自身の場合は'X'
        revealed: false,
        x: x,
        y: y,
        flagged: false
      });
    }
  }

  // 地雷の埋め込み(ランダムモジュール使う)
  let mineCount = 0;
  while (mineCount < mine) {
    const x = Math.floor(Math.random() * row);
    const y = Math.floor(Math.random() * col);

    if (board[x][y].value === 0) {
      board[x][y].value = 'X';
      mineCount++;
    }
  }

  // 周辺の3*3にある地雷数の計算

  // セルを一つずつ探索
  for (let x = 0; x < row; x++) {
    for (let y = 0; y < col; y++) {
      
      // 地雷以外であれば周辺の地雷を探索
      if (board[x][y] !== 'X') {
        let count = 0;
        // 左端(0)<=y2<=右端(col) ではみ出ないように探索
        for (let y2 = Math.max(y - 1, 0); y2 < Math.min(y + 2, col); y2++) {
          // 上端(0)<=y2<=下端(row) ではみ出ないように探索
          for (let x2 = Math.max(x - 1, 0); x2 < Math.min(x + 2, row); x2++) {
            if (board[x2][y2].value === 'X') {
              count++;
            }
          }
        }

        board[x][y].value = count;

      }
    }
  }

  return board;
}

export default createBorad;