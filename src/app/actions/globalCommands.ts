'use server'

export async function pauseAll() {
  console.log('Pausing all from server action')
}

export async function unpauseAll() {
  console.log('Unpausing all from server action')
}

export async function addTimeToAll(minutes: number) {
  console.log('Adding time to all from server action', minutes)
}

export async function takeTimeFromAll(minutes: number) {
  console.log('Taking time from all from server action', minutes)
}
