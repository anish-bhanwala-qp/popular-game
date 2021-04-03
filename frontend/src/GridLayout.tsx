import { Grid } from "./models";

export function GridLayout(props: { grid: Grid }) {
  const { grid } = props;
  return (
    <div>
      {grid.map((c, index) => (
        <span key={index} data-testid="tile">
          {c}
        </span>
      ))}
    </div>
  );
}
