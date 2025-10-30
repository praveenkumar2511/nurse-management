import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "./utlis"; // adjust utils path
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";

const INITIAL_ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

interface CustomizePageSizeProps {
  take: number;
  setTake: (value: number) => void;
  setSkip: (value: number) => void;
  table?: {
    setPageSize: (size: number) => void;
  };
}

export function CustomizePageSize({
  take,
  setTake,
  setSkip,
  table,
}: CustomizePageSizeProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(take.toString());
  const [itemsPerPageOptions, setItemsPerPageOptions] = useState(INITIAL_ITEMS_PER_PAGE_OPTIONS);
  const [inputValue, setInputValue] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const applyValue = (currentValue: string) => {
    const numValue = Number(currentValue);
    if (!isNaN(numValue) && numValue > 0) {
      setValue(currentValue);
      setTake(numValue);
      setSkip(1);
      table?.setPageSize(numValue);

      if (!itemsPerPageOptions.includes(numValue)) {
        setItemsPerPageOptions((prev) => [...prev, numValue].sort((a, b) => a - b));
      }

      setOpen(false);
      setInputValue("");
    }
  };

  const handleInputChange = (input: string) => {
    setInputValue(input);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (input && !isNaN(Number(input)) && Number(input) > 0) {
        applyValue(input);
      }
    }, 500);
  };

  const handleSelectOption = (selectedValue: string) => {
    applyValue(selectedValue);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[70px] justify-between h-[30px] text-black"
        >
          {value}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[100px] p-0">
        <Command>
          <CommandInput
            placeholder="Enter #"
            value={inputValue}
            onValueChange={handleInputChange}
            // type="number"
            min={1}
          />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {itemsPerPageOptions.map((option) => (
              <CommandItem key={option} value={option.toString()} onSelect={handleSelectOption}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.toString() ? "opacity-100" : "opacity-0"
                  )}
                />
                {option}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
