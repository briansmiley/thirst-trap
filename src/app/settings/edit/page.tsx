'use client'

import SettingsForm from '@/app/settings/edit/SettingsForm'
import { useAppStore } from '@/lib/stores/AppStoreProvider'

export default function SettingsEdit() {
  const { settings } = useAppStore(({ settings }) => ({ settings }))

  return (
    <div className="flex w-full grow flex-col items-center justify-center">
      <div className="my_box flex min-w-[70%] flex-col items-center justify-start gap-4 md:min-w-[50%] lg:max-w-[40%]">
        <h1 className="satisfy text-4xl font-bold">Settings</h1>
        <SettingsForm {...settings} />
      </div>
    </div>
  )
}
