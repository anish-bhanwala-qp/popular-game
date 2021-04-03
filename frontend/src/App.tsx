import React, { useEffect, useState } from "react";
import "./App.css";
import { ColorPicker } from "./ColorPicker";
import { GridLayout } from "./GridLayout";
import { Color, ColorId, Grid, ServerResponse } from "./models";

const httpHeaders = {
  "Content-type": "application/json",
  Accept: "application/json",
};

function App() {
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [grid, setGrid] = useState<Grid>([]);
  const [colors, setColors] = useState<Array<Color>>([]);
  const [dimension, setDimension] = useState<number>(1);

  const colorPickedHandler = (colorId: ColorId) => {
    setLoading(true);

    fetch("/api/game/make-move", {
      method: "PUT",
      headers: httpHeaders,
      body: JSON.stringify({ colorId }),
    })
      .then((res) => res.json())
      .then((data: { grid: Grid }) => {
        setGrid([...data.grid]);

        setLoading(false);
      });
  };

  useEffect(() => {
    fetch("/api/game/init", {
      headers: httpHeaders,
    })
      .then((res) => {
        // Display error message
        if (res.status !== 200) {
          setServerError(
            "Oops an error occurred connecting to server. Please refresh."
          );
        } else {
          res.json().then((res) => {
            const data = res as ServerResponse;
            setGrid([...data.grid]);
            setColors([...data.colors]);
            setDimension(data.dimension);
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  let content = null;
  if (serverError) {
    content = <span>{serverError}</span>;
  } else {
    content = (
      <div>
        <GridLayout grid={grid} dimension={dimension} colors={colors} />
        <ColorPicker
          originColorId={grid[0]}
          colors={colors}
          onColorPicked={colorPickedHandler}
        />
      </div>
    );
  }

  return (
    <div className="App">
      {loading && <div className="loading-overlay">Loading...</div>}
      {content}
    </div>
  );
}

export default App;
