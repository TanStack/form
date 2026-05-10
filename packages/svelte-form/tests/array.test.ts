import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import TestForm from './array.svelte'
import SwapForm from './array-swap.svelte'

const user = userEvent.setup()

describe('Svelte Field array mode', () => {
  it('should support array mode', async () => {
    const { container } = render(TestForm)
    expect(container.querySelector('#val')!.textContent).toBe('["a"]')
    await user.click(container.querySelector<HTMLButtonElement>('#push')!)
    expect(container.querySelector('#val')!.textContent).toBe('["a","b"]')
  })
})

describe('Svelte Field array mode swapFieldValues', () => {
  it('should rerender on swapFieldValues even when length is unchanged', async () => {
    const { container } = render(SwapForm)
    expect(container.querySelector('#val')!.textContent).toBe('["a","b"]')
    await user.click(container.querySelector<HTMLButtonElement>('#swap')!)
    expect(container.querySelector('#val')!.textContent).toBe('["b","a"]')
  })
})
