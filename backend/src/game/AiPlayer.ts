import { getConnectedNeighbours } from "./Game";
import { ColorId, GameConfig } from "./GameConfig";

const COLORS = GameConfig.getColors();

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
function calculateNextMove(grid: Array<ColorId>, dimension: number): ColorId {
  const colorCountMap = new Map<ColorId, { count: number }>();
  const visistedGrid = grid.map((colorId) => ({
    colorId,
    visited: false,
  }));

  const originColorId = grid[0];
  traverseConnectedTiles(
    visistedGrid,
    colorCountMap,
    0,
    originColorId,
    dimension
  );

  let selectedColorId = COLORS.find(({ id }) => id !== originColorId)!.id;
  let maxCount = 0;

  for (const [colorId, { count }] of colorCountMap) {
    if (count > maxCount) {
      selectedColorId = colorId;
      maxCount = count;
    }
  }

  return selectedColorId;
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
  grid: Array<{ colorId: ColorId; visited: boolean }>,
  colorCountMap: Map<ColorId, { count: number }>,
  currentIndex: number,
  originColorId: ColorId,
  dimension: number
) {
  const tile = grid[currentIndex];
  // if already visited return
  if (tile.visited) {
    return;
  }

  // check if top is same color, mark visited, continue
  if (tile.colorId === originColorId) {
    tile.visited = true;

    const neighbourIndexes = getConnectedNeighbours(currentIndex, dimension);
    neighbourIndexes.forEach((neighbourIndex) =>
      traverseConnectedTiles(
        grid,
        colorCountMap,
        neighbourIndex,
        originColorId,
        dimension
      )
    );
  } else {
    // if different color find only same color connected components
    if (!colorCountMap.has(tile.colorId)) {
      colorCountMap.set(tile.colorId, { count: 0 });
    }

    const countObj = colorCountMap.get(tile.colorId)!;
    countConnectedTilesForColor(
      tile.colorId,
      grid,
      currentIndex,
      countObj,
      dimension
    );
  }
}

function countConnectedTilesForColor(
  colorId: ColorId,
  grid: Array<{ colorId: ColorId; visited: boolean }>,
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
  if (tile.colorId !== colorId) {
    return;
  }

  tile.visited = true;

  // increment count for this tile
  countObj.count++;
  //  check each neighbour for same color and increment count
  const neighbourIndexes = getConnectedNeighbours(currentIndex, dimension);
  neighbourIndexes.forEach((neighbourIndex) =>
    countConnectedTilesForColor(
      colorId,
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
