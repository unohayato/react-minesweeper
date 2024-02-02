import { useState, useEffect } from "react";
import createBorad from "./createBoard";
import Cell from "./Cell";

const Board = ({row, col, mines}) => {
  const [gameData, setGameData] = useState({});
  const [resetGame, setResetGame] = useState(true);

  // ゲームのリセット
  useEffect(() => {
    const newBoard = createBorad(row, col, mines);
    console.log(newBoard);

    setGameData({
      board: newBoard,
      gameStatus: "Game in Progress",
      cellsWithoutMines: row * col - mines,
      numOfMines: mines
    });

    setResetGame(false);
  }, [row, col, mines, resetGame]);
  
  // 最初だけゲーム情報を入れる
  useEffect(() => {
    const newBoard = createBorad(row, col, mines);
    console.log(newBoard);

    setGameData({
      board: newBoard,
      gameStatus: "Game in Progress",
      cellsWithoutMines: row * col - mines,
      numOfMines: mines
    });
  }, [row, col, mines]);
  
  if (!gameData.board) {
    return (
      <div>
      Loading...
    </div>
    );
  }

  // フラグを立てる、はずすの処理
  const handleUpdateFlag = (e, x, y) => {
    e.preventDefault(); // (クリック)イベントが発生したら他の動作が干渉しないようにする処理
    // 決着がついていたら(ゲームがおわっていたら)何もしない
    if (gameData.gameStatus === "You Lost" || gameData.gameStatus === "You Win") {
      return;
    }
    // このセルが空いているたら何もしない
    if (gameData.board[x][y].revealed) {
      return;
    }

    // 本命のフラグ処理
    // 現在のゲームデータを取得(クリックされた時に)して...
    setGameData((prev) => {
      const newBoard = [...prev.board]; // 現在のボードを取得
      const newFlag = !newBoard[x][y].flagged; // 現在のフラグを取得&更新
      let newNumOfMines = prev.numOfMines; // 現在の地雷数を定義(取得)(のちに更新かける)
      newFlag ? newNumOfMines-- : newNumOfMines++; // フラグを立っている(次に外す)->地雷-1,フラグ立っていない(次に立てる)->地雷+1
      newBoard[x][y].flagged = newFlag;

      return {
        ...prev,
        numOfMines: newNumOfMines,
        board: newBoard
      }
    });
  }

  // クリックしたらセルを開く処理
  const handleRevealCell = (x, y) => {
    // 最初に無視する処理
    if (gameData.gameStatus === "You Lost" || gameData.gameStatus === "You Win") {
      return;
    }
    if (gameData.board[x][y].revealed || gameData.board[x][y].flagged) {
      return;
    }

    // 現在のゲームデータを取得
    const newGameData = {...gameData}

    // 上から セルが地雷の場合, セルの周りに地雷がない場合, セルの周りに1つ以上地雷がある場合
    if (newGameData.board[x][y].value === "X") {
      for (x = 0; x < row; x++) {
        for (y = 0; y < col; y++) {
          // 空いていなれば開ける
          if (!newGameData.board[x][y].revealed) {
            newGameData.board[x][y].revealed = true;
          }
        }
      }
      // 強制的に負け
      newGameData.gameStatus = "You Lost";
    } else if (newGameData.board[x][y].value === 0) {
      const newRevealedData = revealEmpty(x, y, newGameData);
      setGameData(newRevealedData);
      return;
    } else {
      newGameData.board[x][y].revealed = true;
      newGameData.cellsWithoutMines--;
      if (newGameData.cellsWithoutMines === 0) {
        newGameData.gameStatus = "You Win";
      }
    }
    setGameData(newGameData);
  }

  // handleRevealCellにてセルの周りに地雷がない場合に開ける処理
  const revealEmpty = (x, y, data) => {
    // 空いていたら何もしない
    if (data.board[x][y].revealed) {
      return;
    }

    // 以下は開いていない場合の処理
    data.board[x][y].revealed = true;
    data.cellsWithoutMines--;
    if (data.cellsWithoutMines === 0) {
      data.gameStatus = "You Win";
    }

    // 地雷がない場合に周辺のセルをいっぺんに開示
    if (data.board[x][y].value === 0) {
      // 左端(0)<=y2<=右端(col) ではみ出ないように探索
      for (let y2 = Math.max(y - 1, 0); y2 < Math.min(y + 2, col); y2++) {
        // 上端(0)<=y2<=下端(row) ではみ出ないように探索
        for (let x2 = Math.max(x - 1, 0); x2 < Math.min(x + 2, row); x2++) {
          if (x2 !== x || y2 !== y) {revealEmpty(x2, y2, data);} //繋がっている地雷でないセルの開示は再起的に処理してしまう
        }
      }
    }

    return data;
  }

  return (
    <div>
      <div>
        🚩 {gameData.numOfMines} &nbsp; &nbsp;
        <button onClick={() => {setResetGame(true);}}>Reset</button>
      </div>
      <div>Game Status: {gameData.gameStatus}</div>
      <div>
        {gameData.board.map((singleRow, index1) => {
          return (
            <div style={{display: "flex"}} key={index1}>
              {
                singleRow.map((singleCell, index2) => {
                  return <Cell key={index2} details={singleCell} onUpdateFlag={handleUpdateFlag} onRevealCell={handleRevealCell} />
                })
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Board;