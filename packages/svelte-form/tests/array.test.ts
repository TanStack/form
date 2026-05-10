import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { mount, unmount } from 'svelte'
import TestForm from './array.svelte'
import SwapForm from './array-swap.svelte'

describe('Svelte Field array mode', () => {
  let element: HTMLDivElement
  let instance: any
  beforeEach(async () => {
    element = document.createElement('div')
    document.body.appendChild(element)
    instance = mount(TestForm, {
      target: element,
    })
  })

  afterEach(() => {
    unmount(instance)
    element.remove()
  })

  it('should support array mode', async () => {
    expect(element.querySelector('#val')!.textContent).toBe('["a"]')
    await userEvent.click(element.querySelector<HTMLButtonElement>('#push')!)
    expect(element.querySelector('#val')!.textContent).toBe('["a","b"]')
  })
})

describe('Svelte Field array mode swapFieldValues', () => {
  let element: HTMLDivElement
  let instance: any
  beforeEach(async () => {
    element = document.createElement('div')
    document.body.appendChild(element)
    instance = mount(SwapForm, {
      target: element,
    })
  })

  afterEach(() => {
    unmount(instance)
    element.remove()
  })

  it('should rerender on swapFieldValues even when length is unchanged', async () => {
    expect(element.querySelector('#val')!.textContent).toBe('["a","b"]')
    await userEvent.click(element.querySelector<HTMLButtonElement>('#swap')!)
    expect(element.querySelector('#val')!.textContent).toBe('["b","a"]')
  })
})
