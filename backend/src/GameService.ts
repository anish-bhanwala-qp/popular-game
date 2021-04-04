import { Color, colorMapping, GameFactory, IGame } from "./game/Game";

let activeGame: IGame | null = null;

function convertToGameDto(game: IGame) {
  return {
    grid: game.gridClone(),
    dimension: game.getDimension(),
    isGameOver: game.isGameOver(),
    colors: colorMapping,
  };
}

export const GameService = {
  start() {
    activeGame = GameFactory.withDimension(10);
    return convertToGameDto(activeGame);
  },
  nextMove(color: Color) {
    if (!activeGame) {
      throw new Error("No game started yet");
    }

    activeGame.nextMove(color);
    return convertToGameDto(activeGame);
  },
  isGameInProgress() {
    return activeGame != null;
  },
  cleanup() {
    activeGame = null;
  },
};
