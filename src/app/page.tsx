import SplashEntry from "@/components/SplashEntry";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image
        src="/ThirstTrapCover.png"
        alt="Thirst Trap"
        width={920}
        height={768}
        className="absolute m-auto -z-10 opacity-70"
      />
      <div className="flex flex-col items-center justify-center gap-10 h-full w-[70%] bg-slate-950 bg-opacity-70 p-12">
        <h1 className="satisfy text-8xl text-white text-center">Thirst Trap</h1>
        <SplashEntry />
        <p className="bg-slate-500 bg-opacity-50 rounded p-2 font-mono">
          This page is for party facilitators only; please enjoy the game IRL!
        </p>
      </div>
    </div>
  );
}
