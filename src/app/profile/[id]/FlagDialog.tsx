'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ShieldAlertIcon } from 'lucide-react'
import { useState } from 'react'

type FlagDialogProps = {
  addNote: (note: string) => void
  existingFlags: string[]
  classNames?: string
}
export default function FlagDialog({
  addNote,
  existingFlags,
  classNames,
}: FlagDialogProps) {
  const [note, setNote] = useState('')

  return (
    <div className={classNames}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <ShieldAlertIcon
              className={`!size-5 ${existingFlags.length > 0 ? 'text-red-400' : ''}`}
            />
            {existingFlags.length > 0 && (
              <span className="-m-1 text-xs text-red-400">
                {existingFlags.length}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[80%]">
          <DialogHeader>
            <DialogTitle>Add flag</DialogTitle>
            <DialogDescription>
              Describe the reason for flagging this user
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Reason for flagging"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={() => addNote(note)}>Save</Button>
            </DialogClose>
          </DialogFooter>
          {existingFlags.length > 0 && (
            <div className="rounded-md border border-red-200 p-1 text-sm text-red-400">
              <h3 className="font-semibold">Priors</h3>
              <ul>
                {existingFlags.map((flag, index) => (
                  <li key={index}>• {flag}</li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
