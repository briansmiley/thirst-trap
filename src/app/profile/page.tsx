'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const id = formData.get('id')
    router.push(`/profile/${id}`)
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="my_box flex flex-col items-center justify-center gap-4 p-12">
        <h1 className="text-4xl font-bold">Player Profiles</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-4"
        >
          <input
            type="text"
            className="rounded border-2 border-neutral-700 px-1"
            name="id"
            placeholder="Player Badge ID"
          />
          <Button type="submit">Go to Profile</Button>
        </form>
      </div>
    </div>
  )
}
