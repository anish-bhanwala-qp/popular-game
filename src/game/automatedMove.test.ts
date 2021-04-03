import { automatedMove } from "./automatedMove";
import { Color } from "./Game";

const { RED: R, GREEN: G, BLUE: B } = Color;

describe("Automated move", () => {
  it("should pick the second color when there are only two colors in the grid", () => {
    // prettier-ignore
    const input = [
        R, R, G, G,
        R, R, G, G,
        G, R, G, G,
        R, G, R, G
    ];

    const nextColor = automatedMove(input, 4);

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

    const nextColor = automatedMove(input, 4);

    expect(nextColor).toEqual(B);
  });
});
