import { ColorId, GameConfig } from "./GameConfig";

const COLORS = GameConfig.getColors();
const DIMENSION = GameConfig.getDimension();

export type Grid = Array<ColorId>;

interface IGame {
  getGrid(): Grid;
  getDimension(): number;
  isGameOver(): boolean;
  nextMove(color: ColorId): Promise<void>;
  getMoves(): Array<ColorId>;
}

const MIN_DIMENSION = 2;
const MAX_DIMENSION = 10;

function randomColorId() {
  const index = Math.round(Math.random() * (COLORS.length - 1));
  return COLORS[index].id;
}

function initGrid(dimension: number) {
  const grid = new Array(dimension * dimension);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = randomColorId();
  }

  return grid;
}

function validateDimension(dimension: number) {
  const notInteger = dimension % 1 !== 0;
  if (dimension < MIN_DIMENSION || dimension > MAX_DIMENSION || notInteger) {
    throw new Error(
      `The game dimension must be an integer between ${MIN_DIMENSION} & ${MAX_DIMENSION}`
    );
  }
}

function validateGrid(grid: Grid, dimension: number) {
  const expectedGridLength = dimension * dimension;
  if (grid.length !== expectedGridLength) {
    throw new Error(
      `The grid length must be ${expectedGridLength} but was ${grid.length}`
    );
  }

  const invalidColor = grid.find(
    (colorId) => COLORS.find(({ id }) => id === colorId) == null
  );
  if (invalidColor) {
    throw new Error(
      `Invalid color value. It is ${invalidColor} but must be one of ${COLORS.map(
        ({ id }) => id
      )}`
    );
  }
}

/* 
    There are two constructor functions
    - withDimension
        This method allows to auto create grid an initialize
        the tiles with randomly picked colors.
    - withGrid
        This method allows to create a game with already
        initialized grid with colors. There are two use cases for this:
        1. Maybe save game state to db and restore/resume it.
        2. Allows testing with predefined game state.
*/
const GameFactory = {
  withDimension(dimension: number) {
    validateDimension(dimension);
    const grid = initGrid(dimension);
    return new Game(grid, dimension);
  },
  withGrid(grid: Grid, dimension: number) {
    validateDimension(dimension);
    validateGrid(grid, dimension);
    return new Game(grid, dimension);
  },
};

function changeColor(
  grid: Grid,
  visitedGrid: Array<boolean>,
  oldColor: ColorId,
  newColor: ColorId,
  currentIndex: number,
  dimension: number
): Promise<void> {
  const visited = visitedGrid[currentIndex];
  const currentColor = grid[currentIndex];

  if (visited) {
    return Promise.resolve();
  }

  visitedGrid[currentIndex] = true;
  // Only flip color matching to origin, ignore this one
  if (currentColor !== oldColor) {
    return Promise.resolve();
  }

  // flip the color
  grid[currentIndex] = newColor;

  const neighbourIndexes = getConnectedNeighbours(currentIndex, dimension);

  const neighbourPromises: Array<Promise<void>> = [];
  neighbourIndexes.forEach((neighbourIndex) =>
    neighbourPromises.push(
      changeColor(
        grid,
        visitedGrid,
        oldColor,
        newColor,
        neighbourIndex,
        dimension
      )
    )
  );

  return Promise.all(neighbourPromises).then(() => Promise.resolve());
}

class Game implements IGame {
  private moves: Array<ColorId> = [];
  private gameOver: boolean = false;
  constructor(private grid: Grid, private dimension: number) {}

  getGrid() {
    return this.grid.map((color) => color);
  }

  getMoves() {
    return this.moves.map((c) => c);
  }

  getDimension() {
    return this.dimension;
  }

  moveCount() {
    return this.moves.length;
  }

  nextMove(newColor: ColorId): Promise<void> {
    if (this.gameOver) {
      return Promise.resolve();
    }

    const originColor = this.grid[0];
    // No change in color, ignore
    if (newColor === originColor) {
      return Promise.resolve();
    }

    // track moves made
    this.moves.push(newColor);

    const visitedGrid = this.grid.map((_) => false);
    const changeColorPromise = changeColor(
      this.grid,
      visitedGrid,
      originColor,
      newColor,
      0,
      this.dimension
    );

    return changeColorPromise.then(() => {
      this.checkGameOver();
    });
  }

  private checkGameOver() {
    if (this.gameOver) {
      return;
    }

    const originColor = this.grid[0];
    this.gameOver = this.grid.find((c) => c !== originColor) == null;
  }

  isGameOver() {
    return this.gameOver;
  }
}

/* 
    Calculates connected neighbours for given index in a grid.
    Neighbour here means directly connected tiles to north, east, south and west.
    It doesn't incluce diagonal neighbours.
    @param {Number} index - The index of the current tile.
    @param {Number} dimension - The dimension of the grid. E.g. 
        for 4 x 4 grid dimension is 4.
    @returns {Array<Number>} Returns array indexes of all immediate neighbours.
*/
function getConnectedNeighbours(index: number, dimension: number) {
  const neighbourIndexes = [];
  const topIndex = getTop(index, dimension);
  if (topIndex != null) {
    neighbourIndexes.push(topIndex);
  }

  const rightIndex = getRight(index, dimension);
  if (rightIndex != null) {
    neighbourIndexes.push(rightIndex);
  }

  const bottomIndex = getBottom(index, dimension);
  if (bottomIndex != null) {
    neighbourIndexes.push(bottomIndex);
  }

  const leftIndex = getLeft(index, dimension);
  if (leftIndex != null) {
    neighbourIndexes.push(leftIndex);
  }

  return neighbourIndexes;
}

function getLeft(currentIndex: number, dimension: number) {
  // if first column
  if (currentIndex % dimension === 0) {
    return null;
  }

  return currentIndex - 1;
}

function getBottom(currentIndex: number, dimension: number) {
  // if last row
  const lastRowFirstColIndex = dimension * dimension - dimension;
  if (currentIndex >= lastRowFirstColIndex) {
    return null;
  }

  return currentIndex + dimension;
}

function getRight(currentIndex: number, dimension: number) {
  // if last column
  if ((currentIndex + 1) % dimension === 0) {
    return null;
  }

  return currentIndex + 1;
}

function getTop(currentIndex: number, dimension: number) {
  // if first row no top
  if (currentIndex < dimension) {
    return null;
  }

  return currentIndex - dimension;
}

export { IGame, GameFactory, getConnectedNeighbours };
