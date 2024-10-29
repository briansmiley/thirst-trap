import { useAppStore } from '@/lib/stores/AppStoreProvider'
import { Settings } from '../types'

type ViewSettingsProps = {
  settings: Settings
}
export default function ViewSettings({ settings }: ViewSettingsProps) {
  return (
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
  )
}
