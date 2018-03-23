import {
  SET_FORM_STATE,
  SET_VALUE,
  SET_ALL_VALUES,
  SET_ERROR,
  SET_WARNING,
  SET_SUCCESS,
  SET_TOUCHED,
  SET_ALL_TOUCHED,
  SUBMITS,
  SUBMITTED,
  SUBMITTING,
  RESET,
  RESET_ALL,
  CLEAR_ALL,
  VALIDATING_FIELD,
  DONE_VALIDATING_FIELD,
  VALIDATION_FAILURE,
  VALIDATION_SUCCESS,
  SET_ASYNC_ERROR,
  SET_ASYNC_WARNING,
  SET_ASYNC_SUCCESS
} from './actions'

import Utils from '../utils'

const INITIAL_STATE = {
  values: {},
  touched: {},
  errors: undefined,
  warnings: undefined,
  successes: undefined,
  asyncErrors: undefined,
  asyncWarnings: undefined,
  asyncSuccesses: undefined,
  validating: undefined,
  validationFailed: undefined,
  validationFailures: 0,
  asyncValidations: 0,
  submitted: false,
  submits: 0,
  submitting: false
}

const setFormState = (state, { payload }) => ({ ...INITIAL_STATE, ...payload })

const setValue = (state, { payload: { field, value } }) => {
  const newValues = Utils.set(Utils.clone(state.values), field, value)
  return {
    ...state,
    values: newValues,
  }
}

// This should REPLACE all values. if that's not intended, we should
// add a `setValues` method
const setAllValues = (state, { payload: values }) => ({
  ...state,
  values,
})

const setTouched = (state, { payload: { field, value } }) => {
  const newTouched = Utils.set(Utils.clone(state.touched), field, value, true)
  return {
    ...state,
    touched: newTouched,
  }
}

const setAllTouched = (state, { payload: touched }) => ({
  ...state,
  touched,
})

const setError = (state, { payload: { field = '__root', value } }) => {
  const newErrors = Utils.cleanError(Utils.set(Utils.clone(state.errors), field, value, true))
  return {
    ...state,
    errors: newErrors,
  }
}

const setWarning = (state, { payload: { field = '__root', value } }) => {
  const newWarnings = Utils.cleanError(Utils.set(Utils.clone(state.warnings), field, value, true))
  return {
    ...state,
    warnings: newWarnings
  }
}

const setSuccess = (state, { payload: { field = '__root', value } }) => {
  const newSuccesses = Utils.cleanError(Utils.set(Utils.clone(state.successes), field, value, true))
  return {
    ...state,
    successes: newSuccesses
  }
}

const setAsyncWarning = (state, { payload: { field = '__root', value } }) => {
  const newWarnings = Utils.cleanError(
    Utils.set(Utils.clone(state.asyncWarnings), field, value, true)
  )
  return {
    ...state,
    asyncWarnings: newWarnings
  }
}

const setAsyncError = (state, { payload: { field = '__root', value } }) => {
  const newErrors = Utils.cleanError(Utils.set(Utils.clone(state.asyncErrors), field, value, true))
  return {
    ...state,
    asyncErrors: newErrors
  }
}

const setAsyncSuccess = (state, { payload: { field = '__root', value } }) => {
  const newSuccesses = Utils.cleanError(
    Utils.set(Utils.clone(state.asyncSuccesses), field, value, true)
  )

  return {
    ...state,
    asyncSuccesses: newSuccesses
  }
}

const validatingField = (state, { payload: field = '__root' }) => {
  let validating = Utils.clone(state.validating)
  let asyncValidations = state.asyncValidations

  // Only incriment validations if this field is going from falsey to true
  asyncValidations = !Utils.get(validating, field) ? asyncValidations + 1 : asyncValidations

  validating = Utils.cleanError(Utils.set(validating, field, true))

  return {
    ...state,
    asyncValidations,
    validating
  }
}

const doneValidatingField = (state, { payload: field = '__root' }) => {
  let validating = Utils.clone(state.validating)
  let asyncValidations = state.asyncValidations

  // Only incriment validations if this field is going from falsey to true
  asyncValidations = Utils.get(validating, field) ? asyncValidations - 1 : asyncValidations

  validating = Utils.cleanError(Utils.set(validating, field, false))

  return {
    ...state,
    asyncValidations,
    validating
  }
}

const validationFailure = (state, { payload: { field = '__root', value } }) => {
  let validationFailed = Utils.clone(state.validationFailed)
  let validationFailures = state.validationFailures

  // Only incriment validations if this field is going from falsey to true
  validationFailures = !Utils.get(validationFailed, field)
    ? validationFailures + 1
    : validationFailures

  validationFailed = Utils.cleanError(Utils.set(validationFailed, field, value))

  return {
    ...state,
    validationFailures,
    validationFailed
  }
}

const validationSuccess = (state, { payload: field = '__root' }) => {
  let validationFailed = Utils.clone(state.validationFailed)
  let validationFailures = state.validationFailures

  // Only devcriment faulures if this field is going from true to false
  validationFailures = Utils.get(validationFailed, field)
    ? validationFailures - 1
    : validationFailures

  validationFailed = Utils.cleanError(Utils.set(validationFailed, field, false))

  return {
    ...state,
    validationFailures,
    validationFailed
  }
}

const submits = state => ({
  ...state,
  submits: state.submits + 1
})

const submitted = state => ({
  ...state,
  submitted: true
})

const submitting = (state, { payload: submitting }) => ({
  ...state,
  submitting
})

const reset = (state, { payload: { field = '__root' } }) => {
  const newState = Utils.clone(state)

  Utils.set(newState.values, field, undefined)
  Utils.set(newState.touched, field, undefined)
  Utils.set(newState.errors, field, undefined)
  Utils.set(newState.warnings, field, undefined)
  Utils.set(newState.successes, field, undefined)
  Utils.set(newState.asyncErrors, field, undefined)
  Utils.set(newState.asyncWarnings, field, undefined)
  Utils.set(newState.asyncSuccesses, field, undefined)

  return {
    ...state,
    ...newState
  }
}

//

export default function BuildReducer ({ defaultValues = {}, values = {} }) {
  const COMBINED_INITIAL_STATE = {
    ...INITIAL_STATE,
    values: {
      ...defaultValues,
      ...values
    }
  }

  const reducer = (state = COMBINED_INITIAL_STATE, action) => {
    switch (action.type) {
      case SET_FORM_STATE:
        return setFormState(state, action)
      case SET_VALUE:
        return setValue(state, action)
      case SET_ALL_VALUES:
        return setAllValues(state, action)
      case SET_ERROR:
        return setError(state, action)
      case SET_WARNING:
        return setWarning(state, action)
      case SET_SUCCESS:
        return setSuccess(state, action)
      case SET_ASYNC_ERROR:
        return setAsyncError(state, action)
      case SET_ASYNC_WARNING:
        return setAsyncWarning(state, action)
      case SET_ASYNC_SUCCESS:
        return setAsyncSuccess(state, action)
      case SET_TOUCHED:
        return setTouched(state, action)
      case SET_ALL_TOUCHED:
        return setAllTouched(state, action)
      case SUBMITTED:
        return submitted(state, action)
      case SUBMITS:
        return submits(state, action)
      case SUBMITTING:
        return submitting(state, action)
      case RESET:
        return reset(state, action)
      case RESET_ALL:
        return COMBINED_INITIAL_STATE
      case CLEAR_ALL:
        return INITIAL_STATE
      case VALIDATION_FAILURE:
        return validationFailure(state, action)
      case VALIDATION_SUCCESS:
        return validationSuccess(state, action)
      case DONE_VALIDATING_FIELD:
        return doneValidatingField(state, action)
      case VALIDATING_FIELD:
        return validatingField(state, action)
      default:
        return state
    }
  }

  return reducer
}
