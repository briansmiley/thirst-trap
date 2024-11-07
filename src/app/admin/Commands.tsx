'use client'
import { Button } from '@/components/ui/button'
import { Pause, Play } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { socket } from '@/socket/client'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function Commands() {
  const [additionTime, setAdditionTime] = useState(5)
  const [deductionTime, setDeductionTime] = useState(5)
  const { toast } = useToast()
  const addTimeToAll = () => {
    console.log('ADDITION TIME:', additionTime)
    socket.emit('grantTimeToAll', additionTime, (res) => {
      console.log('ACK grantTimeToAll:', res)
      toast({
        title: res.success ? 'Success' : 'Error',
        description: res.success
          ? `Players given ${additionTime} minutes`
          : res.message,
        variant: res.success ? 'default' : 'destructive',
      })
    })
  }

  const takeTimeFromAll = () => {
    socket.emit('takeTimeFromAll', deductionTime, (res) => {
      console.log('ACK takeTimeFromAll:', res)
      toast({
        title: res.success ? 'Success' : 'Error',
        description: res.success
          ? `Players deducted ${deductionTime} minutes`
          : res.message,
        variant: res.success ? 'default' : 'destructive',
      })
    })
  }

  const pauseAll = () => {
    socket.emit('pauseAll', (res) => {
      console.log('ACK pauseAllPlayers:', res)
      toast({
        title: res.success ? 'Success' : 'Error',
        description: res.success ? 'All players paused' : res.message,
        variant: res.success ? 'default' : 'destructive',
      })
    })
  }

  const resumeAll = () => {
    socket.emit('resumeAll', (res) => {
      console.log('ACK resumeAllPlayers:', res)
      toast({
        title: res.success ? 'Success' : 'Error',
        description: res.success ? 'All players resumed' : res.message,
        variant: res.success ? 'default' : 'destructive',
      })
    })
  }

  return (
    <div className="my_box flex w-[450px] min-w-[200px] max-w-[90%] grow flex-col items-center justify-center gap-3 text-base sm:gap-5 sm:text-2xl">
      <h1 className="satisfy text-2xl font-bold sm:text-4xl">Commands</h1>

      <div className="flex w-full flex-row items-center justify-around gap-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <span>Pause All</span>
          <Button
            variant="outline"
            size="icon"
            className="size-16 sm:size-24"
            onClick={pauseAll}
          >
            <Pause className="!size-8 sm:!size-12" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <span>Unpause All</span>
          <Button
            variant="outline"
            size="icon"
            className="size-16 sm:size-24"
            onClick={resumeAll}
          >
            <Play className="!size-8 sm:!size-12" />
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-row items-center justify-around gap-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <span>Grant Time</span>
          <div className="flex gap-1">
            <Input
              className="w-12 sm:w-20"
              type="number"
              step="1"
              value={additionTime}
              onChange={(e) => setAdditionTime(Number(e.target.value))}
            />
            <Button
              variant="default"
              style={{ background: 'green' }}
              onClick={addTimeToAll}
            >
              Add
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <span>Deduct Time</span>
          <div className="flex gap-1">
            <Input
              className="w-12 sm:w-20"
              type="number"
              step="1"
              name="minutes"
              value={deductionTime}
              onChange={(e) => setDeductionTime(Number(e.target.value))}
            />
            <Button variant="destructive" onClick={takeTimeFromAll}>
              Deduct
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
