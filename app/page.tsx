"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Spotlight } from "./components/ui/Spotlight";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { TextRevealCard , TextRevealCardTitle , TextRevealCardDescription } from "./components/ui/text-reveal-card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";


let Instance: Socket<DefaultEventsMap, DefaultEventsMap>;

export default function Home() {
  
  const router = useRouter();

  useEffect(() => {
    Instance = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'https://typerush-server.onrender.com' as string, {
      transports: ["websocket"],
    });

    Instance.on("invalid", () => toast.error("Invalid room code"));
    Instance.on("verified" ,(code : string) => router.push(`/game/${code}`))

    return () => {
      Instance.disconnect();
    };
  }, [router]);

  function joinGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget;
    const formData = new FormData(form);

    const inviteCode = formData.get("inviteCode") as string;
    console.log(inviteCode)

    if (!inviteCode) {
      toast.error("Invite code is required");
      return;
    }

    Instance.emit("join-game", inviteCode , "user");
  }

  function createGame() {
    const inviteCode = uuidv4();
    router.push(`/game/${inviteCode}`);
  }

  return (

    <main className="w-full mx-auto max-w-7xl">

      <section className="pt-[5rem] h-[32rem] xl:h-[40rem] lg:h-[40rem] w-full rounded-md flex flex-col  md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight
          className="top-100 left-0 md:left-60 md:-top-20"
          fill="white" />
        <div className=" p-4 max-w-7xl mx-auto relative z-10 w-full pt-20  md:pt-0">
          <nav className="flex flex-col items-center gap-0 leading-none mb-10">
            <div className="border max-w-[15rem] justify-center px-5 rounded-full mb-3 items-center aos-init aos-animate" data-aos="fade-down"><div className="relative inline-flex before:absolute before:inset-0 "><a className=" py-1 text-xs xl:text-sm lg:text-sm  font-medium inline-flex items-center justify-center border border-transparent rounded-full  text-zinc-300 hover:text-white transition duration-150 ease-in-out w-full group [background:linear-gradient(theme(colors.primary.900),_theme(colors.primary.900))_padding-box,_conic-gradient(theme(colors.primary.400),_theme(colors.primary.700)_25%,_theme(colors.primary.700)_75%,_theme(colors.primary.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-zinc-800/30 before:rounded-full before:pointer-events-none" target="_blank" href="https://github.com/chronark/highstorm"><span className="relative inline-flex items-center">TypeRush is Open Source <span className="tracking-normal text-primary-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span></span></a></div></div>
            <h1 className="text-6xl xl:text-[8rem] lg:text-[8rem] md:text-[6rem] font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">TypeRush</h1>
            <p className="mt-8 mb-8 text-lg text-center xl:text-2xl lg:text-2xl text-zinc-300 aos-init aos-animate" data-aos="fade-down" data-aos-delay="200">Dont drown in notifications and keep your workspace focused</p>
            <div className="flex flex-row  items-center max-w-xs mx-auto gap-4 sm:max-w-none sm:justify-center sm:flex-row sm:inline-flex aos-init aos-animate" data-aos="fade-down" data-aos-delay="400">
              <a className="w-full justify-center flex items-center whitespace-nowrap transition duration-150 ease-in-out font-medium rounded-xl px-4 py-3  text-zinc-900 bg-gradient-to-r from-white/80 via-white to-white/80 hover:bg-white group" href="/overview">Get Started <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-3 h-3 tracking-normal text-primary-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
              <a className="w-full transition duration-150 ease-in-out bg-opacity-25 text-zinc-200 hover:text-white bg-zinc-900 hover:bg-opacity-30" target="_blank" href="">Star on GitHub</a>
            </div>
          </nav>
        </div>
      </section>

      <nav className="flex flex-col px-10 xl:flex-row lg:flex-row gap-10">
        <div className="cursor-pointer">
          <TextRevealCard
            className="mb-5"
            text="Start a thrilling race!"
            revealText=""
          >
            <TextRevealCardTitle>
              Create Game
            </TextRevealCardTitle>
            <TextRevealCardDescription className="mb-8">
              Create a game and invite your friends to join you and race you to
              a typing battle! You will receive an invite code once you create a
              game. You will be the host of the game.
            </TextRevealCardDescription>
          <Button className="w-full hover:text-gray-700" onClick={createGame}>Create Game</Button>
          </TextRevealCard>
        </div>

        <div className="cursor-pointer">
          <form onSubmit={joinGame}>
            <TextRevealCard
              className="mb-5"
              text="Join the excitement!"
              revealText=""
            ><TextRevealCardTitle>
            Join Game
          </TextRevealCardTitle>
          <TextRevealCardDescription>
            Enter your invite code and join your friends to battle them in a
            typing race. Let the best person win!
          </TextRevealCardDescription>
              <Input
                type="text"
                className="bg-[#1d1c20] border border-gray-600 mt-4 "
                placeholder="Invite code"
                name="inviteCode"
              />
              <Button type="submit" className="mt-3 w-full">
                Join Game
              </Button>
            </TextRevealCard>
          </form>
        </div>
      </nav>


    <nav className="pt-8 px-10 mb-6 mt-10 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
    <div className="flex space-x-6 md:order-2">
      <a
        target="_blank"
        className="text-gray-500 hover:text-gray-400"
        href="https://twitter.com/chronark_"
      >
        <span className="sr-only">Twitter</span>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 5.484c-.81.36-1.68.602-2.592.71a4.526 4.526 0 0 0 1.984-2.496c-1.002.602-2.112 1.04-3.3 1.278A4.513 4.513 0 0 0 12 5.5c-2.488 0-4.5 2.014-4.5 4.5 0 .36.036.708.108 1.044-3.748-.188-7.068-1.98-9.292-4.72a4.54 4.54 0 0 0-.612 2.278c0 1.568.804 2.952 2.028 3.756a4.49 4.49 0 0 0-2.044-.564c-.58 0-1.116.064-1.592.17 0 .012 0 .024 0 .036 0 2.196 1.56 4.03 3.624 4.45a4.417 4.417 0 0 1-2.128.072c.604 1.856 2.36 3.2 4.432 3.236-1.616 1.264-3.648 2.024-5.856 2.024-.36 0-.716-.022-1.072-.064 2.084 1.336 4.548 2.12 7.2 2.12 8.64 0 13.361-7.16 13.361-13.36 0-.204 0-.408-.012-.612a9.548 9.548 0 0 0 2.348-2.428"></path>
        </svg>
      </a>
      <a
        target="_blank"
        className="text-gray-500 hover:text-gray-400"
        href="https://github.com/chronark/highstorm"
      >
        <span className="sr-only">Github</span>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          {/* Actual GitHub SVG path */}
          <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
        </svg>
      </a>
    </div>
    <p className="mt-8 text-xs text-gray-400 leading-5 md:order-1 md:mt-0">
      © 2024 All rights reserved.
    </p>
  </nav>  
  </main>
  
  );
}





      {/* <div className="flex flex-grow gap-8">
    <BackgroundGradient className=" w-full rounded-[22px] max-w-3xl sm:p-10 bg-white dark:bg-zinc-900">
    <div className="p-5 flex flex-col justify-between">
    <div>
          <h2 className="font-medium text-2xl">Create Game</h2>
          <p className="text-gray-400 mt-5 mb-3">
            Create a game and invite your friends to join you and race you to
            a typing battle! You will receive an invite code once you create a
            game. You will be the host of the game.
          </p>
        </div>

        <div>
          <Button className="mt-5 w-full mb-4" onClick={createGame}>
            Create Game
          </Button>
        </div>
      </div>
    </BackgroundGradient>
    <BackgroundGradient className=" rounded-[22px] max-w-3xl sm:p-10 bg-white dark:bg-zinc-900">
    <div className="p-5 flex flex-col justify-between">
        <div>
          <h2 className="font-medium text-2xl">Join Game</h2>
          <p className="text-gray-400 mt-5">
            Enter your invite code and join your friends to battle them in a
            typing race. Let the best person win!
          </p>
        </div>

        <div className="mt-5">
          <form onSubmit={joinGame}>
            <Input type="text" placeholder="Invite code" name="inviteCode" />
            <Button className="mt-3 w-full">Join Game</Button>
          </form>
        </div>
      </div>
    </BackgroundGradient>
    </div> */}