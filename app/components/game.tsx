"use client";

import type { GameProps, GameStatus, Player, PlayerScore } from '../types/types'
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { toast } from "sonner";
import LeaderboardCard from "./leaderboard-card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { redirect } from "next/navigation";
import CopyToClipboard from "./copy";

export default function GamePlayer({ gameId, name }: GameProps) {
  const [ioInstance, setIoInstance] = useState<Socket>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("not-started");
  const [paragraph, setParagraph] = useState<string>("");
  const [host, setHost] = useState<string>("");
  const [inputParagraph, setInputParagraph] = useState<string>("");
  const [incorrectIndex, setIncorrectIndex] = useState(-1);

  useEffect(() => {
    try {
      const socket = io(
        process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'https://typerush-server.onrender.com',
        {
          transports: ["websocket"],
        }
      );
      setIoInstance(socket);
  
      socket.emit("join-game", gameId, name);
  
      return () => {
        removeListeners();
        socket.disconnect();
      };
    } catch (error) {
      console.error("Error creating socket:", error);
    }
  }, []);

  useEffect(() => {
    setupListeners();
    return () => removeListeners();
  }, [ioInstance]);

  useEffect(() => {
    if (!ioInstance || gameStatus !== "in-progress") return;

    ioInstance.emit("player-typed", inputParagraph);
  }, [inputParagraph]);


  function setupListeners() {
    if (!ioInstance) return;

    ioInstance.on("connect", () => {
      console.log("connected");
    });

    ioInstance.on("players", (players: Player[]) => {
      console.log("received players");
      setPlayers(players);
    });

    ioInstance.on("player-joined", (player: Player) => {
      setPlayers((prev) => [...prev, player]);
    });

    ioInstance.on("player-left", (id: string) => {
      setPlayers((prev) => prev.filter((player) => player.id !== id));
    });

    ioInstance.on("player-score", ({ id, score }: PlayerScore) => {
      setPlayers((prev) =>
        prev.map((player) => {
          if (player.id === id) {
            return {
              ...player,
              score,
            };
          }
          return player;
        }),
      );
    });

    ioInstance.on("game-started", (paragraph: string) => {
      setParagraph(paragraph);
      setGameStatus("in-progress");
    });

    ioInstance.on("game-finished", () => {
      setGameStatus("finished");
      setInputParagraph("");
    });

    ioInstance.on("new-host", (id: string) => {
      setHost(id);
    });

    ioInstance.on("error", (message: string) => {
      toast.error(message);
    });
  }

  function removeListeners() {
    if (!ioInstance) return;

    ioInstance.off("connect");
    ioInstance.off("players");
    ioInstance.off("player-joined");
    ioInstance.off("player-left");
    ioInstance.off("player-score");
    ioInstance.off("game-started");
    ioInstance.off("game-finished");
    ioInstance.off("new-host");
    ioInstance.off("error");
  }

  function startGame() {
    if (!ioInstance) return;

    ioInstance.emit("start-game");
  }

  window.onbeforeunload = () => {
    if (ioInstance) {
      ioInstance.emit("leave");
    }
  };

  

  return (
    <div className="w-screen xl:mx-[6rem] lg:mx-[6rem]  p-10 grid grid-cols-1 lg:grid-cols-3 gap-20 ">
      <div className="w-full order-last lg:order-first">

        <h1 className="xl:text-4xl xl:text-4xl text-2xl my-5 font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">Leaderboard</h1>

        <div className="flex flex-col gap-5 w-full">
          {players
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <LeaderboardCard
                key={player.id}
                player={player}
                rank={index + 1}
              />
            ))}
        </div>
      </div>

      <div className="lg:col-span-2 h-full pb-[16rem]">
        {gameStatus === "not-started" && (
          <div className="flex flex-col pb-0 xl:pb-[18rem]  lg:pb-[18rem] items-center justify-center ">
            <h1 className="text-2xl font-bold">
              Waiting for players to join...
            </h1>

            {host === ioInstance?.id && (
              <>
              <div className="flex flex-row gap-[6.5rem] items-center mt-8 justify-center">
              <Button className="px-20" onClick={startGame}>
                Start Game
              </Button>
              <CopyToClipboard gameID={gameId} />              
              </div>
              </>
            )}
          </div>
        )}

        {gameStatus === "in-progress" && (
          <div className="h-full">
            <h1 className="text-3xl my-5 font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
              Type the paragraph below
            </h1>

            <div className="relative h-full">
              <p className="text-2xl lg:text-5xl p-5">{paragraph}</p>

              <Textarea
                value={inputParagraph}
                onChange={(e) => setInputParagraph(e.target.value)}
                className="text-2xl lg:text-5xl outline-none p-5 absolute top-0 left-0 right-0 bottom-0 z-10 opacity-75"
                disabled={gameStatus !== "in-progress" || !ioInstance}
              />
            </div>
          </div>
        )}

        {gameStatus === "finished" && (
          <div className="flex flex-col items-center justify-center p-10">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
              Game finished!
              {ioInstance?.id === host && " Restart the game fresh!"}
            </h1>

            {host === ioInstance?.id && (
              <>
              <div className="flex flex-col xl:flex-row lg:flex-row xl:gap-[6.5rem] lg:gap-[6.5rem] gap-10 items-center mt-8 justify-center">
              <Button className="px-20" onClick={startGame}>
                Start Game
              </Button>
              <CopyToClipboard gameID={gameId} />              </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}