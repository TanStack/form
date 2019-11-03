import React from 'react'
//
import useAsyncDebounce from './useAsyncDebounce'
import useFormElement from './useFormElement'
import { someObject, getBy, setBy, getFieldID } from '../utils'

const defaultDefaultValue = {}

function makeState(decor) {
  return {
    meta: {
      isSubmitting: false,
      isTouched: false,
      isSubmitted: false,
      submissionAttempts: 0,
    },
    __fieldMeta: {},
    ...decor,
  }
}

export default function useForm({
  onSubmit,
  defaultValues = defaultDefaultValue,
  validate,
  validatePristine,
  debugForm,
} = {}) {
  let [{ values, meta, __fieldMeta }, setState] = React.useState(() =>
    makeState({
      values: defaultValues,
    })
  )

  const [shouldResubmit, setShouldResubmit] = React.useState(false)
  const apiRef = React.useRef()
  const metaRef = React.useRef({})
  const __fieldMetaRefsRef = React.useRef({})

  // Keep validate up to date with the latest version
  metaRef.current.validate = validate

  const fieldsAreValidating = someObject(
    __fieldMeta,
    field => field && field.isValidating
  )
  const fieldsAreValid = !someObject(__fieldMeta, field => field && field.error)

  // Can we submit this form?
  const isValid = !fieldsAreValidating && fieldsAreValid && !meta.error

  const canSubmit = isValid && !meta.isValidating && !meta.isSubmitting

  // Decorate form meta
  meta = React.useMemo(
    () => ({
      ...meta,
      fieldsAreValidating,
      fieldsAreValid,
      isValid,
      canSubmit,
    }),
    [meta, fieldsAreValidating, fieldsAreValid, isValid, canSubmit]
  )

  // We want the apiRef to change every time state updates
  const api = React.useMemo(
    () => ({
      values,
      meta,
      __fieldMeta,
      debugForm,
    }),
    [debugForm, __fieldMeta, meta, values]
  )
  // Keep the apiRef up to date with the latest version of the api
  apiRef.current = api

  const reset = React.useCallback(() => {
    setState(() =>
      makeState({
        values: defaultValues,
      })
    )
  }, [defaultValues, setState])

  // On submit
  const handleSubmit = React.useCallback(async (e = {}) => {
    if (e.persist) e.persist()
    if (e.preventDefault) e.preventDefault()

    // This lets sub-forms with form elements (despite them being invalid HTML)
    // handle submissions without triggering parent forms
    if (e.__handled) {
      return
    }
    e.__handled = true

    // Don't let invalid forms submit
    if (!apiRef.current.meta.isValid) {
      // If the form can't submit, let's trigger all of the fields
      // to be touched. Thus, their validations will run
      apiRef.current.setMeta({ isSubmitting: false })
      return
    }

    apiRef.current.setMeta({ isSubmitting: true })

    let needsResubmit = false

    const fieldValidationPromises = []

    Object.keys(apiRef.current.__fieldMetaRefs).forEach(key => {
      const { current: fieldMeta } = apiRef.current.__fieldMetaRefs[key]
      Object.keys(fieldMeta.instanceRefs).forEach(key => {
        const { current: fieldInstance } = fieldMeta.instanceRefs[key]
        // If any fields are not touched
        if (!fieldInstance.meta.isTouched) {
          // Mark them as touched
          fieldInstance.setMeta({ isTouched: true })
          // Likewise, if they need validation
          if (fieldInstance.__validate) {
            // Run their validation and keep track of the
            // promise
            fieldValidationPromises.push(fieldInstance.runValidation())
          }
        }
      })
    })

    // If any validation needed to be run
    if (fieldValidationPromises.length) {
      // Mark for resubmission
      needsResubmit = true
    }

    if (!apiRef.current.meta.isTouched) {
      // Mark for resubmission
      needsResubmit = true

      // Mark the form as touched
      apiRef.current.setMeta(old => ({
        ...old,
        isTouched: true,
      }))
    }

    if (needsResubmit) {
      // Wait for any field validations to complete
      await Promise.all(fieldValidationPromises)
      // Be sure to run validation for the form
      // and wait for it to complete
      await apiRef.current.runValidation()
      // Then rerun the submission attempt
      e.__handled = false
      setShouldResubmit(e || true)
      // Do not continue
      return
    }

    apiRef.current.setMeta(old => ({
      ...old,
      // Submittion attempts mark the form as not submitted
      isSubmitted: false,
      // Count submission attempts
      submissionAttempts: old.submissionAttempts + 1,
    }))

    try {
      // Run the submit code
      await apiRef.current.onSubmit(apiRef.current.values, apiRef.current)

      apiRef.current.setMeta({ isSubmitted: true })
    } catch (err) {
      throw err
    } finally {
      apiRef.current.setMeta({ isSubmitting: false })
    }
  }, [])

  // Create a debounce for this field hook instance (not all instances)
  const debounce = useAsyncDebounce()

  const setMeta = React.useCallback(
    updater => {
      setState(old => ({
        ...old,
        meta:
          typeof updater === 'function'
            ? updater(old.meta)
            : { ...old.meta, ...updater },
      }))
    },
    [setState]
  )

  const runValidation = React.useCallback(() => {
    if (!metaRef.current.validate) {
      return
    }
    apiRef.current.setMeta({ isValidating: true })

    // Use the validationCount for all field instances to
    // track freshness of the validation
    const id = (metaRef.current.validationCount || 0) + 1
    metaRef.current.validationCount = id

    const checkLatest = () => id === metaRef.current.validationCount

    if (!metaRef.current.validationPromise) {
      metaRef.current.validationPromise = new Promise((resolve, reject) => {
        metaRef.current.validationResolve = resolve
        metaRef.current.validationReject = reject
      })
    }

    const doValidation = async () => {
      try {
        const error = await metaRef.current.validate(
          apiRef.current.values,
          apiRef.current
        )

        if (checkLatest()) {
          apiRef.current.setMeta({ isValidating: false })
          if (typeof error !== 'undefined') {
            if (error) {
              if (typeof error === 'string') {
                apiRef.current.setMeta({ error })
              }
            } else {
              apiRef.current.setMeta({ error: null })
            }
          }
          metaRef.current.validationResolve()
        }
      } catch (err) {
        if (checkLatest()) {
          metaRef.current.validationReject(err)
        }
      } finally {
        delete metaRef.current.validationPromise
      }
    }

    doValidation()

    return metaRef.current.validationPromise
  }, [])

  const getFieldValue = React.useCallback(
    field => getBy(apiRef.current.values, field),
    []
  )

  const getFieldMeta = React.useCallback(field => {
    const fieldID = getFieldID(field)
    return apiRef.current.__fieldMeta[fieldID]
  }, [])

  const __getFieldMetaRef = React.useCallback(field => {
    const fieldID = getFieldID(field)
    if (!apiRef.current.__fieldMetaRefs[fieldID]) {
      apiRef.current.__fieldMetaRefs[fieldID] = {
        current: {
          instanceRefs: {},
        },
      }
    }
    return apiRef.current.__fieldMetaRefs[fieldID]
  }, [])

  const setFieldMeta = React.useCallback(
    (field, updater) => {
      const fieldID = getFieldID(field)
      setState(old => {
        const newFieldMeta =
          typeof updater === 'function'
            ? updater(old.__fieldMeta[fieldID])
            : { ...old.__fieldMeta[fieldID], ...updater }

        // If field has been blured, update form touched status
        if (newFieldMeta.isTouched) {
          apiRef.current.setMeta({ isTouched: true })
        }

        return {
          ...old,
          // Any errors in fields should visually stop
          // form.isSubmitting
          meta:
            newFieldMeta && newFieldMeta.error
              ? {
                  ...old.meta,
                  isSubmitting: false,
                }
              : old.meta,
          __fieldMeta: {
            ...old.__fieldMeta,
            [fieldID]: newFieldMeta,
          },
        }
      })
    },
    [setState, apiRef]
  )

  const setFieldValue = React.useCallback(
    (field, updater, { isTouched = false } = {}) => {
      const fieldInstances = apiRef.current.__getFieldInstances(field)

      setState(old => {
        let newValue =
          typeof updater === 'function'
            ? updater(getBy(old.values, field))
            : updater

        fieldInstances.forEach(instance => {
          if (instance.current.__filterValue) {
            newValue = instance.current.__filterValue(newValue, apiRef.current)
          }
        })

        return {
          ...old,
          values: setBy(old.values, field, newValue),
        }
      })
      if (isTouched) {
        apiRef.current.setFieldMeta(field, {
          isTouched: true,
        })
        apiRef.current.setMeta({ isTouched: true })
      }
    },
    [setState]
  )

  const __getFieldInstances = React.useCallback(field => {
    const __metaRef = apiRef.current.__getFieldMetaRef(field)
    return Object.keys(__metaRef.current.instanceRefs).map(
      key => __metaRef.current.instanceRefs[key]
    )
  }, [])

  const pushFieldValue = React.useCallback((field, value, options) => {
    apiRef.current.setFieldValue(
      field,
      old => {
        return [...(Array.isArray(old) ? old : []), value]
      },
      options
    )
  }, [])

  const insertFieldValue = React.useCallback((field, index, value, options) => {
    apiRef.current.setFieldValue(
      field,
      old => {
        if (Array.isArray(old)) {
          return old.map((d, i) => (i === index ? value : d))
        } else {
          throw Error(
            `Cannot insert a field value into a non-array field. Check that this field's existing value is an array: ${field}.`
          )
        }
      },
      options
    )
  }, [])

  const removeFieldValue = React.useCallback((field, index, options) => {
    apiRef.current.setFieldValue(
      field,
      old => {
        if (Array.isArray(old)) {
          return old.filter((d, i) => i !== index)
        } else {
          throw Error(
            `Cannot remove a field value from a non-array field. Check that this field's existing value is an array: ${field}.`
          )
        }
      },
      options
    )
  }, [])

  const swapFieldValues = React.useCallback(
    (path, index1, index2) => {
      setState(old => {
        const old1 = getBy(old.values, [path, index1])
        const old2 = getBy(old.values, [path, index2])

        let values = setBy(old.values, [path, index1], old2)
        values = setBy(values, [path, index2], old1)

        return {
          ...old,
          values,
        }
      })
    },
    [setState]
  )

  const setValues = React.useCallback(
    values => {
      setState(old => ({
        ...old,
        values: values,
      }))
    },
    [setState]
  )

  // Create the Form element if necessary
  const Form = useFormElement(api)

  Object.assign(api, {
    __fieldMetaRefs: __fieldMetaRefsRef.current,
    onSubmit,
    reset,
    handleSubmit,
    debounce,
    setMeta,
    runValidation,
    getFieldValue,
    getFieldMeta,
    __getFieldMetaRef,
    setFieldMeta,
    setFieldValue,
    __getFieldInstances,
    pushFieldValue,
    insertFieldValue,
    removeFieldValue,
    swapFieldValues,
    setValues,
    Form,
    formContext: api,
  })

  // If shouldResubmit is true, do yo thang
  React.useEffect(() => {
    if (shouldResubmit) {
      handleSubmit(shouldResubmit)
      setShouldResubmit(false)
    }
  }, [handleSubmit, shouldResubmit])

  // When the form gets dirty and when the value changes
  // validate
  React.useEffect(() => {
    if (!validatePristine && !meta.isTouched) {
      return
    }

    apiRef.current.runValidation(values)
  }, [meta.isTouched, validatePristine, values])

  // When defaultValues update, set them
  React.useEffect(() => {
    if (defaultValues !== apiRef.current.values) {
      setState(old => ({
        ...old,
        values: defaultValues,
      }))
    }
  }, [defaultValues, setState])

  // Return the root form and the Form component to the hook user
  return apiRef.current
}
