'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type PlayersDropdownProps = {
  playerIds: string[]
  currentSelection: string
  onSelect: (playerId: string) => void
}

export function PlayersDropdown({
  playerIds,
  currentSelection,
  onSelect,
}: PlayersDropdownProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentSelection
            ? playerIds.find((id) => id === currentSelection)
            : 'Select player ID...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search player id..." />
          <CommandList>
            <CommandEmpty>No id found.</CommandEmpty>
            <CommandGroup>
              {playerIds.map((playerId) => (
                <CommandItem
                  key={playerId}
                  value={playerId}
                  onSelect={(currentValue) => {
                    onSelect(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      currentSelection === playerId
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {playerId}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
