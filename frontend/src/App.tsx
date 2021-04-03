import React, { useEffect, useState } from "react";
import "./App.css";
import { ColorPicker } from "./ColorPicker";
import { GridLayout } from "./GridLayout";
import { Color, Grid, ServerResponse } from "./models";

function App() {
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [grid, setGrid] = useState<Grid>([]);
  const [colors, setColors] = useState<Array<Color>>([]);
  const [dimension, setDimension] = useState<number>(1);

  useEffect(() => {
    fetch("/api/game/init", {
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
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
  if (loading) {
    content = <span>"Loading..."</span>;
  } else if (serverError) {
    content = <span>{serverError}</span>;
  } else {
    content = (
      <div>
        <GridLayout grid={grid} dimension={dimension} />
        <ColorPicker originColorId={grid[0]} colors={colors} />
      </div>
    );
  }

  return <div className="App">{content}</div>;
}

export default App;
