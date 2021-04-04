import { Color, GameFactory, IGame } from "./game/Game";

let activeGame: IGame;

function convertToGameDto(game: IGame) {
  return {
    grid: game.gridClone(),
    dimension: game.getDimension(),
    isGameOver: game.isGameOver(),
  };
}

export const GameService = {
  init() {
    activeGame = GameFactory.withDimension(10);
    return convertToGameDto(activeGame);
  },
  nextMove(color: Color) {},
};
