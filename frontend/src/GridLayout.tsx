import { Grid } from "./models";
import styles from "./GridLayout.module.css";
import { resolveColor } from "./util";
import { useContext } from "react";
import { ColorsContext } from "./App";

export function GridLayout(props: { grid: Grid; dimension: number }) {
  const { grid, dimension } = props;
  const colors = useContext(ColorsContext);

  return (
    <div>
      {Array(dimension)
        .fill(0)
        .map((_, rowIndex) => {
          const rowStartIndex = rowIndex * dimension;
          const rowItems = grid.slice(rowStartIndex, rowStartIndex + dimension);

          // group items (spans) for one row in a div
          return (
            <div className={styles.gridRow} key={rowIndex}>
              {rowItems.map((color, index) => {
                const backgroundColor = resolveColor(color, colors);
                return (
                  <span
                    key={rowStartIndex + index}
                    data-testid="tile"
                    className={styles.gridColumn}
                    style={{
                      backgroundColor,
                    }}
                  >
                    {color}
                  </span>
                );
              })}
            </div>
          );
        })}
    </div>
  );
}
