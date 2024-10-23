import settingService from "@/server/services/setting";
import SettingsView from "./SettingsView";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const settings = await settingService.get();

export default function Settings() {
  return (
    <div className="flex flex-col items-center justify-center w-[100dvw] h-[100dvh]">
      <div className="flex flex-col items-center justify-start bg-slate-950 p-5 rounded gap-4">
        <h1 className="text-2xl font-bold satisfy">Settings</h1>
        <SettingsView {...settings} />
        <Button asChild>
          <Link href="/settings/edit">Edit</Link>
        </Button>
      </div>
    </div>
  );
}
