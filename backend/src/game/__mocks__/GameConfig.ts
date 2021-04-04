import { TEST_COLORS } from "../../testUtil";
import { IColor } from "../GameConfig";

const DIMENSION = 10;

/* jest.doMock("./GameConfig", () => ({
  GameConfig: {
    getColors(): Array<IColor> {
      return TEST_COLORS.map((val) => ({ ...val }));
    },
    getDimension() {
      return DIMENSION;
    },
  },
})); */

export const GameConfig = {
  getColors(): Array<IColor> {
    return TEST_COLORS.map((val) => ({ ...val }));
  },
  getDimension() {
    return DIMENSION;
  },
};
