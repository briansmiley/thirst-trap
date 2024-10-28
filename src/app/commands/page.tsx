'use server'
import { Button } from '@/components/ui/button'
import { Pause, Play } from 'lucide-react'
import { Input } from '@/components/ui/input'
import * as commands from './commands'

export default async function Commands() {
  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-5 text-2xl">
      <div className="flex w-96 max-w-[80%] flex-row items-center justify-between gap-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <span>Pause All</span>
          <form action={commands.pauseAll}>
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
          <form action={commands.unpauseAll}>
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
      <div className="flex w-96 max-w-[80%] flex-row items-center justify-between gap-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <span>Give Time</span>
          <form className="flex gap-1" action={commands.addTimeToAll}>
            <Input
              className="w-24"
              type="number"
              step="1"
              name="minutes"
              placeholder="5"
            />
            <Button
              variant="default"
              style={{ background: 'green' }}
              type="submit"
            >
              Add
            </Button>
          </form>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <span>Deduct Time</span>
          <form className="flex gap-1" action={commands.takeTimeFromAll}>
            <Input
              className="w-24"
              type="number"
              step="1"
              name="minutes"
              placeholder="5"
            />
            <Button variant="destructive" type="submit">
              Deduct
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
