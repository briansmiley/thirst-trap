'use client'

import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { ArrowRightIcon, Lock } from 'lucide-react'
import { checkPassword, isAuthenticated } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

export default function SplashEntry() {
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [enteredPassword, setEnteredPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleEnterClick = async () => {
    const authenticated = await isAuthenticated()
    if (authenticated) {
      router.push('/dashboard')
    } else {
      setShowPasswordInput(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted')
    const result = await checkPassword(enteredPassword)
    if (result) {
      router.push('/dashboard') // Redirect to main app page
    } else {
      setError('Incorrect password')
    }
  }
  return (
    <div className="flex h-24 flex-col items-center justify-center">
      {showPasswordInput ? (
        <div>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative">
              <Lock className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                type="password"
                className="h-12 w-48 text-2xl"
                placeholder="Password"
                onChange={(e) => {
                  setError('')
                  setEnteredPassword(e.target.value)
                }}
                autoFocus
              />
            </div>
            <Button variant="outline" type="submit" className="h-12">
              <ArrowRightIcon />
            </Button>
          </form>
          {error && (
            <p className="text-md rounded-b bg-black bg-opacity-50 pt-1 text-center font-serif text-red-500">
              {error}
            </p>
          )}
        </div>
      ) : (
        <Button
          className="h-24 w-48 font-serif text-4xl"
          onClick={handleEnterClick}
        >
          Enter
        </Button>
      )}
    </div>
  )
}
