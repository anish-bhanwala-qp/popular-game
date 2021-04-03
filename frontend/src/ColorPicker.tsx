import { Color, ColorId } from "./models";

export function ColorPicker(props: {
  originColorId: ColorId;
  colors: Array<Color>;
  onColorPicked: (color: ColorId) => void;
}) {
  const { colors, originColorId, onColorPicked } = props;
  return (
    <div>
      {colors.map((value) => (
        <button
          key={value.id}
          disabled={originColorId === value.id}
          aria-label={value.color}
          onClick={() => onColorPicked(value.id)}
        >
          {value.color}
        </button>
      ))}
    </div>
  );
}
