import React from 'react'
//
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
  debug,
}) {
  let [{ values, meta, __fieldMeta }, setState] = React.useState(() =>
    makeState({
      values: defaultValues,
    })
  )

  const { isSubmitting, isTouched } = meta

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

  const apiRef = React.useRef()

  // We want the apiRef to change every time state updates
  apiRef.current = React.useMemo(
    () => ({
      values,
      meta,
      __fieldMeta,
      debug,
    }),
    [debug, __fieldMeta, meta, values]
  )

  const metaRef = React.useRef({})
  const __fieldMetaRefsRef = React.useRef({})

  apiRef.current.__fieldMetaRefs = __fieldMetaRefsRef.current
  apiRef.current.onSubmit = onSubmit

  apiRef.current.reset = React.useCallback(() => {
    setState(() =>
      makeState({
        values: defaultValues,
      })
    )
  }, [defaultValues, setState])

  // On submit
  apiRef.current.handleSubmit = React.useCallback(async e => {
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

  const validateRef = React.useRef()
  validateRef.current = validate

  // Create a debounce for this field hook instance (not all instances)
  apiRef.current.debounce = useAsyncDebounce()

  apiRef.current.setMeta = React.useCallback(
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

  apiRef.current.runValidation = React.useCallback(async () => {
    if (!validateRef.current) {
      return
    }
    apiRef.current.setMeta({ validating: true })

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
      apiRef.current.setMeta({ validating: false })
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

  // When the form gets dirty and when the value changes
  // validate
  React.useEffect(() => {
    if (!validatePristine && !isTouched) {
      return
    }

    apiRef.current.runValidation(values)
  }, [isTouched, validatePristine, values])

  apiRef.current.getFieldValue = React.useCallback(
    field => getBy(apiRef.current.values, field),
    []
  )

  apiRef.current.getFieldMeta = React.useCallback(field => {
    const fieldID = getFieldID(field)
    apiRef.current.__fieldMeta[fieldID] =
      apiRef.current.__fieldMeta[fieldID] || {}
    return apiRef.current.__fieldMeta[fieldID]
  }, [])

  apiRef.current.__getFieldMetaRef = React.useCallback(field => {
    const fieldID = getFieldID(field)
    if (!apiRef.current.__fieldMetaRefs[fieldID]) {
      apiRef.current.__fieldMetaRefs[fieldID] = { current: {} }
    }
    return apiRef.current.__fieldMetaRefs[fieldID]
  }, [])

  apiRef.current.setFieldMeta = React.useCallback(
    (field, updater) => {
      const fieldID = getFieldID(field)
      setState(old => ({
        ...old,
        __fieldMeta: {
          [fieldID]:
            typeof updater === 'function'
              ? updater(old.__fieldMeta[fieldID])
              : { ...old.__fieldMeta[fieldID], ...updater },
        },
      }))
    },
    [setState]
  )

  apiRef.current.setFieldValue = React.useCallback(
    (field, updater, { isTouched = true } = {}) => {
      setState(old => ({
        ...old,
        values: setBy(
          old.values,
          field,
          typeof updater === 'function'
            ? updater(getBy(old.values, field))
            : updater
        ),
      }))
      if (isTouched) {
        apiRef.current.setFieldMeta(field, {
          isTouched: true,
        })
        apiRef.current.setMeta({ isTouched: true })
      }
    },
    [setState]
  )

  apiRef.current.pushFieldValue = React.useCallback((field, value, options) => {
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

  apiRef.current.insertFieldValue = React.useCallback(
    (field, index, value, options) => {
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
    },
    []
  )

  apiRef.current.removeFieldValue = React.useCallback(
    (field, index, options) => {
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
    },
    []
  )

  apiRef.current.swapFieldValues = React.useCallback(
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

  apiRef.current.setValues = React.useCallback(
    values => {
      setState(old => ({
        ...old,
        values: values,
      }))
    },
    [setState]
  )

  // When defaultValues update, set them
  React.useEffect(() => {
    if (defaultValues !== apiRef.current.values) {
      setState(old => ({
        ...old,
        values: defaultValues,
      }))
    }
  }, [defaultValues, setState])

  const FormRef = React.useRef()

  if (!FormRef.current) {
    FormRef.current = makeForm()
  }

  // Pass the full context to the form element
  apiRef.current.Form = FormRef.current
  apiRef.current.Form.contextValue = apiRef.current

  // Return the root form and the Form component to the hook user
  return apiRef.current
}

export function useFormContext() {
  let formApi = React.useContext(formContext)

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

const defaultDefaultMeta = {}
export function useField(
  fieldName,
  {
    defaultValue,
    defaultIsTouched = false,
    defaultError = null,
    defaultMeta = defaultDefaultMeta,
    validatePristine,
    validate,
  } = {}
) {
  if (!fieldName) {
    throw new Error(
      `useField: A field is required to use this hook. eg, useField('myField', options)`
    )
  }

  let formApi = useFormContext()

  // Support field prefixing from FieldScope
  let fieldPrefix = ''

  if (formApi.fieldName) {
    // This is okay because any `.[`'s will get replace to just `.`
    fieldPrefix = `${formApi.fieldName}.`
    formApi = formApi.form
  }

  fieldName = fieldPrefix + fieldName

  const formApiRef = React.useRef()
  const apiRef = React.useRef({})

  // An escape hatch for accessing latest formAPI
  formApiRef.current = formApi

  const preValue = formApi.getFieldValue(fieldName)
  const preMeta = formApi.getFieldMeta(fieldName)
  const __metaRef = formApi.__getFieldMetaRef(fieldName)

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

  // Handle default values
  const value = React.useMemo(
    () =>
      typeof preValue === 'undefined' && typeof defaultValue !== 'undefined'
        ? defaultValue
        : preValue,
    [defaultValue, preValue]
  )

  React.useEffect(() => {
    if (typeof preValue === 'undefined' && typeof value !== 'undefined') {
      setValue(value, { isTouched: false })
    }
  }, [preValue, setValue, value])

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

  React.useEffect(() => {
    if (typeof preMeta === 'undefined' && typeof meta !== 'undefined') {
      setMeta(meta)
    }
  }, [meta, preMeta, setMeta, setValue, value])

  apiRef.current = React.useMemo(
    () => ({
      value,
      meta,
      form: formApi,
      fieldName,
    }),
    [fieldName, formApi, meta, value]
  )

  Object.assign(apiRef.current, {
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
  })

  const validateRef = React.useRef()
  validateRef.current = validate

  // Create a debounce for this field hook instance (not all instances)
  apiRef.current.debounce = useAsyncDebounce()

  apiRef.current.runValidation = React.useCallback(async () => {
    if (!validateRef.current) {
      return
    }
    setMeta({ validating: true })

    // Use the validationCount for all field instances to
    // track freshness of the validation
    const id = (__metaRef.current.validationCount || 0) + 1
    __metaRef.current.validationCount = id

    const checkLatest = () => id === __metaRef.current.validationCount

    const error = await validateRef.current(
      apiRef.current.value,
      apiRef.current
    )

    if (checkLatest()) {
      setMeta({ validating: false })
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
  }, [__metaRef, setMeta])

  // When the form gets dirty and when the value changes
  // validate
  React.useEffect(() => {
    if (!validatePristine && !meta.isTouched) {
      return
    }

    apiRef.current.runValidation(value)
  }, [meta.isTouched, validatePristine, value])

  const FieldScopeRef = React.useRef()

  // Provide a FieldScope for nested field syntax
  if (!FieldScopeRef.current) {
    FieldScopeRef.current = makeField()
  }

  apiRef.current.FieldScope = FieldScopeRef.current
  apiRef.current.FieldScope.contextValue = apiRef.current

  return apiRef.current
}

function makeForm() {
  return function Form({ children, noFormElement, ...rest }) {
    const {
      handleSubmit,
      meta: { isSubmitting },
      debug,
    } = Form.contextValue

    return (
      <formContext.Provider value={Form.contextValue}>
        {noFormElement ? (
          children
        ) : (
          <form onSubmit={handleSubmit} disabled={isSubmitting} {...rest}>
            {children}
            {debug ? (
              <pre>
                <code>{JSON.stringify(Form.contextValue, null, 2)}</code>
              </pre>
            ) : null}
          </form>
        )}
      </formContext.Provider>
    )
  }
}

function makeField() {
  return function Field({ children }) {
    return (
      <formContext.Provider value={Field.contextValue}>
        {children}
      </formContext.Provider>
    )
  }
}

export function splitFormProps({
  field,
  defaultValue,
  defaultIsTouched,
  defaultError,
  defaultMeta,
  validatePristine,
  validate,
  ...rest
}) {
  return [
    {
      field,
      defaultValue,
      defaultIsTouched,
      defaultError,
      defaultMeta,
      validatePristine,
      validate,
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
