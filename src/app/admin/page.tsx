'use client'
import Commands from './Commands'
import Settings from './Settings'

export default function Admin() {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <Commands />
      <Settings />
    </div>
  )
}
