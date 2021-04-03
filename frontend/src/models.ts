export type ColorId = string;

export interface Color {
  id: ColorId;
  color: string;
}

export type Grid = Array<ColorId>;

export interface ServerResponse {
  grid: Grid;
  colors: Array<Color>;
}
