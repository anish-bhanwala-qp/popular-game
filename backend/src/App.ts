import express, { NextFunction, Request, Response } from "express";
import { GameConfig } from "./game/GameConfig";
import { GameService } from "./GameService";

const COLORS = GameConfig.getColors();

export const app = express();

app.use(express.json());

app.get("/api/game/start", (req, res, next) => {
  const game = GameService.start();
  res.status(200).send(game);
});

app.put("/api/game/next-move", (req, res, next) => {
  if (!GameService.isGameInProgress()) {
    return res.status(400).send({ message: "No game in progress" });
  }

  if (!req.body || !req.body.color) {
    return res.status(400).send({ message: "Please select a valid color" });
  }
  const { color } = req.body;
  const isValidColor = COLORS.find(({ id }) => color === id) != null;
  if (!isValidColor) {
    return res.status(400).send({ message: "Please select a valid color" });
  }

  const newGameState = GameService.nextMove(color);

  return res.status(200).send(newGameState);
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).send();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Oops an error occurred!");
});
