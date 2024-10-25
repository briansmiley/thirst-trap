'use server'

import { cookies } from 'next/headers'

const appPassword = process.env.APP_PASSWORD
const authCookieToken = process.env.AUTH_COOKIE_TOKEN
export async function checkPassword(password: string) {
  if (!authCookieToken) {
    throw new Error('AUTH_COOKIE_TOKEN is not set')
  }
  if (password === appPassword) {
    // Set a cookie to remember that the user is authenticated
    const cookieStore = cookies()
    cookieStore.set('authenticated', authCookieToken, {
      httpOnly: true,
      secure: false,
    })
    return true
  }
  return false
}
export async function isAuthenticated() {
  const cookieStore = cookies()
  if (!authCookieToken) {
    throw new Error('AUTH_COOKIE_TOKEN is not set')
  }
  return cookieStore.get('authenticated')?.value === authCookieToken
}
export async function logout() {
  const cookieStore = cookies()
  cookieStore.delete('authenticated')
}
