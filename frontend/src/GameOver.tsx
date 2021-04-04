import { ColorId } from "./models";
import styles from "./GameOver.module.css";
import { MoveHistoryOverview } from "./MoveHistoryOverview";

export function GameOver(props: {
  moveHistory: Array<ColorId>;
  aiMoveHistory: Array<ColorId>;
}) {
  const { moveHistory, aiMoveHistory } = props;

  return (
    <div>
      <h1>Congratulations you won!</h1>
      <p>Refresh the page to start a new game.</p>
      <MoveHistoryOverview
        moveHistory={moveHistory}
        aiMoveHistory={aiMoveHistory}
        isGameOver={true}
      />
    </div>
  );
}
