type SettingsViewProps = {
  maxDeathTimer: number;
  killTimeCredit: number;
  recruitTimeCredit: number;
};

export default function SettingsView({
  maxDeathTimer,
  killTimeCredit,
  recruitTimeCredit
}: SettingsViewProps) {
  return (
    <div className="flex flex-col items-center justify-start gap-4">
      <div className="flex justify-between items-center w-64 min-h-12">
        <span>Death Timer Cap</span>
        <div className="w-16 text-end">{maxDeathTimer}</div>
      </div>
      <div className="flex justify-between items-center w-64 min-h-12">
        <span>Kill Time Credit</span>
        <div className="w-16 text-end">{killTimeCredit}</div>
      </div>
      <div className="flex justify-between items-center w-64 min-h-12">
        <span>Recruit Time Credit</span>
        <div className="w-16 text-end">{recruitTimeCredit}</div>
      </div>
    </div>
  );
}
