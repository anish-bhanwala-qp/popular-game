import { Color, colors, getConnectedNeighbours } from "./Game";

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
function calculateNextMove(grid: Array<Color>, dimension: number): Color {
  const colorCountMap = new Map<Color, { count: number }>();
  const visistedGrid = grid.map((color) => ({
    color,
    visited: false,
  }));

  const originColor = grid[0];
  traverseConnectedTiles(
    visistedGrid,
    colorCountMap,
    0,
    originColor,
    dimension
  );

  let selectedColor = colors.find((c) => c !== originColor)!;
  let maxCount = 0;

  for (const [color, { count }] of colorCountMap) {
    if (count > maxCount) {
      selectedColor = color;
      maxCount = count;
    }
  }

  return selectedColor;
}

/* 
  To DFS to traverse all tiles connected to the origin.
  In case we find a different color tile connected to the origin, we 
  calculate all tiles connected to this tile.
  That way for each non-origin color we count tiles directly connected 
  to the origin. E.g. if origin color is green, we calculate count of 
  blue and red tiles that are directly connected to the origin.
*/
function traverseConnectedTiles(
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

    const neighbourIndexes = getConnectedNeighbours(currentIndex, dimension);
    neighbourIndexes.forEach((neighbourIndex) =>
      traverseConnectedTiles(
        grid,
        colorCountMap,
        neighbourIndex,
        originColor,
        dimension
      )
    );
  } else {
    // if different color find only same color connected components
    if (!colorCountMap.has(tile.color)) {
      colorCountMap.set(tile.color, { count: 0 });
    }

    const countObj = colorCountMap.get(tile.color)!;
    countConnectedTilesForColor(
      tile.color,
      grid,
      currentIndex,
      countObj,
      dimension
    );
  }
}

function countConnectedTilesForColor(
  color: Color,
  grid: Array<{ color: Color; visited: boolean }>,
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
  const neighbourIndexes = getConnectedNeighbours(currentIndex, dimension);
  neighbourIndexes.forEach((neighbourIndex) =>
    countConnectedTilesForColor(
      color,
      grid,
      neighbourIndex,
      countObj,
      dimension
    )
  );
}

export const AiPlayer = {
  calculateNextMove,
};
