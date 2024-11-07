'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAppStore } from '@/lib/stores/AppStoreProvider'
import ViewSettings from './ViewSettings'
import { useState } from 'react'
import EditSettings from './EditSettings'

export default function Settings() {
  const { settings } = useAppStore((state) => ({ settings: state.settings }))
  const [edit, setEdit] = useState(false)
  return (
    <div className="my_box flex w-[450px] min-w-[200px] max-w-[90%] flex-col items-center justify-start gap-2 sm:max-w-[450px]">
      <h1 className="satisfy text-4xl font-bold">Settings</h1>
      <div className="flex w-full grow flex-col items-center justify-center px-10">
        {edit ? (
          <EditSettings settings={settings} closeEdit={() => setEdit(false)} />
        ) : (
          <ViewSettings settings={settings} />
        )}
      </div>
      {!edit && <Button onClick={() => setEdit(true)}>Edit</Button>}
    </div>
  )
}
