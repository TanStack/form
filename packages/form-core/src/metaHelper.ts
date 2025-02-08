import type { FieldMeta } from './FieldApi'
import type { FormApi } from './FormApi'
import type { Validator } from './types'
import type { DeepKeys } from './util-types'

export function metaHelper<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(formApi: FormApi<TFormData, TFormValidator>) {
  function handleArrayFieldMetaShift(
    field: DeepKeys<TFormData>,
    index: number,
    mode: 'insert' | 'remove' | 'swap' | 'move',
    secondIndex?: number,
  ) {
    const affectedFields = getAffectedFields(field, index, mode, secondIndex)

    switch (mode) {
      case 'insert':
        handleInsertMode(affectedFields, field, index)
        break
      case 'remove':
        handleRemoveMode(affectedFields)
        break
      case 'swap':
        if (secondIndex !== undefined) {
          handleSwapMode(affectedFields, field, index, secondIndex)
        }
        break
      case 'move':
        if (secondIndex !== undefined) {
          handleMoveMode(affectedFields, field, index, secondIndex)
        }
        break
    }
  }

  function getAffectedFields(
    field: DeepKeys<TFormData>,
    index: number,
    mode: 'insert' | 'remove' | 'swap' | 'move',
    secondIndex?: number,
  ): DeepKeys<TFormData>[] {
    const affectedFieldKeys = [`${field}[${index}]`]

    if (mode === 'swap') {
      affectedFieldKeys.push(`${field}[${secondIndex}]`)
    } else if (mode === 'move') {
      const startIndex = Math.min(index, secondIndex!)
      const endIndex = Math.max(index, secondIndex!)

      for (let i = startIndex; i <= endIndex; i++) {
        if (i !== secondIndex) {
          affectedFieldKeys.push(`${field}[${i}]`)
        }
      }
    } else {
      const currentValue = formApi.getFieldValue(field)
      const arrayFieldLength = Array.isArray(currentValue)
        ? Math.max(currentValue.length, 0)
        : 0
      for (let i = index + 1; i < arrayFieldLength; i++) {
        affectedFieldKeys.push(`${field}[${i}]`)
      }
    }

    return Object.keys(formApi.fieldInfo).filter((fieldKey) =>
      affectedFieldKeys.some((key) => fieldKey.startsWith(key)),
    ) as DeepKeys<TFormData>[]
  }

  function shiftMeta(fields: DeepKeys<TFormData>[], direction: 'up' | 'down') {
    const sortedFields =
      direction === 'up' ? [...fields] : [...fields].reverse()

    sortedFields.forEach((fieldKey) => {
      const nextFieldKey = fieldKey
        .toString()
        .replace(/\[(\d+)\]/, (_, num) => {
          const currIndex = parseInt(num, 10)
          const newIndex =
            direction === 'up' ? currIndex + 1 : Math.max(0, currIndex - 1)
          return `[${newIndex}]`
        }) as DeepKeys<TFormData>

      const nextFieldMeta = formApi.getFieldMeta(nextFieldKey)
      if (nextFieldMeta) {
        formApi.setFieldMeta(fieldKey, nextFieldMeta)
      }
    })
  }

  const handleInsertMode = (
    fields: DeepKeys<TFormData>[],
    field: DeepKeys<TFormData>,
    insertIndex: number,
  ) => {
    shiftMeta(fields, 'down')

    // Reset the field meta for the newly inserted field
    fields.forEach((fieldKey) => {
      if (fieldKey.toString().startsWith(`${field}[${insertIndex}]`)) {
        formApi.setFieldMeta(fieldKey, {
          isValidating: false,
          isTouched: false,
          isBlurred: false,
          isDirty: false,
          isPristine: true,
          errors: [],
          errorMap: {},
        })
      }
    })
  }

  const handleRemoveMode = (fields: DeepKeys<TFormData>[]) => {
    shiftMeta(fields, 'up')
  }

  const handleMoveMode = (
    fields: DeepKeys<TFormData>[],
    field: DeepKeys<TFormData>,
    fromIndex: number,
    toIndex: number,
  ) => {
    // Store the original field meta that will be reapplied at the destination index
    const fromFields = new Map<DeepKeys<TFormData>, FieldMeta>()
    Object.keys(formApi.fieldInfo)
      .filter(
        (fieldKey) =>
          typeof fieldKey === 'string' &&
          fieldKey.startsWith(`${field}[${fromIndex}]`),
      )
      .forEach((fieldKey) => {
        const fieldMeta = formApi.getFieldMeta(fieldKey as DeepKeys<TFormData>)
        if (fieldMeta) {
          fromFields.set(fieldKey as DeepKeys<TFormData>, fieldMeta)
        }
      })

    if (fromIndex < toIndex) {
      shiftMeta(fields, 'up')
    } else {
      shiftMeta(fields, 'down')
    }

    // Reapply the stored field meta at the destination index
    Object.keys(formApi.fieldInfo).forEach((fieldKey) => {
      if (
        typeof fieldKey === 'string' &&
        fieldKey.startsWith(`${field}[${toIndex}]`)
      ) {
        const fromKey = fieldKey.replace(
          `${field}[${toIndex}]`,
          `${field}[${fromIndex}]`,
        ) as DeepKeys<TFormData>

        const fromMeta = fromFields.get(fromKey)
        if (fromMeta) {
          formApi.setFieldMeta(fieldKey as DeepKeys<TFormData>, fromMeta)
        }
      }
    })
  }

  const handleSwapMode = (
    fields: DeepKeys<TFormData>[],
    field: DeepKeys<TFormData>,
    index: number,
    secondIndex: number,
  ) => {
    fields.forEach((fieldKey) => {
      if (
        typeof fieldKey === 'string' &&
        fieldKey.startsWith(`${field}[${index}]`)
      ) {
        const swappedKey = fieldKey.replace(
          `${field}[${index}]`,
          `${field}[${secondIndex}]`,
        ) as DeepKeys<TFormData>

        const meta1 = formApi.getFieldMeta(fieldKey)
        const meta2 = formApi.getFieldMeta(swappedKey)

        if (meta1) formApi.setFieldMeta(swappedKey, meta1)
        if (meta2) formApi.setFieldMeta(fieldKey, meta2)
      }
    })
  }

  return { handleArrayFieldMetaShift }
}
