import { Color, ColorId } from "./models";
import { resolveColor } from "./util";
import styles from "./MoveHistoryList.module.css";

export function MoveHistoryList(props: {
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
