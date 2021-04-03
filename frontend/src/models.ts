export type ColorId = string;

export interface Color {
  id: ColorId;
  color: string;
}

export type Grid = Array<ColorId>;

export interface NextMoveServerResponse {
  grid: Grid;
  gameOver: boolean;
  moveHistory?: Array<ColorId>;
  aiMoveHistory?: Array<ColorId>;
}

export interface InitServerResponse {
  grid: Grid;
  colors: Array<Color>;
  dimension: number;
}
