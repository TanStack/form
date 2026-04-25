import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { useForm } from '../src'

describe('Form fields', () => {
  it('should mount the field to the dom', () => {
    function Component() {
      const form = useForm({ defaultValues: { name: 'tony-hawk' } })
      return (
        <form.Field name="name">
          {(field) => <span data-testid="name">{field.value}</span>}
        </form.Field>
      )
    }

    const { getByTestId } = render(<Component />)
    const input = getByTestId('name')

    expect(input).toHaveTextContent('tony-hawk')
  })
})
