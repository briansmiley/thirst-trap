'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useState } from 'react'

type SettingsFormProps = {
  maxDeathTimer: number
  killTimeCredit: number
  recruitTimeCredit: number
}

export default function SettingsForm({
  maxDeathTimer,
  killTimeCredit,
  recruitTimeCredit,
}: SettingsFormProps) {
  const [maxDeathTimerState, setMaxDeathTimer] = useState(maxDeathTimer)
  const [killTimeCreditState, setKillTimeCredit] = useState(killTimeCredit)
  const [recruitTimeCreditState, setRecruitTimeCredit] =
    useState(recruitTimeCredit)

  //TODO add handler functions
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-start gap-4"
    >
      <div className="flex min-h-12 w-64 items-center justify-between">
        <label htmlFor="maxDeathTimer">Death Timer Cap</label>
        <Input
          id="maxDeathTimer"
          className="h-8 w-16"
          type="number"
          value={maxDeathTimerState}
          onChange={(e) => setMaxDeathTimer(parseInt(e.target.value))}
        />
      </div>
      <div className="flex min-h-12 w-64 items-center justify-between">
        <label htmlFor="killTimeCredit">Kill Time Credit</label>
        <Input
          id="killTimeCredit"
          className="h-8 w-16"
          type="number"
          value={killTimeCreditState}
          onChange={(e) => setKillTimeCredit(parseInt(e.target.value))}
        />
      </div>
      <div className="flex min-h-12 w-64 items-center justify-between">
        <label htmlFor="recruitTimeCredit">Recruit Time Credit</label>
        <Input
          id="recruitTimeCredit"
          className="h-8 w-16"
          type="number"
          value={recruitTimeCreditState}
          onChange={(e) => setRecruitTimeCredit(parseInt(e.target.value))}
        />
      </div>
      <div className="flex gap-4">
        <Button className="w-24" type="submit">
          Save
        </Button>
        <Button className="w-24" variant="destructive" asChild>
          <Link href="/settings">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
