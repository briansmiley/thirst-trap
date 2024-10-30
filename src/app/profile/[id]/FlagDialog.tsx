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
  classNames?: string
}
export default function FlagDialog({ addNote, classNames }: FlagDialogProps) {
  const [note, setNote] = useState('')

  return (
    <div className={classNames}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <ShieldAlertIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
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
        </DialogContent>
      </Dialog>
    </div>
  )
}
