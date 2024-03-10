"use client";

import { Player } from "@/types/types";
import { Card } from "./ui/card";

export default function LeaderboardCard({
  player,
  rank,
}: {
  player: Player;
  rank: number;
}) {
  return (
    <Card className="w-full flex p-5 gap-5 dark:bg-black border border-2">
      <div className="xl:text-2xl xl:text-2xl text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"># {rank}</div>
      <div className="xl:text-2xl xl:text-2xl text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">{player.name}</div>
      <div className="ml-auto text-xl">{player.score}</div>
    </Card>
  );
}
