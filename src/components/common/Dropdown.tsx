import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { matchSorter } from "match-sorter"
import { Popover as PopoverPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

export interface DropdownOption {
    value: string
    label: string
}

interface DropdownProps {
    options: DropdownOption[]
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    searchPlaceholder?: string
    disabled?: boolean
    searchable?: boolean
    label?: string
}

export function Dropdown({
    options = [],
    value,
    onChange,
    placeholder = "Select option...",
    className,
    searchPlaceholder = "Search...",
    disabled = false,
    searchable = true,
    label,
}: DropdownProps) {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Filter options based on query using match-sorter for better fuzzy search
    const filteredOptions = React.useMemo(() => {
        if (!query) return options
        return matchSorter(options, query, { keys: ["label"] })
    }, [options, query])

    const selectedOption = options.find((option) => option.value === value)

    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue === value ? "" : selectedValue)
        setOpen(false)
        setQuery("")
    }

    // Focus input when opening
    React.useEffect(() => {
        if (open && searchable) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 0)
        }
    }, [open, searchable])

    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
                <PopoverPrimitive.Trigger asChild>
                    <button
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                            className
                        )}
                        disabled={disabled}
                    >
                        {selectedOption ? (
                            <span className="truncate">{selectedOption.label}</span>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>
                </PopoverPrimitive.Trigger>
                <PopoverPrimitive.Content className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover text-popover-foreground shadow-md rounded-md border z-[60]" align="start">
                    {searchable && (
                        <div className="flex items-center px-2 py-2 sticky top-0 bg-popover z-10">
                            {/* <Search className="mr-2 h-3.5 w-3.5 shrink-0 opacity-50" /> */}
                            <input
                                ref={inputRef}
                                className="flex h-8 w-full rounded-md bg-secondary/50 px-3 text-xs outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder={searchPlaceholder}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="max-h-[200px] overflow-y-auto overflow-x-hidden p-1">
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-sm">No option found.</div>
                        ) : (
                            <ul className="space-y-1">
                                {filteredOptions.map((option) => (
                                    <li
                                        key={option.value}
                                        className={cn(
                                            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                            value === option.value && "bg-accent/50"
                                        )}
                                        onClick={() => handleSelect(option.value)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Root>
        </div>
    )
}
