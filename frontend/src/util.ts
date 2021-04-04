import { Color, ColorId } from "./models";

export function resolveColor(colorId: ColorId, colors: Array<Color>) {
  return colors.find((c) => c.id === colorId)?.color;
}
