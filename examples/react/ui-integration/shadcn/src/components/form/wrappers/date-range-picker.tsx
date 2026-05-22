import { useMemo, useState } from 'react'
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
        <Button variant="outline">{label}</Button>
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
