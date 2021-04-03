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
