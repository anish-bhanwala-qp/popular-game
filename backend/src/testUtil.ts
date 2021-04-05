import { Grid } from "./game/Game";
const [R, G, B] = ["r", "g", "b"];

export const TEST_COLORS = [
  { id: R, color: "red" },
  { id: G, color: "green" },
  { id: B, color: "blue" },
];

export const TEST_COLOR_Ids = {
  R,
  G,
  B,
};

// Pick color that's not origin, otherwise the move is ignored.
export const findNonOriginColorId = (grid: Grid) => {
  const originColorId = grid[0];
  return grid.find((c) => c !== originColorId)!;
};
