import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";
import { server } from "./mocks/server";
import { rest } from "msw";
import userEvent from "@testing-library/user-event";

it("should load app properly on first load", async () => {
  render(<App />);

  // loading text should appear on first load
  const loadingText = await screen.findByText("Loading", { exact: false });
  expect(loadingText).toBeInTheDocument();

  await waitForElementToBeRemoved(loadingText);

  // on successful server response grid should be displayed
  const tiles = await screen.findAllByTestId("tile");
  expect(tiles).toHaveLength(16);

  // all three colors should be displayed
  screen.getByRole("button", { name: "green" });
  screen.getByRole("button", { name: "blue" });
  const redBtn = screen.getByRole("button", { name: "red" });

  // The red button should be disabled as this is the origin color
  expect(redBtn).toBeDisabled();
});

it("On server error error message is displayed", async () => {
  server.resetHandlers(
    rest.get("/api/game/init", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(<App />);
  // wait for error message
  await screen.findByText(
    "Oops an error occurred connecting to server. Please refresh."
  );
});

it("should update the board with new colors when a color is picked", async () => {
  render(<App />);

  // wait for green color picker to be loaded
  const greenBtn = await screen.findByRole("button", { name: "green" });
  userEvent.click(greenBtn);

  // wait for loading text to dissapear
  const loadingText = await screen.findByText("Loading", { exact: false });
  await waitForElementToBeRemoved(loadingText);

  const tiles = await screen.findAllByTestId("tile");
  const greenTiles = tiles.filter(
    (tile) => tile.style.backgroundColor === "green"
  );

  // The new layout should have 8 green color tiles
  expect(greenTiles).toHaveLength(8);
});

it("should display congrats message with move history when game is over", async () => {
  render(<App />);

  // wait for green color picker to be loaded
  const greenBtn = await screen.findByRole("button", { name: "green" });

  server.resetHandlers(
    rest.put("/api/game/next-move", (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          grid: [],
          gameOver: true,
          moveHistory: ["g", "r", "b"],
          aiMoveHistory: ["b", "g"],
        })
      );
    })
  );

  userEvent.click(greenBtn);

  await screen.findByRole("heading", {
    name: "Congratulations you won!",
  });

  // The move count for both real and ai player should be displayed
  screen.getByRole("heading", { name: "You took 3 moves." });
  screen.getByRole("heading", { name: "AI took 2 moves." });
});
