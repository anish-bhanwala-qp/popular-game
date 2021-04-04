import { ColorId } from "./models";
import styles from "./ColorPicker.module.css";
import { resolveColor } from "./util";
import { useContext } from "react";
import { ColorsContext } from "./App";

export function ColorPicker(props: {
  originColorId: ColorId;
  onColorPicked: (color: ColorId) => void;
}) {
  const { originColorId, onColorPicked } = props;
  const colors = useContext(ColorsContext);

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
