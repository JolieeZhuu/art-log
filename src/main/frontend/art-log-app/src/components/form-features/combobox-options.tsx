import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "../../lib/utils"

// UI components
import { Button } from "../../components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"
 
export function ComboboxOptions({
  options,
  selectPhrase,
  commandEmpty,
  value,
  onChange,
  onKeyDown,
  autoFocus
}: {
  options: { value: string; label: string }[]
  selectPhrase: string
  commandEmpty: string
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void,
  autoFocus?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const selectedLabel = options.find((opt) => opt.value === value)?.label
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  // Handle autofocus
  React.useEffect(() => {
    if (autoFocus && triggerRef.current) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        triggerRef.current?.click() // Open the popover
      }, 50)
    }
  }, [autoFocus])

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (open && onKeyDown) {
        onKeyDown(e as any);
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onKeyDown]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedLabel ?? selectPhrase}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>{commandEmpty}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                        onChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
