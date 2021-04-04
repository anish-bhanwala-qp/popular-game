import { ColorId } from "./models";
import styles from "./GameOver.module.css";
import { MoveHistory } from "./MoveHistory";
import { useContext } from "react";
import { ColorsContext } from "./App";

export function GameOver(props: {
  moveHistory: Array<ColorId>;
  aiMoveHistory: Array<ColorId>;
}) {
  const { moveHistory, aiMoveHistory } = props;
  const colors = useContext(ColorsContext);

  return (
    <div>
      <h1>Congratulations you won!</h1>
      <p>Refresh the page to start a new game.</p>
      <div className={styles.history}>
        <div className="history-player">
          <MoveHistory
            colors={colors}
            history={moveHistory}
            heading={`You took ${moveHistory.length} moves`}
          />
        </div>
        <div className="history-ai">
          <MoveHistory
            colors={colors}
            history={aiMoveHistory}
            heading={`AI player took ${aiMoveHistory.length} moves`}
          />
        </div>
      </div>
    </div>
  );
}
