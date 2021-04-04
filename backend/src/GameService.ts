import { AiPlayer } from "./game/AiPlayer";
import { GameFactory, IGame } from "./game/Game";
import { ColorId, GameConfig } from "./game/GameConfig";

const DIMENSION = GameConfig.getDimension();
const COLORS = GameConfig.getColors();

let realPlayerGame: IGame | null = null;
let aiPlayerGame: IGame | null = null;

function convertToGameDto(realPlayerGame: IGame, aiPlayerGame: IGame) {
  return {
    grid: realPlayerGame.getGrid(),
    dimension: realPlayerGame.getDimension(),
    isGameOver: realPlayerGame.isGameOver(),
    colors: COLORS,
    moveHistory: realPlayerGame.getMoves(),
    aiMoveHistory: aiPlayerGame.getMoves(),
  };
}

export const GameService = {
  start() {
    realPlayerGame = GameFactory.withDimension(DIMENSION);
    aiPlayerGame = GameFactory.withGrid(realPlayerGame.getGrid(), DIMENSION);

    return convertToGameDto(realPlayerGame, aiPlayerGame);
  },
  nextMove(color: ColorId) {
    if (!realPlayerGame) {
      throw new Error("No game started yet");
    }
    if (!aiPlayerGame) {
      throw new Error("No game started yet");
    }

    realPlayerGame.nextMove(color);

    // Make AI move as well
    if (!aiPlayerGame.isGameOver()) {
      const nextColor = AiPlayer.calculateNextMove(
        aiPlayerGame.getGrid(),
        DIMENSION
      );
      aiPlayerGame.nextMove(nextColor);
    }

    return convertToGameDto(realPlayerGame, aiPlayerGame);
  },
  isGameInProgress() {
    return realPlayerGame != null;
  },
  cleanup() {
    realPlayerGame = null;
  },
};
