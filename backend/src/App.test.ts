import request, { Response } from "supertest";
import { app } from "./App";

describe("App routes", () => {
  it("should return 404 status response for invalid route", (done) => {
    request(app).get("/invalid-route").expect(404, done);
  });

  describe("Starting new game", () => {
    const sendGameInitRequest = () => request(app).get("/api/game/init").send();

    let res: Response;
    beforeEach(async () => {
      res = await sendGameInitRequest();
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
});
