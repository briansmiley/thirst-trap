'use client'
import { Button } from '@/components/ui/button'
import { Pause, Play } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { socket } from '@/socket/client'
import { useState } from 'react'

export default function Commands() {
  const [additionTime, setAdditionTime] = useState(5)
  const [deductionTime, setDeductionTime] = useState(5)

  const addTimeToAll = () => {
    console.log('ADDITION TIME:', additionTime)
    socket.emit('grantTimeToAll', additionTime, (res) => {
      console.log('ACK grantTimeToAll:', res)
    })
  }

  const takeTimeFromAll = () => {
    socket.emit('takeTimeFromAll', deductionTime, (res) => {
      console.log('ACK takeTimeFromAll:', res)
    })
  }

  const pauseAll = () => {
    socket.emit('pauseAll', (res) => {
      console.log('ACK pauseAllPlayers:', res)
    })
  }

  const resumeAll = () => {
    socket.emit('resumeAll', (res) => {
      console.log('ACK resumeAllPlayers:', res)
    })
  }

  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-5 text-2xl">
      <div className="flex w-96 max-w-[80%] flex-row items-center justify-between gap-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <span>Pause All</span>
          <Button
            variant="outline"
            size="icon"
            className="h-24 w-24"
            onClick={pauseAll}
          >
            <Pause className="!size-12" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <span>Unpause All</span>
          <Button
            variant="outline"
            size="icon"
            className="h-24 w-24"
            onClick={resumeAll}
          >
            <Play className="!size-12" />
          </Button>
        </div>
      </div>
      <div className="flex w-96 max-w-[80%] flex-row items-center justify-between gap-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <span>Grant Time</span>
          <div className="flex gap-1">
            <Input
              className="w-24"
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
          <form className="flex gap-1" action={takeTimeFromAll}>
            <Input
              className="w-24"
              type="number"
              step="1"
              name="minutes"
              value={deductionTime}
              onChange={(e) => setDeductionTime(Number(e.target.value))}
            />
            <Button variant="destructive" onClick={takeTimeFromAll}>
              Deduct
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
