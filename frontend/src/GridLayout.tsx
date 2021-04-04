import { Color, Grid } from "./models";
import styles from "./GridLayout.module.css";

export function GridLayout(props: {
  grid: Grid;
  dimension: number;
  colors: Array<Color>;
}) {
  const { grid, dimension, colors } = props;
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
                const backgroundColor = colors.find((c) => c.id === color)
                  ?.color;
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
