import { useMemo, useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { fieldComponent } from '../contexts'
import type { DateRange } from 'react-day-picker'
import type { FieldWithValue } from '@tanstack/react-form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'

const formatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function formatDate(range: DateRange) {
  if (!range.from) return 'No date range selected'
  if (!range.to) return formatter.format(range.from)
  return formatter.formatRange(range.from, range.to)
}

interface TanStackFormDateRangePickerProps {
  field: FieldWithValue<DateRange>
}

function FormDateRangePicker(props: TanStackFormDateRangePickerProps) {
  const { field } = props
  const [today] = useState(() => new Date())

  const label = useMemo(() => formatDate(field.value), [field.value])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="justify-start h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <Calendar
          mode="range"
          required
          defaultMonth={field.value.from}
          selected={field.value}
          onSelect={(selected) => field.handleChange(selected)}
          numberOfMonths={2}
          disabled={(date) => date < today}
        />
      </PopoverContent>
    </Popover>
  )
}

export const TanStackFormDateRangePicker = fieldComponent.strict(
  FormDateRangePicker,
  'field',
)
