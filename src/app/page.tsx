import SplashEntry from '@/components/SplashEntry'

export default function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <img
        src="/images/ThirstTrapCover.png"
        alt="Thirst Trap"
        width={920}
        height={768}
        className="absolute -z-10 m-auto opacity-70"
      />
      <div className="flex h-full w-[70%] flex-col items-center justify-center gap-10 bg-slate-950 bg-opacity-70 p-12">
        <h1 className="satisfy text-center text-8xl text-white">Thirst Trap</h1>
        <SplashEntry />
        <p className="rounded bg-slate-500 bg-opacity-50 p-2 font-mono">
          This page is for party facilitators only; please enjoy the game IRL!
        </p>
      </div>
    </div>
  )
}
