import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { pauseAll, unpauseAll } from "@/app/actions/globalCommands";

export default function Commands() {
  return (
    <div className="flex flex-col items-center w-full grow justify-center text-2xl">
      <div className="flex w-96 flex-row items-center justify-between gap-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <span>Pause All</span>
          <form action={pauseAll}>
            <Button variant="outline" className="w-24 h-20" type="submit">
              <Pause className="!size-12" />
            </Button>
          </form>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <span>Unpause All</span>
          <form action={unpauseAll}>
            <Button
              variant="outline"
              size="icon"
              className="flex p-0 w-24 h-20"
              type="submit"
            >
              <Play className="!size-12" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
