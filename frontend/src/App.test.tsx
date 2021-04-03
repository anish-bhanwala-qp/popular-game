import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";
import { server } from "./mocks/server";
import { rest } from "msw";

it("should load app properly on first load", async () => {
  render(<App />);

  // loading text should appear on first load
  const loadingText = await screen.findByText("Loading", { exact: false });
  expect(loadingText).toBeInTheDocument();

  await waitForElementToBeRemoved(loadingText);

  // on successful server response grid should be displayed
  const tiles = await screen.findAllByTestId("tile");
  expect(tiles.length).toBe(16);
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
