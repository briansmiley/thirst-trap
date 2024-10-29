'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { socket } from '@/socket/client'
import { type Settings } from '@/app/types'

type SettingsFormProps = {
  settings: Settings
  closeEdit: () => void
}

export default function SettingsForm({
  settings,
  closeEdit,
}: SettingsFormProps) {
  const [maxDeathTimer, setMaxDeathTimer] = useState(settings.maxDeathTimer)
  const [killTimeCredit, setKillTimeCredit] = useState(settings.killTimeCredit)
  const [recruitTimeCredit, setRecruitTimeCredit] = useState(
    settings.recruitTimeCredit
  )
  const [startingTimer, setStartingTimer] = useState(settings.startingTimer)

  const router = useRouter()

  //TODO add handler functions
  const handleSubmit = () => {
    const settings = {
      maxDeathTimer,
      killTimeCredit,
      recruitTimeCredit,
      startingTimer,
    }
    console.log('EMIT updateSettings:', settings)
    socket.emit('updateSettings', settings, (res) => {
      console.log('ACK updateSettings:', res)
      closeEdit()
    })
  }

  return (
    <div className="flex w-full flex-col items-center justify-start gap-4">
      <div className="flex min-h-12 w-64 items-center justify-between">
        <label htmlFor="maxDeathTimer">Starting Timer</label>
        <Input
          id="startingTimer"
          className="h-8 w-16"
          type="number"
          value={startingTimer}
          onChange={(e) => setStartingTimer(parseInt(e.target.value))}
        />
      </div>
      <div className="flex min-h-12 w-64 items-center justify-between">
        <label htmlFor="maxDeathTimer">Death Timer Cap</label>
        <Input
          id="maxDeathTimer"
          className="h-8 w-16"
          type="number"
          value={maxDeathTimer}
          onChange={(e) => setMaxDeathTimer(parseInt(e.target.value))}
        />
      </div>
      <div className="flex min-h-12 w-64 items-center justify-between">
        <label htmlFor="killTimeCredit">Kill Time Credit</label>
        <Input
          id="killTimeCredit"
          className="h-8 w-16"
          type="number"
          value={killTimeCredit}
          onChange={(e) => setKillTimeCredit(parseInt(e.target.value))}
        />
      </div>
      <div className="flex min-h-12 w-64 items-center justify-between">
        <label htmlFor="recruitTimeCredit">Recruit Time Credit</label>
        <Input
          id="recruitTimeCredit"
          className="h-8 w-16"
          type="number"
          value={recruitTimeCredit}
          onChange={(e) => setRecruitTimeCredit(parseInt(e.target.value))}
        />
      </div>
      <div className="flex gap-4">
        <Button className="w-24" onClick={handleSubmit}>
          Save
        </Button>
        <Button className="w-24" variant="destructive" onClick={closeEdit}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
