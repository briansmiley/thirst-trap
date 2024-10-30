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
import { SkullIcon } from 'lucide-react'

type MarshmallowDialogProps = {
  executeFn: () => void
  classNames?: string
}
export default function MarshmallowDialog({
  executeFn,
  classNames,
}: MarshmallowDialogProps) {
  return (
    <div className={classNames}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="flex items-center p-2">
            <SkullIcon className="!size-5" />
            <span className="satisfy text-xs">MP</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-[80%]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              <span className="flex w-full items-center justify-center gap-2 text-red-400">
                <SkullIcon className="!size-5 text-white" /> Execute Marshmallow
                Protocol? <SkullIcon className="!size-5 text-white" />
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span className="flex w-full items-center justify-center">
                This will immediately mark the player for reaping.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="flex w-full items-center justify-center gap-2">
              <AlertDialogCancel variant="default">Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault()
                  executeFn()
                }}
              >
                Execute
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
