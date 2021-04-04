import { Color, ColorId } from "./models";
import styles from "./ColorPicker.module.css";
import { resolveColor } from "./util";

export function ColorPicker(props: {
  originColorId: ColorId;
  colors: Array<Color>;
  onColorPicked: (color: ColorId) => void;
}) {
  const { colors, originColorId, onColorPicked } = props;
  return (
    <div className={styles.container}>
      {colors.map((value) => (
        <button
          className={styles.btn}
          key={value.id}
          disabled={originColorId === value.id}
          aria-label={value.color}
          onClick={() => onColorPicked(value.id)}
          style={{
            backgroundColor: resolveColor(value.id, colors),
          }}
        ></button>
      ))}
    </div>
  );
}
