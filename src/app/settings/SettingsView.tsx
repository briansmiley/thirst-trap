type SettingsViewProps = {
  maxDeathTimer: number
  killTimeCredit: number
  recruitTimeCredit: number
}

export default function SettingsView({
  maxDeathTimer,
  killTimeCredit,
  recruitTimeCredit,
}: SettingsViewProps) {
  return (
    <div className="flex flex-col items-center justify-start gap-4">
      <div className="flex min-h-12 w-64 items-center justify-between">
        <span>Death Timer Cap</span>
        <div className="w-16 text-end">{maxDeathTimer}</div>
      </div>
      <div className="flex min-h-12 w-64 items-center justify-between">
        <span>Kill Time Credit</span>
        <div className="w-16 text-end">{killTimeCredit}</div>
      </div>
      <div className="flex min-h-12 w-64 items-center justify-between">
        <span>Recruit Time Credit</span>
        <div className="w-16 text-end">{recruitTimeCredit}</div>
      </div>
    </div>
  )
}
