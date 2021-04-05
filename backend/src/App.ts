import express, { NextFunction, Request, Response } from "express";
import { GameService } from "./game/GameService";
import { ValidationError } from "./ValidationError";

export const app = express();
const gameService = new GameService();

app.use(express.json());

app.get("/api/game/start", (req, res, next) => {
  const game = gameService.start();
  res.status(200).send(game);
});

app.put("/api/game/:id/next-move", (req, res, next) => {
  const { id } = req.params;
  const { color } = req.body;
  const newGameState = gameService.nextMove(+id, color);
  return res.status(200).send(newGameState);
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).send();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    return res.status(400).send({ message: err.message });
  }

  console.error(err.stack);
  res.status(500).send("Oops an error occurred!");
});
