export type ColorId = string;

export interface Color {
  id: ColorId;
  color: string;
}

export type Grid = Array<ColorId>;

export interface NextMoveServerResponse {
  id: number;
  grid: Grid;
  isGameOver: boolean;
  moveHistory?: Array<ColorId>;
  aiMoveHistory?: Array<ColorId>;
}

export interface InitServerResponse {
  id: number;
  grid: Grid;
  colors: Array<Color>;
  dimension: number;
}
