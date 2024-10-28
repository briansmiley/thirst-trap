'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAppStore } from '@/lib/stores/AppStoreProvider'

export default function Settings() {
  const { settings } = useAppStore((state) => ({ settings: state.settings }))

  return (
    <div className="flex w-full grow flex-col items-center justify-center px-10">
      <div className="my_box flex min-w-[70%] flex-col items-center justify-start gap-4 md:min-w-[50%] lg:max-w-[40%]">
        <h1 className="satisfy text-4xl font-bold">Settings</h1>
        <div className="flex flex-col items-center justify-start gap-4">
          <div className="flex min-h-12 w-64 items-center justify-between">
            <span>Starting Timer</span>
            <div className="w-16 text-end">{settings.startingTimer}</div>
          </div>
          <div className="flex min-h-12 w-64 items-center justify-between">
            <span>Death Timer Cap</span>
            <div className="w-16 text-end">{settings.maxDeathTimer}</div>
          </div>
          <div className="flex min-h-12 w-64 items-center justify-between">
            <span>Kill Time Credit</span>
            <div className="w-16 text-end">{settings.killTimeCredit}</div>
          </div>
          <div className="flex min-h-12 w-64 items-center justify-between">
            <span>Recruit Time Credit</span>
            <div className="w-16 text-end">{settings.recruitTimeCredit}</div>
          </div>
        </div>
        <Button asChild>
          <Link href="/settings/edit">Edit</Link>
        </Button>
      </div>
    </div>
  )
}
