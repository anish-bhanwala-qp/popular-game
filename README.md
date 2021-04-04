# popular-game
Popular Game - The goal of the game is to change all the tiles to the same color, preferably with the fewest number of moves possible.

# Instructions to play the game.
1. First start the backend (instructions below).
2. Next start the frontend (instructions below).


# Backend
The backend server runs on port 5000.
There are two end points:
1. /api/game/start [GET]
2. /api/game/next-move [PUT]

To **run test cases** run `npm test`.

To **start the backend server** install dependencies and run `npm start`.
1. Go to dir `~/popular-game/backend`.
2. Run `npm install`.
3. Run `npm start`.

# Frontend
The frontend runs on port 3000. 
The frontend connects to backend through `create-react-app` proxy on port `5000`([more-info](https://create-react-app.dev/docs/proxying-api-requests-in-development/)).

To **run test cases** run `npm test`.

To **start the client react-app** install dependencies and run `npm start`.
1. Go to dir `~/popular-game/frontend`.
2. Run `npm install`.
3. Run `npm start`.
