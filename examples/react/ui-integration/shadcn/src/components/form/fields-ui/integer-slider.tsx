import { useMemo } from 'react'
import { fieldComponent } from '../contexts'
import type { FieldWithValue } from '@tanstack/react-form'
import type { ComponentProps } from 'react'
import { Slider } from '@/components/ui/slider'

interface IntegerSliderProps extends ComponentProps<typeof Slider> {
  field: FieldWithValue<number>
}

function IntegerSlider(props: IntegerSliderProps) {
  const { field } = props

  const value = useMemo(() => [field.value], [field.value])

  return (
    <Slider
      value={value}
      onValueChange={([newValue]) => field.handleChange(newValue)}
      {...props}
    />
  )
}

export default fieldComponent.strict(IntegerSlider, 'field')
