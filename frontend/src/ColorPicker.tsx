import { Color } from "./models";

export function ColorPicker(props: { colors: Array<Color> }) {
  const { colors } = props;
  return (
    <div>
      {colors.map((value) => (
        <button key={value.id} aria-label={value.color}>
          {value.color}
        </button>
      ))}
    </div>
  );
}
