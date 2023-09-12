const createBorad = (row, col, mine) => {
  let board = [];
  
  for (let x = 0; x < row; x++){
    for (let y = 0; y < col; y++){
      r.push({
        value: 0,
        revealed: false,
        x: x,
        y: y,
        flagged: false,
      });
    }
    board.push(r);
  } 

  
}