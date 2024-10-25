type SettingsViewProps = {
  maxDeathTimer: number
  killTimeCredit: number
  recruitTimeCredit: number
  startingTimer: number
}

export default function SettingsView({
  maxDeathTimer,
  killTimeCredit,
  recruitTimeCredit,
  startingTimer,
}: SettingsViewProps) {
  return (
    <div className="flex w-full flex-col items-center justify-start gap-4">
      <div className="flex min-h-12 w-full items-center justify-between">
        <span>Starting Timer</span>
        <div className="w-16 text-end">{startingTimer}</div>
      </div>
      <div className="flex min-h-12 w-full items-center justify-between">
        <span>Death Timer Cap</span>
        <div className="w-16 text-end">{maxDeathTimer}</div>
      </div>
      <div className="flex min-h-12 w-full items-center justify-between">
        <span>Kill Time Credit</span>
        <div className="w-16 text-end">{killTimeCredit}</div>
      </div>
      <div className="flex min-h-12 w-full items-center justify-between">
        <span>Recruit Time Credit</span>
        <div className="w-16 text-end">{recruitTimeCredit}</div>
      </div>
    </div>
  )
}
