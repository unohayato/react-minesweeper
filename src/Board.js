import { useState, useEffect } from "react";
import createBorad from "./createBoard";
import Cell from "./Cell";

const Board = ({row, col, mines}) => {
  const [gameData, setGameData] = useState({});
  
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

  return (
    <div>
      <div>残りの地雷数: {gameData.numOfMines}</div>
      <div>Game Status: {gameData.gameStatus}</div>
      <div>
        {gameData.board.map((singleRow, index1) => {
          return (
            <div style={{display: "flex"}} key={index1}>
              {
                singleRow.map((singleCell, index2) => {
                  return <Cell key={index2} details={singleCell} onUpdateFlag={handleUpdateFlag} />
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