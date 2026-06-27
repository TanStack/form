import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import TestForm from './array.svelte'
import SwapForm from './array-swap.svelte'

const user = userEvent.setup()

describe('Svelte Field array mode', () => {
  it('should support array mode', async () => {
    const { getByTestId, getByRole } = render(TestForm)
    expect(getByTestId('val')).toHaveTextContent('["a"]')
    await user.click(getByRole('button', { name: 'push' }))
    expect(getByTestId('val')).toHaveTextContent('["a","b"]')
  })
})

describe('Svelte Field array mode swapFieldValues', () => {
  it('should rerender on swapFieldValues even when length is unchanged', async () => {
    const { getByTestId, getByRole } = render(SwapForm)
    expect(getByTestId('val')).toHaveTextContent('["a","b"]')
    await user.click(getByRole('button', { name: 'swap' }))
    expect(getByTestId('val')).toHaveTextContent('["b","a"]')
  })
})
