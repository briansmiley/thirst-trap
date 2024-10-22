"use server";

import { cookies } from "next/headers";

export async function checkPassword(password: string) {
  const correctPassword = process.env.APP_PASSWORD;

  if (password === correctPassword) {
    // Set a cookie to remember that the user is authenticated
    const cookieStore = await cookies();
    cookieStore.set("authenticated", "true", { httpOnly: true, secure: true });
    return true;
  }
  return false;
}
