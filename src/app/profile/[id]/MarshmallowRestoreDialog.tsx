'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { RotateCcwIcon, SkullIcon } from 'lucide-react'

type MarshmallowRestoreDialogProps = {
  restoreFn: () => void
  classNames?: string
}
export default function MarshmallowRestoreDialog({
  restoreFn,
  classNames,
}: MarshmallowRestoreDialogProps) {
  return (
    <div className={classNames}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="flex items-center p-2">
            <RotateCcwIcon className="!size-5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <span className="flex w-full items-center justify-center">
                Restore Marshmallow?
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span className="flex w-full items-center justify-center">
                This undoes the Marshmallow Protocol.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="flex w-full items-center justify-center gap-2">
              <AlertDialogCancel variant="default">Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={restoreFn}>
                Restore
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
