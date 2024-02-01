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

  return (
    <div>
      <div>
        {gameData.board.map((singleRow, index1) => {
          return (
            <div style={{display: "flex"}} key={index1}>
              {
                singleRow.map((singleCell, index2) => {
                  return <Cell key={index2} details={singleCell} />
                })
              }
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Board;