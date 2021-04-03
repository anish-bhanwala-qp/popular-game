import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";

it("should load app properly on first load", async () => {
  render(<App />);

  const loadingText = await screen.findByText("Loading", { exact: false });
  expect(loadingText).toBeInTheDocument();

  await waitForElementToBeRemoved(loadingText);

  const tiles = await screen.findAllByTestId("tile");
  expect(tiles.length).toBe(16);
});

// it('should delete app')
