import { Grid } from "./models";

export function GridLayout(props: { grid: Grid; dimension: number }) {
  const { grid, dimension } = props;
  return (
    <div>
      {Array(dimension)
        .fill(0)
        .map((_, rowIndex) => {
          const rowStartIndex = rowIndex * dimension;
          const rowItems = grid.slice(rowStartIndex, rowStartIndex + dimension);

          // group items (spans) for one row in a div
          return (
            <div className="grid-row" key={rowIndex}>
              {rowItems.map((color, index) => (
                <span key={rowStartIndex + index} data-testid="tile">
                  {color}
                </span>
              ))}
            </div>
          );
        })}
    </div>
  );
}
