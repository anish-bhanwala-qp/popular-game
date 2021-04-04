enum Color {
  RED = "r",
  GREEN = "g",
  BLUE = "b",
}

const colors = Object.values(Color);

const colorMapping = [
  { id: Color.RED, color: "red" },
  { id: Color.BLUE, color: "blue" },
  { id: Color.GREEN, color: "green" },
];

type Grid = Array<Color>;

interface IGame {
  gridClone(): Grid;
  getDimension(): number;
  isGameOver(): boolean;
  nextMove(color: Color): void;
}

const MIN_DIMENSION = 2;
const MAX_DIMENSION = 10;

function randomColor() {
  const index = Math.round(Math.random() * (colors.length - 1));
  return colors[index];
}

function initGrid(dimension: number) {
  const grid = new Array(dimension * dimension);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = randomColor();
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
    (color) => colors.find((c) => c === color) == null
  );
  if (invalidColor) {
    throw new Error(
      `Invalid color value. It is ${invalidColor} but must be one of ${colors}`
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
  oldColor: Color,
  newColor: Color,
  currentIndex: number,
  dimension: number
) {
  const visited = visitedGrid[currentIndex];
  const currentColor = grid[currentIndex];

  if (visited) {
    return;
  }

  visitedGrid[currentIndex] = true;
  // Only flip color matching to origin, ignore this one
  if (currentColor !== oldColor) {
    return;
  }

  // flip the color
  grid[currentIndex] = newColor;

  const neighbourIndexes = getConnectedNeighbours(currentIndex, dimension);
  neighbourIndexes.forEach((neighbourIndex) =>
    changeColor(
      grid,
      visitedGrid,
      oldColor,
      newColor,
      neighbourIndex,
      dimension
    )
  );

  /* const topIndex = getTop(currentIndex, dimension);
  if (topIndex != null) {
    changeColor(grid, visitedGrid, oldColor, newColor, topIndex, dimension);
  }

  const rightIndex = getRight(currentIndex, dimension);
  if (rightIndex != null) {
    changeColor(grid, visitedGrid, oldColor, newColor, rightIndex, dimension);
  }

  const bottomIndex = getBottom(currentIndex, dimension);
  if (bottomIndex != null) {
    changeColor(grid, visitedGrid, oldColor, newColor, bottomIndex, dimension);
  }

  const leftIndex = getLeft(currentIndex, dimension);
  if (leftIndex != null) {
    changeColor(grid, visitedGrid, oldColor, newColor, leftIndex, dimension);
  } */
}

class Game implements IGame {
  private moves: Array<Color> = [];
  private gameOver: boolean = false;
  constructor(private grid: Grid, private dimension: number) {}

  gridClone() {
    return this.grid.map((color) => color);
  }

  getDimension() {
    return this.dimension;
  }

  moveCount() {
    return this.moves.length;
  }

  nextMove(newColor: Color) {
    if (this.gameOver) {
      return;
    }

    const originColor = this.grid[0];
    // No change in color, ignore
    if (newColor === originColor) {
      return;
    }

    // track moves made
    this.moves.push(newColor);

    const visitedGrid = this.grid.map((_) => false);
    changeColor(
      this.grid,
      visitedGrid,
      originColor,
      newColor,
      0,
      this.dimension
    );

    this.checkGameOver();
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

export {
  Color,
  IGame,
  colors,
  colorMapping,
  GameFactory,
  getConnectedNeighbours,
};
