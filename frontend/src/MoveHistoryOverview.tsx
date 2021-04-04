import React, { useContext } from "react";
import { ColorsContext } from "./App";
import { ColorId } from "./models";
import { MoveHistoryList } from "./MoveHistoryList";
import styles from "./MoveHistoryOverview.module.css";

export function MoveHistoryOverview(props: {
  moveHistory: Array<ColorId>;
  aiMoveHistory: Array<ColorId>;
  isGameOver: boolean;
}) {
  const { moveHistory, aiMoveHistory, isGameOver } = props;
  const colors = useContext(ColorsContext);

  return (
    <div className={styles.history}>
      <div className="history-player">
        <MoveHistoryList
          colors={colors}
          history={moveHistory}
          heading={
            isGameOver ? `You took ${moveHistory.length} moves` : "Your moves"
          }
        />
      </div>

      <div className="history-ai">
        <MoveHistoryList
          colors={colors}
          history={aiMoveHistory}
          heading={
            isGameOver
              ? `AI player took ${aiMoveHistory.length} moves`
              : "AI Player moves"
          }
        />
      </div>
    </div>
  );
}
