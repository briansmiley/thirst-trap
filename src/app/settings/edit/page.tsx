import SettingsForm from "./SettingsForm";
import settingService from "@/server/services/setting";

const settings = await settingService.get();

export default function SettingsEdit() {
  return (
    <div className="flex flex-col items-center justify-center w-full grow">
      <div className="flex flex-col items-center justify-start bg-slate-950 border-2 border-neutral-700 p-5 rounded gap-4">
        <h1 className="text-2xl font-bold satisfy">Settings</h1>
        <SettingsForm {...settings} />
      </div>
    </div>
  );
}
