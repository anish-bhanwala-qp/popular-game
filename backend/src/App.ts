import express, { NextFunction, Request, Response } from "express";
import { GameService } from "./GameService";

export const app = express();

app.get("/api/game/init", (req, res, next) => {
  const game = GameService.init();
  res.status(200).send(game);
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).send();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Oops an error occurred!");
});
