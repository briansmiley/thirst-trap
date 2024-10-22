import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center gap-10  bg-slate-950 bg-opacity-70 rounded-2xl p-12">
        <h1 className="satisfy text-8xl text-white">Thirst Trap</h1>
        <Button className="font-serif w-48 h-24 text-4xl">Enter</Button>
        <Image
          src="/ThirstTrapCover.png"
          alt="Thirst Trap"
          width={920}
          height={768}
          className="absolute inset-0 m-auto -z-10 opacity-50"
        />
      </div>
    </div>
  );
}
