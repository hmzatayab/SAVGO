import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const socket = io(import.meta.env.VITE_BASE_URL);

const GamePage = () => {
  const { user } = useContext(UserDataContext);
  const [game, setGame] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [playerId, setPlayerId] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    setPlayerId(user._id);

    socket.on("playerJoined", (data) => {
      console.log("New player joined:", data);
      setGame(data.game); // Update game state when a player joins
    });

    socket.on("moveMade", (moveData) => {
      console.log("Move received:", moveData);
      setGame(moveData.game); // Update game state when a move is made
    });

    return () => {
      socket.off("connect");
      socket.off("playerJoined");
      socket.off("moveMade");
    };
  }, []);

  const createGame = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/game/create`,
        {
          creatorId: playerId,
        }
      );
      setGame(response.data);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const joinGame = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/game/join`,
        {
          gameId: game._id,
          playerId,
        }
      );
      console.log("Joined game:", response.data);
      socket.emit("joinGame", { gameId: game._id, playerId });
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  const handleCardClick = async (cardId) => {
    if (game.currentTurn !== playerId) {
      alert("Wait for your turn!");
      return;
    }

    if (selectedCards.includes(cardId)) return;

    const newSelection = [...selectedCards, cardId];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/game/move`,
          {
            gameId: game._id,
            playerId,
            card1Id: newSelection[0],
            card2Id: newSelection[1],
          }
        );

        setGame(response.data.game);
        socket.emit("makeMove", { gameId: game._id, moveData: response.data });

        setSelectedCards([]); // Reset selected cards immediately
      } catch (error) {
        console.error("Error making move:", error);
      }
    }
  };

  const restartGame = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/game/${game._id}`);
      setGame(null);
      setSelectedCards([]);
      createGame();
    } catch (error) {
      console.error("Error restarting game:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Memory Game</h1>

      {game && (
        <h2
          className={`text-2xl font-semibold mb-4 ${
            game.currentTurn === playerId ? "text-green-500" : "text-red-500"
          }`}
        >
          {game.currentTurn === playerId ? "Your Turn!" : "Opponent's Turn"}
        </h2>
      )}

      {game?.winner && (
        <div className="text-3xl text-blue-700 font-bold my-4">
          🎉 Game Over! Winner: {game.winner} 🎉
        </div>
      )}

      {game?.winner && (
        <button
          onClick={restartGame}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-300"
        >
          Restart Game
        </button>
      )}

      {!game && (
        <button
          onClick={createGame}
          className="bg-green-500 text-white py-2 px-6 rounded-lg shadow hover:bg-green-600 transition duration-300"
        >
          Create Game
        </button>
      )}

      {game && game.players.length < 2 && (
        <button
          onClick={joinGame}
          className="bg-purple-500 text-white py-2 px-6 rounded-lg shadow hover:bg-purple-600 transition duration-300 mt-4"
        >
          Join Game
        </button>
      )}

      {game && (
        <div className="grid grid-cols-5 gap-4 mt-6">
          {game.cards.map((card) => (
            <div
              key={card.id}
              className={`w-24 h-24 bg-white rounded-lg shadow-md cursor-pointer transform transition-transform duration-500 ${
                card.matched || selectedCards.includes(card.id)
                  ? "rotate-y-180 bg-green-300"
                  : "bg-gray-300"
              } flex items-center justify-center text-2xl font-bold`}
              onClick={() => handleCardClick(card.id)}
            >
              {card.matched || selectedCards.includes(card.id) ? (
                <img
                  src={card.image}
                  alt="card"
                  className="w-full h-full object-cover"
                />
              ) : (
                "?"
              )}
            </div>
          ))}
        </div>
      )}

      {game && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Scores:</h3>
          {Object.entries(game.scores).map(([player, score]) => (
            <p key={player} className="text-lg">
              {player}: <span className="font-bold">{score}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamePage;
