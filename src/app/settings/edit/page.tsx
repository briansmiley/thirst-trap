import SettingsForm from '@/app/settings/edit/SettingsForm'
import settingService from '@/server/services/setting'

async function getSettings() {
  'use server'
  return await settingService.get()
}

export default async function SettingsEdit() {
  const settings = await getSettings()

  return (
    <div className="flex w-full grow flex-col items-center justify-center">
      <div className="my_box min-w-80 flex w-[40%] flex-col items-center justify-start gap-4 px-10 py-5">
        <h1 className="satisfy text-4xl font-bold">Settings</h1>
        <SettingsForm {...settings} />
      </div>
    </div>
  )
}
