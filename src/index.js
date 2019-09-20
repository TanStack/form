import React from 'react'
// gggg
import useAsyncDebounce from './hooks/useAsyncDebounce'

const formContext = React.createContext()

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

const defaultDefaultValue = {}

export function useForm({
  onSubmit,
  defaultValues = defaultDefaultValue,
  validate,
  validatePristine,
  debugForm,
} = {}) {
  let [
    {
      values,
      meta,
      meta: { isSubmitting, isTouched },
      __fieldMeta,
    },
    setState,
  ] = React.useState(() =>
    makeState({
      values: defaultValues,
    })
  )

  const apiRef = React.useRef()
  const metaRef = React.useRef({})
  const __fieldMetaRefsRef = React.useRef({})
  const validateRef = React.useRef()

  // Keep validate up to date with the latest version
  validateRef.current = validate

  // Can we submit this form?
  const isValid =
    isTouched &&
    !someObject(__fieldMeta, field => field && field.error) &&
    !meta.error

  const canSubmit = isValid && !isSubmitting

  // Decorate form meta
  meta = React.useMemo(
    () => ({
      ...meta,
      isValid,
      canSubmit,
    }),
    [canSubmit, meta, isValid]
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
  const handleSubmit = React.useCallback(async e => {
    e.persist()
    e.preventDefault()

    // This lets sub-forms with form elements (despite them being invalid HTML)
    // handle submissions without triggering parent forms
    if (e.__handled) {
      return
    }
    e.__handled = true

    apiRef.current.setMeta(old => ({
      ...old,
      // Submission attempts make the form dirty
      isTouched: true,
      // Submittion attempts mark the form as not submitted
      isSubmitted: false,
      // Count submission attempts
      submissionAttempts: old.submissionAttempts + 1,
    }))

    // Don't allow isSubmitting
    if (apiRef.current.meta.isSubmitting) {
      return
    }

    apiRef.current.setMeta({ isSubmitting: true })

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

  const runValidation = React.useCallback(async () => {
    if (!validateRef.current) {
      return
    }
    apiRef.current.setMeta({ isValidating: true })

    // Use the validationCount for all field instances to
    // track freshness of the validation
    const id = (metaRef.current.validationCount || 0) + 1
    metaRef.current.validationCount = id

    const checkLatest = () => id === metaRef.current.validationCount

    const error = await validateRef.current(
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
    }
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
      apiRef.current.__fieldMetaRefs[fieldID] = { current: {} }
    }
    return apiRef.current.__fieldMetaRefs[fieldID]
  }, [])

  const setFieldMeta = React.useCallback(
    (field, updater) => {
      const fieldID = getFieldID(field)
      setState(old => ({
        ...old,
        __fieldMeta: {
          ...old.__fieldMeta,
          [fieldID]:
            typeof updater === 'function'
              ? updater(old.__fieldMeta[fieldID])
              : { ...old.__fieldMeta[fieldID], ...updater },
        },
      }))
    },
    [setState]
  )

  const setFieldValue = React.useCallback(
    (field, updater, { isTouched = true } = {}) => {
      const __metaRef = apiRef.current.__getFieldMetaRef(field)
      setState(old => {
        let newValue =
          typeof updater === 'function'
            ? updater(getBy(old.values, field))
            : updater

        if (__metaRef.current.filterValue) {
          newValue = __metaRef.current.filterValue(newValue, apiRef.current)
        }

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

  const pushFieldValue = React.useCallback((field, value, options) => {
    apiRef.current.setFieldValue(
      field,
      old => {
        if (Array.isArray(old)) {
          return [...old, value]
        } else {
          throw Error(
            `Cannot push a field value into a non-array field. Check that this field's existing value is an array: ${field}.`
          )
        }
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
    pushFieldValue,
    insertFieldValue,
    removeFieldValue,
    swapFieldValues,
    setValues,
    Form,
    formContext: api,
  })

  // When the form gets dirty and when the value changes
  // validate
  React.useEffect(() => {
    if (!validatePristine && !isTouched) {
      return
    }

    apiRef.current.runValidation(values)
  }, [isTouched, validatePristine, values])

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

export function useFormContext(manualFormContext) {
  let formApi = React.useContext(formContext)

  if (manualFormContext) {
    return manualFormContext
  }

  if (!formApi) {
    throw new Error(`You are trying to use the form API outside of a form!`)
  }

  return formApi
}

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

export function useField(
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
  const validateRef = React.useRef()

  // Keep validate up to date with the latest version
  validateRef.current = validate

  let formApi = useFormContext(manualFormContext)

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

  // Keep the filter function up to date
  __metaRef.current.filterValue = filterValue

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
    if (!validateRef.current) {
      return
    }
    setMeta({ isValidating: true })

    // Use the validationCount for all field instances to
    // track freshness of the validation
    const id = (__metaRef.current.validationCount || 0) + 1
    __metaRef.current.validationCount = id

    const checkLatest = () => id === __metaRef.current.validationCount

    try {
      const error = await validateRef.current(
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
      }
    } catch (error) {
      if (checkLatest()) {
        throw error
      }
    } finally {
      if (checkLatest()) {
        setMeta({ isValidating: false })
      }
    }
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
  }, [__metaRef, fieldName, meta, preMeta, setMeta, setValue, value])

  // When the form gets dirty and when the value changes, run the validation
  React.useEffect(() => {
    if (!validatePristine && !meta.isTouched) {
      return
    }

    runValidation(value)
  }, [meta.isTouched, runValidation, validatePristine, value])

  return fieldApiRef.current
}

function useFormElement(contextValue) {
  const FormRef = React.useRef()
  const FormApiRef = React.useRef()

  FormApiRef.current = contextValue

  // Create a new form element
  if (!FormRef.current) {
    FormRef.current = function Form({ children, noFormElement, ...rest }) {
      const {
        handleSubmit,
        meta: { isSubmitting },
        debugForm,
      } = FormApiRef.current

      return (
        <formContext.Provider value={FormApiRef.current}>
          {noFormElement ? (
            children
          ) : (
            <form onSubmit={handleSubmit} disabled={isSubmitting} {...rest}>
              {children}
              {debugForm ? (
                <pre>
                  <code>
                    {JSON.stringify(
                      { ...FormApiRef.current, formContext: undefined },
                      null,
                      2
                    )}
                  </code>
                </pre>
              ) : null}
            </form>
          )}
        </formContext.Provider>
      )
    }
  }

  // Return the form element
  return FormRef.current
}

function useFieldScope(contextValue) {
  const FieldScopeRef = React.useRef()
  const FieldScopeApiRef = React.useRef()

  FieldScopeApiRef.current = contextValue

  // Create a new form element
  if (!FieldScopeRef.current) {
    FieldScopeRef.current = function Field({ children }) {
      return (
        <formContext.Provider value={FieldScopeApiRef.current}>
          {children}
        </formContext.Provider>
      )
    }
  }

  return FieldScopeRef.current
}

export function splitFormProps({
  field,
  defaultValue,
  defaultIsTouched,
  defaultError,
  defaultMeta,
  validatePristine,
  validate,
  onSubmit,
  defaultValues,
  filterValue,
  debugForm,
  ...rest
}) {
  return [
    field,
    {
      defaultValue,
      defaultIsTouched,
      defaultError,
      defaultMeta,
      validatePristine,
      validate,
      onSubmit,
      defaultValues,
      filterValue,
      debugForm,
    },
    rest,
  ]
}

// Utils

function getBy(obj, path) {
  if (!path) {
    throw new Error('A path string is required to use getBy')
  }
  const pathArray = makePathArray(path)
  const pathObj = pathArray
  return pathObj.reduce((current, pathPart) => {
    if (typeof current !== 'undefined') {
      return current[pathPart]
    }
    return undefined
  }, obj)
}

function setBy(obj, path, updater) {
  path = makePathArray(path)

  function doSet(parent) {
    if (!path.length) {
      return typeof updater === 'function' ? updater(parent) : updater
    }

    const key = path.shift()

    if (typeof key === 'string') {
      if (typeof parent === 'object') {
        return {
          ...parent,
          [key]: doSet(parent[key]),
        }
      }
      return {
        [key]: doSet(),
      }
    }

    if (typeof key === 'number') {
      if (Array.isArray(parent)) {
        const prefix = parent.slice(0, key)
        return [
          ...(prefix.length ? prefix : new Array(key)),
          doSet(parent[key]),
          ...parent.slice(key + 1),
        ]
      }
      return [...new Array(key), doSet()]
    }

    throw new Error('Uh oh!')
  }

  return doSet(obj)
}

function getFieldID(str) {
  return makePathArray(str).join('_')
}

const reFindNumbers0 = /^(\d*)$/gm
const reFindNumbers1 = /\.(\d*)\./gm
const reFindNumbers2 = /^(\d*)\./gm
const reFindNumbers3 = /\.(\d*$)/gm
const reFindMultiplePeriods = /\.{2,}/gm

function makePathArray(str) {
  return str
    .replace('[', '')
    .replace(']', '.')
    .replace(reFindNumbers0, '__int__$1')
    .replace(reFindNumbers1, '.__int__$1.')
    .replace(reFindNumbers2, '__int__$1.')
    .replace(reFindNumbers3, '.__int__$1')
    .replace(reFindMultiplePeriods, '.')
    .split('.')
    .map(d => {
      if (d.indexOf('__int__') === 0) {
        return parseInt(d.substring('__int__'.length), 10)
      }
      return d
    })
}

function loopObject(obj, fn, callback) {
  Object.keys(obj).forEach(key => {
    callback(fn(obj[key], key), key)
  })
}

function someObject(obj, fn) {
  let found = false

  loopObject(obj, fn, (result, key) => {
    if (found) {
      return
    }
    if (result) {
      found = true
    }
  })

  return found
}
