import request, { Response } from "supertest";
import { app } from "./App";
import { GameService } from "./game/GameService";
import { ColorId } from "./game/GameConfig";
import { findNonOriginColorId } from "./testUtil";

jest.mock("./game/GameConfig");

const sendGameStartRequest = () => request(app).get("/api/game/start").send();

const sendNextMoveRequest = (gameId: number, color: ColorId = "b") =>
  request(app).put(`/api/game/${gameId}/next-move`).send({ color });

describe("App routes", () => {
  it("should return 404 status response for invalid route", (done) => {
    request(app).get("/invalid-route").expect(404, done);
  });

  describe("Starting new game", () => {
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

    it("should return game id", async () => {
      const body = res.body;
      expect(body.id).toBeDefined();
    });

    it("should return dimension of 10", async () => {
      const body = res.body;
      expect(body.dimension).toBe(10);
    });

    it("should return gameOver as false", async () => {
      const body = res.body;
      expect(body.isGameOver).toBe(false);
    });

    it("should return colors array", async () => {
      const body = res.body;
      expect(body.colors).toHaveLength(3);
    });
  });

  describe("Calling next move with invalid request", () => {
    let gameId: number;

    beforeEach(async () => {
      const res = await sendGameStartRequest();
      gameId = res.body.id;
    });

    it("should return 400 response with message 'No game found for given game id' when game id is invalid", async () => {
      const invalidGameId = -1;
      const res = await sendNextMoveRequest(invalidGameId, "b");
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("No game found for given game id");
    });

    it("should return 400 response with message 'Please select a valid color' when NO color is sent", async () => {
      const res = await sendNextMoveRequest(gameId, null as any);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Please select a valid color");
    });

    it("should return 400 response with message 'Please select a valid color' when INVALID color is sent", async () => {
      const res = await sendNextMoveRequest(gameId, "invalid-color" as any);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Please select a valid color");
    });
  });

  describe("Calling next move with valid request", () => {
    let gameId: number;
    let nonOriginColorId: ColorId;

    beforeEach(async () => {
      const res = await sendGameStartRequest();
      gameId = res.body.id;
      nonOriginColorId = findNonOriginColorId(res.body.grid);
    });

    it("should return 200 response with when a valid color is sent", async () => {
      const res = await sendNextMoveRequest(gameId, nonOriginColorId);
      expect(res.status).toBe(200);
    });

    it("should return grid with new state for valid move", async () => {
      const res = await sendNextMoveRequest(gameId, nonOriginColorId);
      const body = res.body;
      expect(body.grid).toHaveLength(100);
    });

    it("should make the ai player move along with real player move", async () => {
      const res = await sendNextMoveRequest(gameId, nonOriginColorId);
      const { moveHistory, aiMoveHistory } = res.body;

      expect(moveHistory).toHaveLength(1);
      expect(aiMoveHistory).toHaveLength(1);
    });
  });
});
