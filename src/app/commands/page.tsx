import { Button } from '@/components/ui/button'
import { Pause, Play } from 'lucide-react'
import { pauseAll, unpauseAll } from '@/app/actions/globalCommands'

export default function Commands() {
  return (
    <div className="flex w-full grow flex-col items-center justify-center text-2xl">
      <div className="flex w-96 max-w-[80%] flex-row items-center justify-between gap-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <span>Pause All</span>
          <form action={pauseAll}>
            <Button
              variant="outline"
              size="icon"
              className="h-24 w-24"
              type="submit"
            >
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
              className="h-24 w-24"
              type="submit"
            >
              <Play className="!size-12" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
