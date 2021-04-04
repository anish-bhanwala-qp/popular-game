import React, { useEffect, useState } from "react";
import "./App.css";
import { ColorPicker } from "./ColorPicker";
import { GameOver } from "./GameOver";
import { GridLayout } from "./GridLayout";
import {
  Color,
  ColorId,
  Grid,
  InitServerResponse,
  NextMoveServerResponse,
} from "./models";
import { MoveHistoryOverview } from "./MoveHistoryOverview";
import { apiCall } from "./util";

export const ColorsContext = React.createContext<Array<Color>>([]);

function App() {
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [grid, setGrid] = useState<Grid>([]);
  const [colors, setColors] = useState<Array<Color>>([]);
  const [dimension, setDimension] = useState<number>(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [moveHistory, setMoveHistory] = useState<Array<ColorId>>([]);
  const [aiMoveHistory, setAiMoveHistory] = useState<Array<ColorId>>([]);

  const colorPickedHandler = (colorId: ColorId) => {
    setLoading(true);

    apiCall("/api/game/next-move", "PUT", { color: colorId })
      .then((data: NextMoveServerResponse) => {
        setGrid([...data.grid]);
        setIsGameOver(data.isGameOver);
        if (data.moveHistory && data.aiMoveHistory) {
          setMoveHistory([...data.moveHistory]);
          setAiMoveHistory([...data.aiMoveHistory]);
        }

        setLoading(false);
      })
      .catch((_) =>
        setServerError("Oops an error occurred on server. Please refresh")
      );
  };

  useEffect(() => {
    apiCall("/api/game/start")
      .then((res) => {
        const data = res as InitServerResponse;
        setGrid([...data.grid]);
        setColors([...data.colors]);
        setDimension(data.dimension);
      })
      .catch(() =>
        setServerError("Oops an error occurred on server. Please refresh.")
      )
      .finally(() => {
        setLoading(false);
      });
  }, []);

  let content = null;
  if (serverError) {
    content = <span>{serverError}</span>;
  } else if (isGameOver) {
    content = (
      <GameOver moveHistory={moveHistory} aiMoveHistory={aiMoveHistory} />
    );
  } else {
    content = (
      <div>
        <GridLayout grid={grid} dimension={dimension} />

        <ColorPicker
          originColorId={grid[0]}
          onColorPicked={colorPickedHandler}
        />

        <MoveHistoryOverview
          moveHistory={moveHistory}
          aiMoveHistory={aiMoveHistory}
          isGameOver={false}
        />
      </div>
    );
  }

  return (
    <div className="App">
      {loading && <div className="loading-overlay">Loading...</div>}
      <ColorsContext.Provider value={colors}>{content}</ColorsContext.Provider>
    </div>
  );
}

export default App;
