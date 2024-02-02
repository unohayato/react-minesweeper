const Cell = ({details, onUpdateFlag}) => {
  const cellStyle = {
    width: 40,
    height: 40,
    background: "lightgray",
    borderWidth: 3,
    borderStyle: "outset",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer"
  }

  // セルの種類ごとに表示する内容を変える(🚩, 💣, 周辺の爆弾数)
  const getCellDisplay = () => {
    // デフォルトでnull=非表示で隠している
    if (!details.revealed) {
      return details.flagged ? "🚩" : null;
    }
    if (details.value === "X") {
      return "💣";
    }
    if (details.value === 0) {
      return details.value;
    }
  }

  return (
    <div style={cellStyle} onContextMenu={(e) => onUpdateFlag(e, details.x, details.y)}>
      {getCellDisplay()}
    </div>
  );
}

export default Cell;