import { batch } from '@tanstack/store'
import { getTargetField, resolveFieldUpdateOptions } from '../utils.lib'
import { tryGetFieldApi } from '../FieldApi/FieldApi.lib'
import type { AnyInternalFormApi } from './FormApi.lib'
import type { InternalFieldUpdateOptions } from '../types.lib'

function isInvalidArrayMethod(
  form: AnyInternalFormApi,
  methodName: string,
  arrayFieldName: string,
  args: {
    bounds: Array<number>
    allowEndIndex: boolean
  } = { bounds: [], allowEndIndex: false },
): boolean {
  const { bounds, allowEndIndex } = args

  const array = form.getFieldValue(arrayFieldName)
  if (!Array.isArray(array)) {
    console.warn(
      `<form>.${methodName}: This method can only be used on array fields, but '${arrayFieldName}' is: `,
      array,
    )
    return true
  }
  const maxIndex = allowEndIndex ? array.length : array.length - 1
  for (const index of bounds) {
    if (index < 0 || index > maxIndex) {
      console.warn(
        `<form>.${methodName}: ${index} is out of bounds for '${arrayFieldName}', expected 0 - ${maxIndex}.`,
      )
      return true
    }
  }
  return false
}

function pushFieldValue({
  form,
  arrayFieldName,
  value,
  options,
}: {
  form: AnyInternalFormApi
  arrayFieldName: string
  value: any
  options: InternalFieldUpdateOptions | undefined
}): void {
  if (isInvalidArrayMethod(form, 'pushFieldValue', arrayFieldName)) {
    return
  }

  form.setFieldValue(
    arrayFieldName,
    (prev: Array<any>) => {
      return [...prev, value]
    },
    options,
  )
}

function insertFieldValue({
  form,
  arrayFieldName,
  index,
  value,
  options,
}: {
  form: AnyInternalFormApi
  arrayFieldName: string
  index: number
  value: any
  options: InternalFieldUpdateOptions | undefined
}): void {
  if (
    isInvalidArrayMethod(form, 'insertFieldValue', arrayFieldName, {
      bounds: [index],
      allowEndIndex: true,
    })
  ) {
    return
  }

  const updateOptions = resolveFieldUpdateOptions(options, 'change')
  const arrayField = getTargetField(form, arrayFieldName, updateOptions)
  updateOptions.fieldApiOverride = arrayField

  batch(() => {
    form.setFieldValue(
      arrayFieldName,
      (prev: Array<any>) => {
        const array = prev.slice()
        array.splice(index, 0, value)
        return array
      },
      updateOptions,
    )

    if (!arrayField) return

    // Shift existing children to the right of the insertion index
    for (const child of arrayField._children) {
      if (typeof child._segment === 'string') continue
      if (child._segment >= index) {
        child._moveTo(child._segment + 1)
      }
    }
  })
}

function removeFieldValue({
  form,
  arrayFieldName,
  index,
  options,
}: {
  form: AnyInternalFormApi
  arrayFieldName: string
  index: number
  options: InternalFieldUpdateOptions | undefined
}): void {
  if (
    isInvalidArrayMethod(form, 'removeFieldValue', arrayFieldName, {
      bounds: [index],
      allowEndIndex: false,
    })
  ) {
    return
  }

  const updateOptions = resolveFieldUpdateOptions(options, 'change')
  const arrayField = getTargetField(form, arrayFieldName, updateOptions)
  updateOptions.fieldApiOverride = arrayField

  batch(() => {
    form.setFieldValue(
      arrayFieldName,
      (prev: Array<any>) => {
        const array = prev.slice()
        array.splice(index, 1)
        return array
      },
      updateOptions,
    )

    if (!arrayField) return

    const childToRemove = tryGetFieldApi(arrayField, [index])
    childToRemove?._kill()

    for (const child of arrayField._children) {
      if (typeof child._segment === 'string') continue
      if (child._segment > index) {
        child._moveTo(child._segment - 1)
      }
    }
  })
}

function swapFieldValues({
  form,
  arrayFieldName,
  indexA,
  indexB,
  options,
}: {
  form: AnyInternalFormApi
  arrayFieldName: string
  indexA: number
  indexB: number
  options: InternalFieldUpdateOptions | undefined
}) {
  if (
    isInvalidArrayMethod(form, 'swapFieldValues', arrayFieldName, {
      bounds: [indexA, indexB],
      allowEndIndex: false,
    })
  ) {
    return
  }

  if (indexA === indexB) {
    return
  }

  const updateOptions = resolveFieldUpdateOptions(options, 'change')
  const arrayField = getTargetField(form, arrayFieldName, updateOptions)
  updateOptions.fieldApiOverride = arrayField

  batch(() => {
    form.setFieldValue(
      arrayFieldName,
      (prev: Array<any>) => {
        const a = prev[indexA]
        const b = prev[indexB]
        const array = prev.slice()
        array[indexA] = b
        array[indexB] = a
        return array
      },
      updateOptions,
    )

    if (!arrayField) return

    // Since the length wasn't changed, we need to notify manually
    arrayField._setMeta((prev) => ({
      ...prev,
      _arrayVersion: prev._arrayVersion + 1,
    }))

    const fieldA = tryGetFieldApi(arrayField, [indexA])

    const fieldB = tryGetFieldApi(arrayField, [indexB])

    // Fields aren't necessarily mounted, so we should assume
    // that the indeces will represent actual values in the array.
    // If not, then the user will most likely not iterate over them
    // during rendering, so we don't need to worry about them.
    fieldA?._moveTo(indexB)
    fieldB?._moveTo(indexA)
  })
}

function clearFieldValues({
  form,
  arrayFieldName,
  options,
}: {
  form: AnyInternalFormApi
  arrayFieldName: string
  options: InternalFieldUpdateOptions | undefined
}): void {
  if (isInvalidArrayMethod(form, 'clearFieldValues', arrayFieldName)) {
    return
  }

  const updateOptions = resolveFieldUpdateOptions(options, 'change')
  const arrayField = getTargetField(form, arrayFieldName, updateOptions)
  updateOptions.fieldApiOverride = arrayField

  batch(() => {
    form.setFieldValue(arrayFieldName, [], updateOptions)

    if (!arrayField) return

    arrayField._setMeta((prev) => ({
      ...prev,
      _arrayVersion: prev._arrayVersion + 1,
    }))

    // Kill all child fields since the array is now empty
    // _kill() will remove each child from the parent's children
    for (const child of arrayField._children) {
      child._kill()
    }
  })
}

function filterFieldValues({
  form,
  arrayFieldName,
  predicate,
  options,
}: {
  form: AnyInternalFormApi
  arrayFieldName: string
  predicate: (value: any, index: number, array: any) => boolean
  options: (InternalFieldUpdateOptions & { thisArg?: any }) | undefined
}): void {
  if (isInvalidArrayMethod(form, 'filterFieldValues', arrayFieldName)) {
    return
  }

  const updateOptions = resolveFieldUpdateOptions(options, 'change')
  const arrayNode = getTargetField(form, arrayFieldName, updateOptions)
  updateOptions.fieldApiOverride = arrayNode

  const oldArray: Array<any> = form.getFieldValue(arrayFieldName)

  let length = 0
  const thisArg = options?.thisArg
  const filtered = oldArray.filter((value, index, array) => {
    const keep = predicate.call(thisArg, value, index, array)
    if (!arrayNode) return keep

    const childAtIndex = arrayNode._getChild(index)
    if (keep) {
      childAtIndex?._moveTo(length)
      length++
    } else {
      childAtIndex?._kill()
    }
    return keep
  })

  if (oldArray.length === filtered.length) {
    // Setting filtered array would be a no-op, but either way the user
    // tried to set a value
    form._notifyFieldChange(arrayNode, updateOptions)
  } else {
    form.setFieldValue(arrayFieldName, filtered, updateOptions)
  }
}

export const ArrayMethods = {
  pushValue: pushFieldValue,
  insertValue: insertFieldValue,
  removeValue: removeFieldValue,
  swapValues: swapFieldValues,
  // 'replaceFieldValue'
  // 'moveFieldValues'
  clearValues: clearFieldValues,
  filterValues: filterFieldValues,
}
