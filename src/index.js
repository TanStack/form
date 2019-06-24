import React from 'react'
import immer from 'immer'
//
import usePrevious from 'hooks/usePrevious'

const formContext = React.createContext()

function useImmer(initialState) {
  let [state, originalSetState] = React.useState(initialState)

  const setState = React.useCallback(value => {
    originalSetState(old => {
      if (typeof value === 'function') {
        value = immer(old, value)
      }
      return value
    })
  }, [])

  return [state, setState]
}

function makeState(decor) {
  return {
    fieldErrors: null,
    formErrors: null,
    info: {},
    touched: {},
    validating: {},
    submitting: false,
    dirty: false,
    submitted: false,
    submitAttempts: 0,
    ...decor
  }
}

export function useForm({ onSubmit, defaultValues, validate }) {
  defaultValues = React.useMemo(() => defaultValues || {}, [defaultValues])

  let [
    {
      values,
      fieldErrors,
      formErrors,
      info,
      touched,
      validating,
      submitting,
      dirty,
      submitted,
      submitAttempts
    },
    setState
  ] = useImmer(
    makeState({
      values: defaultValues
    })
  )

  fieldErrors = React.useMemo(() => cleanErrors(fieldErrors), [fieldErrors])
  formErrors = React.useMemo(() => cleanErrors(formErrors), [formErrors])

  const errors = React.useMemo(() => fieldErrors || formErrors, [
    fieldErrors,
    formErrors
  ])

  const canSubmit = errors === null

  const formRef = React.useRef({})
  const fieldsRef = React.useRef([])
  const validateRef = React.useRef()
  validateRef.current = validate

  const __registerField = React.useCallback(fieldContext => {
    fieldsRef.current = [...fieldsRef.current, fieldContext]
    return () => {
      fieldsRef.current = fieldsRef.current.filter(d => d !== fieldContext)
    }
  }, [])

  const runFieldValidation = React.useCallback(() => {
    return fieldsRef.current.find(fieldContext => {
      const validationError = cleanErrors(
        fieldContext.field.runValidation({
          bypassTouch: true
        })
      )
      if (validationError) {
        return validationError
      }
    })
  }, [])

  const runValidation = React.useCallback(() => {
    const validationErrors = validateRef.current
      ? cleanErrors(validateRef.current(values, formRef.current))
      : null
    setState(draft => {
      draft.formErrors = validationErrors
    })
    return validationErrors
  }, [values, setState])

  const reset = React.useCallback(() => {
    setState(() =>
      makeState({
        values: defaultValues
      })
    )
  }, [defaultValues, setState])

  // On submit
  const handleSubmit = React.useCallback(
    async e => {
      e.persist()
      e.preventDefault()

      if (e.__handled) {
        return
      }

      e.__handled = true

      setState(old => {
        old.dirty = true
        old.submitted = true
        old.submitAttempts += 1
      })

      // Don't allow submitting
      if (submitting) {
        return
      }

      // Check field validations
      if (runFieldValidation()) {
        return
      }

      // Check validation
      if (runValidation()) {
        return
      }

      setState(draft => {
        draft.submitting = true
      })

      try {
        // Run the submit code
        await onSubmit(values, formRef.current)
      } catch (err) {
        throw err
      } finally {
        setState(draft => {
          draft.submitting = false
        })
      }
    },
    [setState, submitting, runFieldValidation, runValidation, onSubmit, values]
  )

  const getByOn = base => field => {
    return getBy(base, field)
  }

  const getValue = React.useCallback(getByOn(values), [values])
  const getError = React.useCallback(getByOn(errors), [errors])
  const getInfo = React.useCallback(getByOn(info), [info])
  const getValidating = React.useCallback(getByOn(validating), [validating])
  const getTouched = React.useCallback(
    field => {
      if (submitted) {
        return true
      }
      return getBy(touched, field, true)
    },
    [touched, submitted]
  )

  const setByOn = key => (field, value) => {
    setState(draft => {
      setBy(draft, [key, field], value)
    })
  }

  const setError = React.useCallback(setByOn('fieldErrors'), [setState])
  const setInfo = React.useCallback(setByOn('info'), [setState])
  const setValidating = React.useCallback(setByOn('validating'), [setState])
  const setValue = React.useCallback(
    (field, value, bypassTouch) => {
      setState(draft => {
        setBy(draft.values, field, value)
        if (!bypassTouch) {
          draft.dirty = true
          setBy(draft.touched, field, true)
        }
      })
    },
    [setState]
  )

  const setTouched = React.useCallback(
    (field, value) => {
      setState(draft => {
        draft.dirty = true
        setBy(draft.touched, field, value)
      })
    },
    [setState]
  )

  const pushField = React.useCallback(
    (path, value) => {
      setState(draft => {
        const old = getBy(draft.values, path)
        setBy(draft.values, [path, Array.isArray(old) ? old.length : 0], value)
      })
    },
    [setState]
  )

  const insertField = React.useCallback(
    (path, index, value) => {
      setState(draft => {
        const old = getBy(draft.values, path)
        if (Array.isArray(old)) {
          old.splice(index, 0, value)
        } else {
          throw new Error(
            `You are trying to insert a new field on a non-array parent field at path: ${path} index: ${index} with value ${value}`
          )
        }
      })
    },
    [setState]
  )

  const removeField = React.useCallback(
    (path, key) => {
      setState(draft => {
        const old = getBy(draft.values, path)
        if (Array.isArray(old)) {
          old.splice(key, 1)
        } else if (typeof old === 'object') {
          delete old[key]
        }
      })
    },
    [setState]
  )

  const swapFields = React.useCallback(
    (path, index1, index2) => {
      setState(draft => {
        const old = getBy(draft.values, path)
        const old1 = getBy(draft.values, [path, index1])
        const old2 = getBy(draft.values, [path, index2])
        if (Array.isArray(old)) {
          setBy(draft.values, [path, index1], old2)
          setBy(draft.values, [path, index2], old1)
        } else {
          throw new Error(
            `You are trying to swap field values on a non-array parent field at path: ${path} index1: ${index1} index2: ${index2}`
          )
        }
      })
    },
    [setState]
  )

  const setValues = React.useCallback(
    values => {
      setState(draft => {
        draft.values = values
      })
    },
    [setState]
  )

  // When values update, and there are no field-level errors, run validation
  React.useEffect(() => {
    if (!fieldErrors) {
      runValidation()
    }
  }, [fieldErrors, runValidation, values])

  const previousDefaultValues = usePrevious(defaultValues)

  // When defaultValues update, set them
  React.useEffect(() => {
    if (defaultValues === values) {
      return
    }
    if (previousDefaultValues !== defaultValues) {
      setState(draft => {
        draft.values = defaultValues
      })
    }
  }, [defaultValues, previousDefaultValues, setState, values])

  const scope = React.useMemo(
    () => ({
      reset,
      getValue,
      getError,
      getInfo,
      getTouched,
      getValidating,
      setValue,
      setError,
      setInfo,
      setTouched,
      setValidating,
      pushField,
      insertField,
      removeField,
      swapFields,
      setValues
    }),
    [
      reset,
      getValue,
      getError,
      getInfo,
      getTouched,
      getValidating,
      setValue,
      setError,
      setInfo,
      setTouched,
      setValidating,
      pushField,
      insertField,
      removeField,
      swapFields,
      setValues
    ]
  )

  formRef.current = React.useMemo(
    () => ({
      form: {
        values,
        errors,
        info,
        touched,
        validating,
        submitting,
        setState,
        canSubmit,
        handleSubmit,
        runValidation,
        dirty,
        submitted,
        submitAttempts,
        __registerField,
        // Pass the root scope methods to the form
        ...scope
      },
      // Then pass them as the root scope
      scope,
      fieldPath: []
    }),
    [
      values,
      errors,
      info,
      touched,
      validating,
      submitting,
      setState,
      canSubmit,
      handleSubmit,
      runValidation,
      dirty,
      submitted,
      submitAttempts,
      __registerField,
      scope
    ]
  )

  // Set up a persistant form element
  const FormComponentRef = React.useRef()

  if (!FormComponentRef.current) {
    FormComponentRef.current = makeForm()
  }

  // Pass the full context to the form element
  FormComponentRef.current.contextValue = formRef.current

  // Return the root form and the Form component to the hook user
  return React.useMemo(
    () => ({
      ...formRef.current.form,
      Form: FormComponentRef.current
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formRef.current.form]
  )
}

function useFormContext() {
  let context = React.useContext(formContext)

  if (!context) {
    throw new Error(
      `You are trying to use the form or field API outside of a form!`
    )
  }

  return context
}

export function useField(
  fieldName,
  { defaultValue, validate, validateOnMount } = {}
) {
  if (!fieldName) {
    throw new Error(
      `useField: A field is required to use this hook. eg, useField('myField', options)`
    )
  }

  let context = useFormContext()

  // Proxy's the field API for a new parent field context

  // At this point, the form API get's proxied to behave for both
  // the new scope level and for the pre-bound field specific methods.
  // This gives us three versions of the API: form (root), scope, and field
  // each with it's own conveniences.
  context = React.useMemo(() => {
    const parentScope = context.scope

    const field = {
      value: parentScope.getValue(fieldName),
      error: parentScope.getError(fieldName),
      info: parentScope.getInfo(fieldName),
      touched: parentScope.getTouched(fieldName),
      validating: parentScope.getValidating(fieldName),
      setValue: (value, bypassTouch) =>
        parentScope.setValue(fieldName, value, bypassTouch),
      setError: value => parentScope.setError(fieldName, value),
      setInfo: value => parentScope.setInfo(fieldName, value),
      setTouched: value => parentScope.setTouched(fieldName, value),
      setValidating: value => parentScope.setValidating(fieldName, value),
      pushField: value => parentScope.pushField(fieldName, value),
      insertField: value => parentScope.insertField(fieldName, value),
      removeField: value => parentScope.removeField(fieldName, value),
      swapFields: (value1, value2) =>
        parentScope.swapFields(fieldName, value1, value2)
    }

    const scope = {
      ...field,
      getValue: subField => getBy(field.value, subField),
      getError: subField => getBy(field.error, subField),
      getInfo: subField => getBy(field.info, subField),
      getTouched: subField => getBy(field.touched, subField, true),
      getValidating: subField => getBy(field.validating, subField),
      setValue: (subField, value, bypassTouch) =>
        parentScope.setValue([fieldName, subField], value, bypassTouch),
      setError: (subField, value) =>
        parentScope.setError([fieldName, subField], value),
      setInfo: (subField, value) =>
        parentScope.setInfo([fieldName, subField], value),
      setTouched: (subField, value) =>
        parentScope.setTouched([fieldName, subField], value),
      setValidating: (subField, value) =>
        parentScope.setValidating([fieldName, subField], value),
      pushField: (subField, value) =>
        parentScope.pushField([fieldName, subField], value),
      insertField: (subField, value) =>
        parentScope.insertField([fieldName, subField], value),
      removeField: (subField, value) =>
        parentScope.removeField([fieldName, subField], value),
      swapFields: (subField, value1, value2) =>
        parentScope.swapFields([fieldName, subField], value1, value2)
    }

    return {
      ...context,
      scope,
      field,
      fieldPath: [...context.fieldPath, fieldName],
      fieldName: fieldName
    }
  }, [context, fieldName])

  const {
    field: { value, touched, setValue, setError }
  } = context

  const validateRef = React.useRef()
  validateRef.current = validate

  const runSyncValidation = React.useCallback(() => {
    const validationError = cleanErrors(validateRef.current(value, context))
    setError(validationError)
    return validationError
  }, [context, setError, value])

  const runValidation = React.useCallback(
    ({ bypassTouch } = {}) => {
      if (
        validateRef.current &&
        (validateOnMount || (bypassTouch ? true : touched))
      ) {
        const validationErrors = runSyncValidation()
        if (validationErrors) {
          return validationErrors
        }
      }
    },
    [runSyncValidation, touched, validateOnMount]
  )

  Object.assign(context.field, {
    runValidation
  })

  // When the value changes, run field-level validation
  React.useEffect(() => {
    runValidation()
  }, [value, touched, runValidation])

  // Queue up an effect to update the value to the default
  // value if needed
  React.useEffect(() => {
    if (typeof value === 'undefined' && typeof defaultValue !== 'undefined') {
      setValue(defaultValue, true)
    }
  }, [value, defaultValue, setValue])

  // Additionally, pass that default value down if needed
  context.field.value = React.useMemo(
    () =>
      typeof context.field.value === 'undefined'
        ? defaultValue
        : context.field.value,
    [context.field.value, defaultValue]
  )

  React.useEffect(() => {
    return context.form.__registerField(context)
  }, [context])

  const FieldRef = React.useRef()

  if (!FieldRef.current) {
    FieldRef.current = makeField()
  }

  FieldRef.current.contextValue = context

  return {
    ...context,
    Field: FieldRef.current
  }
}

export function makeForm() {
  return function Form({ children, noFormElement, ...rest }) {
    const {
      form: { handleSubmit, submitting }
    } = Form.contextValue

    return (
      <formContext.Provider value={Form.contextValue}>
        {noFormElement ? (
          children
        ) : (
          <form onSubmit={handleSubmit} disabled={submitting} {...rest}>
            {children}
          </form>
        )}
      </formContext.Provider>
    )
  }
}

export function makeField() {
  return function Field({ children, ...rest }) {
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
  validate,
  validateOnMount,
  ...rest
}) {
  return [
    {
      field,
      defaultValue,
      validate,
      validateOnMount
    },
    rest
  ]
}

// Utils

function getBy(obj, path, inheritTrue) {
  if (!path) {
    throw new Error('A path is required to use getBy')
  }
  const pathArray = makePathArray(path)
  const pathObj = pathArray
  return pathObj.reduce((current, pathPart) => {
    if (typeof current !== 'undefined') {
      if (
        current === true &&
        inheritTrue &&
        typeof current[pathPart] === 'undefined'
      ) {
        return current
      } else if (current[pathPart] !== 'null') {
        return current[pathPart]
      }
    }
    return undefined
  }, obj)
}

function setBy(obj, path, value, deleteWhenFalsey) {
  if (!path) {
    throw new Error('A path is required to use setBy')
  }

  const keys = makePathArray(path)

  let cursor = obj

  while (keys.length > 1) {
    const key = keys[0]
    const nextKey = keys[1]
    if (typeof nextKey === 'number' && !Array.isArray(cursor[key])) {
      cursor[key] = []
    }
    if (
      typeof nextKey !== 'number' &&
      (typeof cursor[key] !== 'object' || cursor[key] === null)
    ) {
      cursor[key] = {}
    }
    cursor = cursor[key]
    keys.shift()
  }

  if (!value && deleteWhenFalsey) {
    delete cursor[keys[0]]
  } else {
    cursor[keys[0]] = value
  }

  return obj
}

function makePathArray(obj) {
  let path = []
  const flat = flattenDeep(obj)
  flat.forEach(part => {
    if (typeof part === 'string') {
      path = path.concat(
        part
          .replace(/\[(\d*)\]/gm, '.__int__$1')
          .replace('[', '.')
          .replace(']', '')
          .split('.')
          .map(d => {
            if (d.indexOf('__int__') === 0) {
              return parseInt(d.substring('__int__'.length), 10)
            }
            return d
          })
      )
    } else {
      path.push(part)
    }
  })
  return path.filter(d => typeof d !== 'undefined')
}

function flattenDeep(arr, newArr = []) {
  if (!Array.isArray(arr)) {
    newArr.push(arr)
  } else {
    for (let i = 0; i < arr.length; i++) {
      flattenDeep(arr[i], newArr)
    }
  }
  return newArr
}

function cleanErrors(obj) {
  if (!obj) {
    return undefined
  }
  if (typeof obj === 'object') {
    const newObj = {}
    Object.keys(obj).forEach(key => {
      const val = cleanErrors(obj[key]) // clean nested objects
      if (val) {
        newObj[key] = val
      }
    })
    if (!Object.keys(newObj).length) {
      return undefined
    }
  }
  if (Array.isArray(obj)) {
    const newObj = obj.map(cleanErrors) // clean nested falsey arrays
    if (!newObj.length || newObj.every(d => !d)) {
      return undefined
    }
  }
  return obj
}
