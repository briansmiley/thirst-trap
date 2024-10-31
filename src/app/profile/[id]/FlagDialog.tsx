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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { socket, useSocketSubscription } from '@/socket/client'
import { ShieldAlertIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

type FlagDialogProps = {
  addNote: (note: string) => void
  existingFlags: string[]
  playerId: string
  classNames?: string
}
export default function FlagDialog({
  addNote,
  existingFlags,
  playerId,
  classNames,
}: FlagDialogProps) {
  const [note, setNote] = useState('')
  const [flags, setFlags] = useState(existingFlags)
  const { toast } = useToast()
  const removeFlag = (flag: string) => {
    socket.emit(
      'updateFlags',
      playerId,
      flags.filter((f) => f !== flag),
      (response) => {
        console.log('ON updateFlags:', response)
        toast({
          title: `Flag removed`,
          description: `The flag "${flag}" has been removed`,
        })
      }
    )
  }
  useSocketSubscription('updatePlayer', (player) => {
    if (player.playerId === playerId) {
      setFlags(player.flags || [])
    }
  })
  const handleSave = () => {
    if (note.length === 0) {
      toast({
        title: 'Flag empty',
        description: 'Nothing saved',
        variant: 'destructive',
      })
      return
    }
    addNote(note)
    setNote('')
  }
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
              <Button
                type="button"
                variant="secondary"
                onClick={() => setNote('')}
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleSave}>Save</Button>
            </DialogClose>
          </DialogFooter>
          {existingFlags.length > 0 && (
            <div className="rounded-md border border-red-200 p-1 text-sm text-red-400">
              <h3 className="font-semibold">Priors</h3>
              <ul>
                {flags.map((flag, index) => (
                  <li className="flex items-center" key={index}>
                    <Button
                      type="button"
                      variant="ghost"
                      className="!size-6"
                      onClick={() => removeFlag(flag)}
                    >
                      <XIcon className="!size-4" />
                    </Button>
                    <span>• {flag} </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
