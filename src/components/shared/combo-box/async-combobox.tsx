"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface AsyncComboboxProps<T> {
  value: T | null;
  onSelect: (item: T | null) => void;
  fetchDataFn: (params: { search: string; pageNo: number; pageSize: number }) => Promise<{
    content: T[];
    last: boolean;
    pageNo: number;
  }>;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  labelKey: keyof T;
  valueKey: keyof T;
  disabled?: boolean;
  className?: string;
}

export function AsyncCombobox<T>({
  value,
  onSelect,
  fetchDataFn,
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
  emptyMessage = "No item found.",
  labelKey,
  valueKey,
  disabled = false,
  className,
}: AsyncComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [loading, setLoading] = useState(false);

  // Intersection Observer for infinite scroll
  const { ref, inView } = useInView({ threshold: 0.5 });

  const fetchData = async (search = "", newPage = 1) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await fetchDataFn({
        search,
        pageNo: newPage,
        pageSize: 10,
      });

      if (newPage === 1) {
        setData(result.content || []);
      } else {
        setData((prev) => [...prev, ...(result.content || [])]);
      }
      setPage(result.pageNo);
      setLastPage(result.last);
    } catch (error) {
      console.error("Error fetching data in AsyncCombobox:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when opened
  useEffect(() => {
    if (open && data.length === 0) {
      fetchData("", 1);
    }
  }, [open]);

  // Handle search with debounce
  useEffect(() => {
    if (!open) return;
    const delaySearch = setTimeout(() => {
      fetchData(searchTerm, 1);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  // Load more when scrolling
  useEffect(() => {
    if (inView && !lastPage && !loading && open) {
      fetchData(searchTerm, page + 1);
    }
  }, [inView, lastPage, loading, open, searchTerm, page]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full h-10 justify-between font-normal",
            !value && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          <span className="truncate">
            {value ? (value[labelKey] as unknown as string) : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList className="max-h-60 overflow-y-auto">
            {data.length === 0 && !loading && (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            )}
            <CommandGroup>
              {data.map((item, index) => (
                <CommandItem
                  key={item[valueKey] as unknown as string}
                  value={item[labelKey] as unknown as string}
                  onSelect={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value && value[valueKey] === item[valueKey]
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {item[labelKey] as unknown as string}
                </CommandItem>
              ))}
              {/* Observer element */}
              {!lastPage && data.length > 0 && (
                <div ref={ref} className="h-4 w-full" />
              )}
            </CommandGroup>

            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
