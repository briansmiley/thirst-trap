import settingService from '@/server/services/setting'
import SettingsView from '@/app/settings/SettingsView'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

async function getSettings() {
  'use server'
  return await settingService.get()
}

export default async function Settings() {
  const settings = await getSettings()

  return (
    <div className="flex w-full grow flex-col items-center justify-center px-10">
      <div className="my_box flex min-w-full flex-col items-center justify-start gap-4 md:min-w-[50%] lg:max-w-[40%]">
        <h1 className="satisfy text-2xl font-bold">Settings</h1>
        <SettingsView {...settings} />
        <Button asChild>
          <Link href="/settings/edit">Edit</Link>
        </Button>
      </div>
    </div>
  )
}
