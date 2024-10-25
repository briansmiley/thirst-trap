import SettingsForm from './SettingsForm'
import settingService from '@/server/services/setting'

const settings = await settingService.get()

export default function SettingsEdit() {
  return (
    <div className="flex w-full grow flex-col items-center justify-center">
      <div className="my_box flex flex-col items-center justify-start gap-4 p-5">
        <h1 className="satisfy text-2xl font-bold">Settings</h1>
        <SettingsForm {...settings} />
      </div>
    </div>
  )
}
