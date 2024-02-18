export interface ControlValueAccessor<T extends HTMLElement, Value> {
  /**
   * Is this the right ControlValueAccessor for this element type?
   * @param element
   */
  conforms(element: HTMLElement): boolean
  getValue(element: T): Value
  setValue(element: T, value: Value): void

  setCustomValidity?(element: T, messages?: string[]): void
  eventName: string
}

const checkboxValueAccessor: ControlValueAccessor<HTMLInputElement, boolean> = {
  conforms(element: HTMLElement): boolean {
    return (
      element.tagName.toLowerCase() === 'input' &&
      element.getAttribute('type') === 'checkbox'
    )
  },
  setValue(element: HTMLInputElement, value: boolean) {
    element.checked = value
  },
  getValue(element: HTMLInputElement): boolean {
    return element.checked
  },

  eventName: 'input',
}

const textFieldValueAccessor: ControlValueAccessor<HTMLInputElement, string> = {
  conforms(element: HTMLElement): boolean {
    return element.tagName.toLowerCase().includes('input')
  },
  getValue(element: HTMLInputElement): string {
    return element.value
  },
  setValue(element: HTMLInputElement, value: string) {
    element.value = value
  },
  setCustomValidity(element: HTMLInputElement, messages?: string[]) {
    if (messages === undefined || messages.length === 0) {
      element.setCustomValidity('')
      element.reportValidity()
      return
    }
    const message = getFirstErrorMessage(messages)
    if (message) {
      element.setCustomValidity(message)
      element.reportValidity()
    }
  },
  eventName: 'input',
}
const selectValueAccessor: ControlValueAccessor<HTMLSelectElement, string> = {
  conforms(element: HTMLElement): boolean {
    return element.tagName.toLowerCase().includes('select')
  },
  setValue(element: HTMLSelectElement, value: string) {
    element.value = value
  },
  getValue(element: HTMLSelectElement): string {
    return element.value
  },
  setCustomValidity(element: HTMLSelectElement, messages?: string[]) {
    if (messages === undefined || messages.length === 0) {
      element.setCustomValidity('')
      element.reportValidity()
      return
    }
    const message = getFirstErrorMessage(messages)
    if (message) {
      element.setCustomValidity(message)
      element.reportValidity()
    }
  },
  eventName: 'input',
}

const textAreaValueAccessor: ControlValueAccessor<HTMLTextAreaElement, string> = {
  conforms(element: HTMLElement): boolean {
    return element.tagName.toLowerCase().includes('textarea')
  },
  setValue(element: HTMLTextAreaElement, value: string) {
    element.value = value
  },
  getValue(element: HTMLTextAreaElement): string {
    return element.value
  },
  setCustomValidity(element: HTMLTextAreaElement, messages?: string[]) {
    if (messages === undefined || messages.length === 0) {
      element.setCustomValidity('')
      element.reportValidity()
      return
    }
    const message = getFirstErrorMessage(messages)
    if (message) {
      element.setCustomValidity(message)
      element.reportValidity()
    }
  },
  eventName: 'input',
}

export function getNativeAccessor<T extends HTMLElement, Value = any>(
  element: T,
): ControlValueAccessor<T, Value> | undefined {
  if (selectValueAccessor.conforms(element)) {
    return selectValueAccessor as any
  } else if (checkboxValueAccessor.conforms(element)) {
    return checkboxValueAccessor as any
  } else if (textAreaValueAccessor.conforms(element)) {
    return textAreaValueAccessor as any
  } else if (textFieldValueAccessor.conforms(element)) {
    return textFieldValueAccessor as any
  }
  return undefined
}

function getFirstErrorMessage(messages: string[]) {
  return messages.find((item) => item.length > 0)
}
