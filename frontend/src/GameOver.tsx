import { Color, ColorId } from "./models";
import styles from "./GameOver.module.css";
import { resolveColor } from "./util";

export function GameOver(props: {
  moveHistory: Array<ColorId>;
  aiMoveHistory: Array<ColorId>;
  colors: Array<Color>;
}) {
  const { moveHistory, aiMoveHistory, colors } = props;
  return (
    <div>
      <h1>Congratulations you won!</h1>
      <div className={styles.history}>
        <div className="history-player">
          <h4 className={styles.historyListHeading}>
            You took {moveHistory.length} moves
          </h4>
          <ul>
            {moveHistory.map((colorId, index) => (
              <li
                key={index}
                style={{ backgroundColor: resolveColor(colorId, colors) }}
              >
                {colorId}
              </li>
            ))}
          </ul>
        </div>
        <div className="history-ai">
          <h4 className={styles.historyListHeading}>
            AI took {aiMoveHistory.length} moves
          </h4>
          <ul>
            {aiMoveHistory.map((colorId, index) => (
              <li
                key={index}
                style={{ backgroundColor: resolveColor(colorId, colors) }}
              >
                {colorId}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
