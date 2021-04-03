import { Color, ColorId } from "./models";

export function ColorPicker(props: {
  originColorId: ColorId;
  colors: Array<Color>;
}) {
  const { colors, originColorId } = props;
  return (
    <div>
      {colors.map((value) => (
        <button
          key={value.id}
          disabled={originColorId === value.id}
          aria-label={value.color}
        >
          {value.color}
        </button>
      ))}
    </div>
  );
}
