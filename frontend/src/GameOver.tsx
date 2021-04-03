import { ColorId } from "./models";

export function GameOver(props: {
  moveHistory: Array<ColorId>;
  aiMoveHistory: Array<ColorId>;
}) {
  const { moveHistory, aiMoveHistory } = props;
  return (
    <div>
      <h1>Congratulations you won!</h1>
      <div className="history">
        <div className="history-player">
          <h4>You took {moveHistory.length} moves.</h4>
          <ul>
            {moveHistory.map((colorId, index) => (
              <li key={index}>{colorId}</li>
            ))}
          </ul>
        </div>
        <div className="history-ai">
          <h4>AI took {aiMoveHistory.length} moves.</h4>
          <ul>
            {aiMoveHistory.map((colorId, index) => (
              <li key={index}>{colorId}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
