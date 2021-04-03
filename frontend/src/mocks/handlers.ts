import { rest } from "msw";

export const handlers = [
  rest.get("/api/game/init", (req, res, ctx) => {
    return res(
      ctx.status(200),

      ctx.json({
        // prettier-ignore
        grid: [
              'r', 'g', 'b', 'r', 
              'r', 'g', 'b', 'r', 
              'r', 'g', 'b', 'r', 
              'r', 'g', 'b', 'r'
            ],
        colors: [
          { id: "r", color: "red" },
          { id: "g", color: "green" },
          { id: "b", color: "blue" },
        ],
      })
    );
  }),
];
