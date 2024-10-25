import SettingsForm from './SettingsForm'
import settingService from '@/server/services/setting'

const settings = await settingService.get()

export default function SettingsEdit() {
  return (
    <div className="flex w-full grow flex-col items-center justify-center">
      <div className="my_box flex w-[40%] flex-col items-center justify-start gap-4 px-10 py-5">
        <h1 className="satisfy text-4xl font-bold">Settings</h1>
        <SettingsForm {...settings} />
      </div>
    </div>
  )
}
