import { Color, ColorId } from "./models";
import { resolveColor } from "./util";
import styles from "./MoveHistory.module.css";

export function MoveHistory(props: {
  heading: string;
  history: Array<ColorId>;
  colors: Array<Color>;
}) {
  const { heading, history, colors } = props;
  return (
    <>
      <h4 className={styles.historyListHeading}>{heading}</h4>
      <ul className={styles.historyList}>
        {history.map((colorId, index) => (
          <li
            key={index}
            style={{ backgroundColor: resolveColor(colorId, colors) }}
          >
            {colorId}
          </li>
        ))}
      </ul>
    </>
  );
}
