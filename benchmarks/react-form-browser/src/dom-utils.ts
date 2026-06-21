export function getRequiredElement<TElement extends Element>(
  root: ParentNode,
  selector: string,
): TElement {
  const element = root.querySelector<TElement>(selector)
  if (!element) {
    throw new Error(`Unable to find element: ${selector}`)
  }
  return element
}

export function getRequiredElements<TElement extends Element>(
  root: ParentNode,
  selector: string,
): NodeListOf<TElement> {
  const elements = root.querySelectorAll<TElement>(selector)
  if (elements.length === 0) {
    throw new Error(`Unable to find elements: ${selector}`)
  }
  return elements
}

export function setNativeInputValue(input: HTMLInputElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set

  if (!valueSetter) {
    throw new Error('Unable to find native input value setter')
  }

  valueSetter.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

export async function waitForBrowserWork() {
  await Promise.resolve()
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  await Promise.resolve()
}
