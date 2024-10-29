'use client'
import Commands from './Commands'
import Settings from './Settings'

export default function Admin() {
  return (
    <div className="flex flex-col items-center justify-around gap-4 overflow-y-auto py-4">
      <Commands />
      <Settings />
    </div>
  )
}
