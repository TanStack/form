import { ControlValueAccessor } from '@tanstack/lit-form'
import {
  MdCheckbox,
  MdFilledSelect,
  MdFilledTextField,
  MdOutlinedSelect,
  MdOutlinedTextField,
} from '@material/web/all'

const checkboxValueAccessor: ControlValueAccessor<MdCheckbox, boolean> = {
  conforms(element: HTMLElement): boolean {
    return element.tagName.toLowerCase() === 'md-checkbox'
  },
  setValue(element: MdCheckbox, value: boolean) {
    element.checked = value
  },
  getValue(element: MdCheckbox): boolean {
    return element.checked
  },

  eventName: 'input',
}

const textFieldValueAccessor: ControlValueAccessor<
  MdFilledTextField | MdOutlinedTextField,
  string
> = {
  conforms(element: HTMLElement): boolean {
    return (
      element.tagName.toLowerCase().includes('text-field') &&
      element.tagName.toLowerCase().includes('md')
    )
  },
  getValue(element: MdFilledTextField | MdOutlinedTextField): string {
    return element.value
  },
  setValue(element: MdFilledTextField | MdOutlinedTextField, value: string) {
    element.value = value
  },
  setCustomValidity(
    element: MdFilledTextField | MdOutlinedTextField,
    messages?: string[],
  ) {
    if (messages === undefined || messages.length === 0) {
      element.error = false
      element.errorText = ''
    }
    const message = getFirstErrorMessage(messages!)
    if (message) {
      element.errorText = message
      element.error = message.length > 0
    }
  },
  eventName: 'input',
}
const selectValueAccessor: ControlValueAccessor<
  MdFilledSelect | MdOutlinedSelect,
  string
> = {
  conforms(element: HTMLElement): boolean {
    return (
      element.tagName.toLowerCase().includes('select') &&
      element.tagName.toLowerCase().includes('md')
    )
  },
  setValue(element: MdFilledSelect | MdOutlinedSelect, value: string) {
    if (value === '') {
      element.reset()
    }
    element.value = value
  },
  getValue(element: MdFilledSelect | MdOutlinedSelect): string {
    return element.value
  },
  setCustomValidity(
    element: MdFilledSelect | MdOutlinedSelect,
    messages: string[],
  ) {
    if (messages.length === 0) {
      element.error = false
      element.errorText = ''
    }
    const message = getFirstErrorMessage(messages)
    if (message) {
      element.errorText = message
      element.error = message.length > 0
    }
  },
  eventName: 'input',
}

export function getMWCAccessor<T extends HTMLElement, Value = any>(
  element: T,
): ControlValueAccessor<T, Value> {
  if (selectValueAccessor.conforms(element)) {
    return selectValueAccessor as any
  } else if (checkboxValueAccessor.conforms(element)) {
    return checkboxValueAccessor as any
  }

  return textFieldValueAccessor as any
}

function getFirstErrorMessage(messages: string[]) {
  return messages.find((item) => item.length > 0)
}
