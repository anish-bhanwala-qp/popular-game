import { AiPlayer } from "./AiPlayer";
import { TEST_COLOR_Ids } from "../testUtil";

jest.mock("./GameConfig");

const { R, G, B } = TEST_COLOR_Ids;

/* const COLORS = [
  { id: R, color: "red" },
  { id: G, color: "green" },
  { id: B, color: "blue" },
];

const DIMENSION = 10;

jest.doMock("./GameConfig", () => ({
  GameConfig: {
    getColors(): Array<IColor> {
      return COLORS.map((val) => ({ ...val }));
    },
    getDimension() {
      return DIMENSION;
    },
  },
})); */

describe("Automated move", () => {
  it("should pick the second color when there are only two colors in the grid", () => {
    // prettier-ignore
    const input = [
        R, R, G, G,
        R, R, G, G,
        G, R, G, G,
        R, G, R, G
    ];

    const nextColor = AiPlayer.calculateNextMove(input, 4);

    expect(nextColor).toEqual(G);
  });
  it("should pick the color which has most tiles connected to the origin", () => {
    // In this case blue should be picked as there are 4 blue colors connected to origin,
    // and only 3 Green color tiles.
    // prettier-ignore
    const input = [
        R, B, G, G,
        R, B, B, G,
        G, B, G, G,
        G, G, B, G
    ];

    const nextColor = AiPlayer.calculateNextMove(input, 4);

    expect(nextColor).toEqual(B);
  });
});
