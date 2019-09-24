import React from 'react'
//
import useAsyncDebounce from './useAsyncDebounce'
import useFormContext from './useFormContext'
import useFieldScope from './useFieldScope'
import { getFieldID } from '../utils'

let uid = 0

const methodMap = [
  'setFieldValue',
  'setFieldMeta',
  'pushFieldValue',
  'insertFieldValue',
  'removeFieldValue',
  'swapFieldValues',
]

const defaultDefaultMeta = {
  error: null,
  isTouched: false,
  isValidating: false,
}

export default function useField(
  fieldName,
  {
    defaultValue,
    defaultIsTouched = false,
    defaultError = null,
    defaultMeta = defaultDefaultMeta,
    validatePristine,
    validate,
    filterValue,
    formContext: manualFormContext,
  } = {}
) {
  if (!fieldName) {
    throw new Error(
      `useField: A field is required to use this hook. eg, useField('myField', options)`
    )
  }

  const formApiRef = React.useRef()
  const fieldApiRef = React.useRef({})

  let formApi = useFormContext(manualFormContext)

  const instanceIDRef = React.useRef(uid++)
  const instanceID = instanceIDRef.current

  // Support field prefixing from FieldScope
  let fieldPrefix = ''
  if (formApi.fieldName) {
    fieldPrefix = `${formApi.fieldName}.`
    formApi = formApi.form
  }
  fieldName = fieldPrefix + fieldName

  // Create a debounce for this field hook instance (not all instances)
  const debounce = useAsyncDebounce()

  // An escape hatch for accessing latest formAPI
  formApiRef.current = formApi

  // Get the field value, meta, and metaRef
  const preValue = formApi.getFieldValue(fieldName)
  const preMeta = formApi.getFieldMeta(fieldName)
  const __metaRef = formApi.__getFieldMetaRef(fieldName)

  // Handle default value
  const value = React.useMemo(
    () =>
      typeof preValue === 'undefined' && typeof defaultValue !== 'undefined'
        ? defaultValue
        : preValue,
    [defaultValue, preValue]
  )

  // Handle default meta
  const meta = React.useMemo(
    () =>
      typeof preMeta === 'undefined'
        ? {
            ...defaultMeta,
            error: defaultError,
            isTouched: defaultIsTouched,
          }
        : preMeta,
    [defaultError, defaultMeta, defaultIsTouched, preMeta]
  )

  // Create the fieldApi
  const fieldApi = React.useMemo(
    () => ({
      value,
      meta,
      form: formApi,
      fieldName,
    }),
    [fieldName, formApi, meta, value]
  )

  // Keep the fieldApiRef up to date
  fieldApiRef.current = fieldApi
  fieldApiRef.current.__filterValue = filterValue
  fieldApiRef.current.__validate = validate

  // Let's scope some field-level methods for convenience
  const [
    setValue,
    setMeta,
    pushValue,
    insertValue,
    removeValue,
    swapValues,
  ] = methodMap.map(d => {
    // Since this array is stable and always the same, we can disable
    // the react-hooks linter here:

    // eslint-disable-next-line
    return React.useCallback(
      (...args) => formApiRef.current[d](fieldName, ...args),
      // eslint-disable-next-line
      [fieldName]
    )
  })

  // Let's scope some field-level methods for convenience
  const [
    setFieldValue,
    setFieldMeta,
    pushFieldValue,
    insertFieldValue,
    removeFieldValue,
    swapFieldValues,
  ] = methodMap.map(d => {
    // Since this array is stable and always the same, we can disable
    // the react-hooks linter here:

    // eslint-disable-next-line
    return React.useCallback(
      (subField, ...args) =>
        formApiRef.current[d](`${fieldName}.${subField}`, ...args),
      // eslint-disable-next-line
      [fieldName]
    )
  })

  const runValidation = React.useCallback(async () => {
    if (!fieldApiRef.current.__validate) {
      return
    }
    setMeta({ isValidating: true })

    // Use the validationCount for all field instances to
    // track freshness of the validation
    const id = (__metaRef.current.validationCount || 0) + 1
    __metaRef.current.validationCount = id

    const checkLatest = () => id === __metaRef.current.validationCount

    if (!__metaRef.current.validationPromise) {
      __metaRef.current.validationPromise = new Promise((resolve, reject) => {
        __metaRef.current.validationResolve = resolve
        __metaRef.current.validationReject = reject
      })
    }

    const doValidate = async () => {
      try {
        const error = await fieldApiRef.current.__validate(
          fieldApiRef.current.value,
          fieldApiRef.current
        )

        if (checkLatest()) {
          setMeta({ isValidating: false })
          if (typeof error !== 'undefined') {
            if (error) {
              if (typeof error === 'string') {
                setMeta({ error })
              }
            } else {
              setMeta({ error: null })
            }
          }
          __metaRef.current.validationResolve()
        }
      } catch (error) {
        if (checkLatest()) {
          __metaRef.current.validationReject(error)
          throw error
        }
      } finally {
        if (checkLatest()) {
          setMeta({ isValidating: false })
          delete __metaRef.current.validationPromise
        }
      }
    }

    doValidate()

    return __metaRef.current.validationPromise
  }, [__metaRef, setMeta])

  const getInputProps = React.useCallback(
    ({ onChange, onBlur, ...rest } = {}) => {
      return {
        value,
        onChange: e => {
          setValue(e.target.value)
          if (onChange) {
            onChange(e)
          }
        },
        onBlur: e => {
          setMeta({ isTouched: true })
          if (onBlur) {
            onBlur(e)
          }
        },
        ...rest,
      }
    },
    [setMeta, setValue, value]
  )

  const FieldScope = useFieldScope(fieldApi)

  // Fill in the rest of the fieldApi
  Object.assign(fieldApi, {
    __metaRef,
    setValue,
    setMeta,
    pushValue,
    insertValue,
    removeValue,
    swapValues,
    setFieldValue,
    setFieldMeta,
    pushFieldValue,
    insertFieldValue,
    removeFieldValue,
    swapFieldValues,
    debounce,
    runValidation,
    getInputProps,
    FieldScope,
  })

  React.useEffect(() => {
    const fieldID = getFieldID(fieldName)

    const { current: metaRef } = formApiRef.current.__fieldMetaRefs[fieldID]

    metaRef.instanceRefs = metaRef.instanceRefs || {}
    metaRef.instanceRefs[instanceID] = fieldApiRef

    return () => {
      delete metaRef.instanceRefs[instanceID]
      if (!Object.keys(metaRef.instanceRefs).length) {
        fieldApiRef.current.setMeta(() => undefined)
        delete formApiRef.current.__fieldMetaRefs[fieldID]
      }
    }
  }, [fieldName, instanceID])

  // The default value effect handler
  React.useEffect(() => {
    if (typeof preValue === 'undefined' && typeof value !== 'undefined') {
      setValue(value, { isTouched: false })
    }
  }, [preValue, setValue, value])

  // The default meta effect handler
  React.useEffect(() => {
    if (typeof preMeta === 'undefined' && typeof meta !== 'undefined') {
      setMeta(meta)
    }
  }, [fieldName, meta, preMeta, setMeta, setValue, value])

  // When the form gets dirty and when the value changes, run the validation
  React.useEffect(() => {
    if (!validatePristine && !meta.isTouched) {
      return
    }

    try {
      runValidation(value)
    } catch (err) {
      console.error('An error occurred during validation', err)
    }
  }, [meta.isTouched, runValidation, validatePristine, value])

  return fieldApiRef.current
}
