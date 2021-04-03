import { Color, colors } from "./Game";

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

// lets find all connected componnets first
export function automatedMove(grid: Array<Color>, dimension: number): Color {
  const colorCountMap = new Map<Color, { count: number }>();
  const visistedGrid = grid.map((color) => ({
    color,
    visited: false,
  }));

  const originColor = grid[0];
  countByColorOfConnectedTiles(
    visistedGrid,
    colorCountMap,
    0,
    originColor,
    dimension
  );

  let selectedColor = colors.find((c) => c !== originColor)!;
  let maxCount = 0;

  console.log(colorCountMap);
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

  tile.visited = true;

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
