export enum Color {
  RED = "r",
  GREEN = "g",
  BLUE = "b",
}

const colors = Object.values(Color);

type Grid = Array<Array<Color>>;

const MIN_DIMENSION = 2;
const MAX_DIMENSION = 10;

function randomColor() {
  const index = Math.round(Math.random() * (colors.length - 1));
  return colors[index];
}

function initGrid(dimension: number) {
  const grid = new Array(dimension);
  // Iterate rows
  for (let rowIndex = 0; rowIndex < dimension; rowIndex++) {
    grid[rowIndex] = new Array(dimension);

    for (let colIndex = 0; colIndex < dimension; colIndex++) {
      grid[rowIndex][colIndex] = randomColor();
    }
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

function validateGrid(grid: Grid) {
  if (grid.length < MIN_DIMENSION) {
    throw new Error(
      `The grid dimension must be an integer between ${MIN_DIMENSION} & ${MAX_DIMENSION}`
    );
  }

  // Validate the row count matches column count for each row.
  // E.g. if grid has 3 rows, each row should have 3 columns.
  let index = 0;
  for (const row of grid) {
    if (row.length !== grid.length) {
      throw new Error(
        `The grid is invalid. The column count should be ${grid.length} for row index: ${index}`
      );
    }
    index++;
  }

  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    for (let colIndex = 0; colIndex < grid.length; colIndex++) {
      const color = grid[rowIndex][colIndex];
      if (colors.find((c) => c === color) == null) {
        throw new Error(
          `Invalid color [${color}] at index [${rowIndex}, ${colIndex}]. Color value must be one of ${colors}`
        );
      }
    }
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
export const GameFactory = {
  withDimension(dimension: number) {
    validateDimension(dimension);
    const grid = initGrid(dimension);
    return new Game(grid);
  },
  withGrid(grid: Grid) {
    validateGrid(grid);
    return new Game(grid);
  },
};

class Game {
  constructor(private grid: Grid) {}

  dimension() {
    return this.grid.length;
  }

  gridSize() {
    return this.grid.length * this.grid.length;
  }

  gridClone() {
    return this.grid.map((row) => row.map((col) => col));
  }

  move(color: Color) {
    //
  }

  [Symbol.iterator]() {
    let row = 0;
    let col = 0;
    let iterationCount = 0;

    const dimension = this.dimension();
    const grid = this.grid;

    const iterator = {
      next(): IteratorResult<{ row: number; col: number; color: Color }> {
        if (iterationCount++ > 101) {
          throw new Error("Stuck in a loop");
        }

        if (col >= dimension) {
          col = 0;
          row++;
        }

        const isEndOfGrid = row >= dimension;
        if (isEndOfGrid) {
          return {
            value: null,
            done: true,
          };
        }

        const result = {
          value: { row, col: col, color: grid[row][col] },
          done: false,
        };

        col++;

        return result;
      },
    };

    return iterator;
  }
}

// lets find all connected componnets first
function chooseNextColor(grid: Array<Color>, dimension: number) {
  const colorCountMap = new Map<Color, { count: number }>();
  const gridClone = grid.map((color) => ({
    color,
    visited: false,
  }));

  const originColor = grid[0];
  countByColorOfConnectedTiles(
    gridClone,
    colorCountMap,
    0,
    originColor,
    dimension
  );

  let selectedColor = colors.find((c) => c !== originColor);
  let maxCount = 0;

  for (const [color, { count }] of colorCountMap) {
    if (count > maxCount) {
      selectedColor = color;
      maxCount = count;
    }
  }

  return selectedColor;
}

function countByColorOfConnectedTiles(
  grid: Array<{ color: Color; visited: boolean }>,
  colorCountMap: Map<Color, { count: number }>,
  currentIndex: number,
  originColor: Color,
  dimension: number
) {
  const tile = grid[currentIndex];
  // if already visited return
  if (tile.visited) {
    return;
  }

  // check if top is same color, mark visited, continue
  if (tile.color === originColor) {
    tile.visited = true;

    const topIndex = getTop(currentIndex, dimension);
    if (topIndex != null) {
      countByColorOfConnectedTiles(
        grid,
        colorCountMap,
        topIndex,
        originColor,
        dimension
      );
    }

    const rightIndex = getRight(currentIndex, dimension);
    if (rightIndex != null) {
      countByColorOfConnectedTiles(
        grid,
        colorCountMap,
        rightIndex,
        originColor,
        dimension
      );
    }

    const bottomIndex = getBottom(currentIndex, dimension);
    if (bottomIndex != null) {
      countByColorOfConnectedTiles(
        grid,
        colorCountMap,
        bottomIndex,
        originColor,
        dimension
      );
    }

    const leftIndex = getLeft(currentIndex, dimension);
    if (leftIndex != null) {
      countByColorOfConnectedTiles(
        grid,
        colorCountMap,
        leftIndex,
        originColor,
        dimension
      );
    }
  } else {
    // if different color find only same color connected components
    if (!colorCountMap.has(tile.color)) {
      colorCountMap.set(tile.color, { count: 0 });
    }

    const countObj = colorCountMap.get(tile.color)!;
    computeCcCount(grid, tile.color, currentIndex, countObj, dimension);
  }
}

function computeCcCount(
  grid: Array<{ color: Color; visited: boolean }>,
  color: Color,
  currentIndex: number,
  countObj: { count: number },
  dimension: number
) {
  const tile = grid[currentIndex];
  // if already visited return
  if (tile.visited) {
    return;
  }

  // if different color return
  if (tile.color !== color) {
    return;
  }

  // increment count for this tile
  countObj.count++;
  //  check each neighbour for same color and increment count
  const topIndex = getTop(currentIndex, dimension);
  if (topIndex != null) {
    computeCcCount(grid, color, topIndex, countObj, dimension);
  }

  const rightIndex = getRight(currentIndex, dimension);
  if (rightIndex != null) {
    computeCcCount(grid, color, rightIndex, countObj, dimension);
  }

  const bottomIndex = getBottom(currentIndex, dimension);
  if (bottomIndex != null) {
    computeCcCount(grid, color, bottomIndex, countObj, dimension);
  }

  const leftIndex = getLeft(currentIndex, dimension);
  if (leftIndex != null) {
    computeCcCount(grid, color, leftIndex, countObj, dimension);
  }
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
