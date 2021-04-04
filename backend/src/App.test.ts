import request, { Response } from "supertest";
import { app } from "./App";
import { Color, colors } from "./game/Game";
import { GameService } from "./GameService";

describe("App routes", () => {
  beforeEach(() => {
    GameService.cleanup();
  });

  it("should return 404 status response for invalid route", (done) => {
    request(app).get("/invalid-route").expect(404, done);
  });

  describe("Starting new game", () => {
    const sendGameStartRequest = () =>
      request(app).get("/api/game/start").send();

    let res: Response;
    beforeEach(async () => {
      res = await sendGameStartRequest();
    });

    it("should return 200 status", async () => {
      expect(res.status).toBe(200);
    });

    it("should return grid with 100 tiles", async () => {
      const body = res.body;
      expect(body.grid).toHaveLength(100);
    });

    it("should return dimension of 10", async () => {
      const body = res.body;
      expect(body.dimension).toBe(10);
    });

    it("should return gameOver as false", async () => {
      const body = res.body;
      expect(body.isGameOver).toBe(false);
    });
  });

  describe("Calling next move with invalid colors", () => {
    const sendNextMoveRequest = (color: Color) =>
      request(app).put("/api/game/next-move").send({ color });

    it("should return 400 response with message 'No game in progress' when there is no game is in progress", async () => {
      const res = await sendNextMoveRequest(undefined as any);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("No game in progress");
    });

    it("should return 400 response with message 'Please select a valid color' when NO color is sent", async () => {
      // Make sure we start the game
      GameService.start();

      const res = await sendNextMoveRequest(undefined as any);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Please select a valid color");
    });

    it("should return 400 response with message 'Please select a valid color' when INVALID color is sent", async () => {
      // Make sure we start the game
      GameService.start();

      const res = await sendNextMoveRequest("invalid-color" as any);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Please select a valid color");
    });
  });

  describe("Calling next move with valid request", () => {
    const sendNextMoveRequest = (color = Color.BLUE) =>
      request(app).put("/api/game/next-move").send({ color });

    it("should return 200 response with when a valid color is sent", async () => {
      // Make sure we start the game
      GameService.start();

      const res = await sendNextMoveRequest();
      expect(res.status).toBe(200);
    });

    it("should return grid with new state for valid move", async () => {
      // Make sure we start the game
      GameService.start();

      const res = await sendNextMoveRequest();
      const body = res.body;
      expect(body.grid).toHaveLength(100);
    });
  });
});
