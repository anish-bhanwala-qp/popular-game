import React, { useEffect, useState } from "react";
import "./App.css";

type Color = "r" | "g" | "b";

type Grid = Array<Color>;

interface ServerResponse {
  grid: Grid;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [grid, setGrid] = useState<Grid>([]);

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
        {grid.map((c, index) => (
          <span key={index} data-testid="tile">
            {c}
          </span>
        ))}
      </div>
    );
  }

  return <div className="App">{content}</div>;
}

export default App;
