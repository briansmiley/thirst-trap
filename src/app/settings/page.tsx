import settingService from '@/server/services/setting'
import SettingsView from './SettingsView'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const settings = await settingService.get()

export default function Settings() {
  return (
    <div className="flex w-full grow flex-col items-center justify-center">
      <div className="my_box flex w-[40%] flex-col items-center justify-start gap-4 px-10 py-5">
        <h1 className="satisfy text-4xl font-bold">Settings</h1>
        <SettingsView {...settings} />
        <Button asChild>
          <Link href="/settings/edit">Edit</Link>
        </Button>
      </div>
    </div>
  )
}
