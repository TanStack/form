import Utils from '../utils'

const makeAction = type => payload => ({ type, payload })

export const SET_FORM_STATE = 'SET_FORM_STATE'
export const SET_VALUE = 'SET_VALUE'
export const SET_ALL_VALUES = 'SET_ALL_VALUES'
export const FORMAT = 'FORMAT'
export const SET_ERROR = 'SET_ERROR'
export const SET_WARNING = 'SET_WARNING'
export const SET_SUCCESS = 'SET_SUCCESS'
export const SET_ASYNC_ERROR = 'SET_ASYNC_ERROR'
export const SET_ASYNC_WARNING = 'SET_ASYNC_WARNING'
export const SET_ASYNC_SUCCESS = 'SET_ASYNC_SUCCESS'
export const SET_TOUCHED = 'SET_TOUCHED'
export const SET_ALL_TOUCHED = 'SET_ALL_TOUCHED'
export const RESET = 'RESET'
export const RESET_ALL = 'RESET_ALL'
export const CLEAR_ALL = 'CLEAR_ALL'
export const SUBMIT = 'SUBMIT'
export const SUBMITTED = 'SUBMITTED'
export const SUBMITS = 'SUBMITS'
export const SUBMITTING = 'SUBMITTING'
export const VALIDATING_FIELD = 'VALIDATING_FIELD'
export const DONE_VALIDATING_FIELD = 'DONE_VALIDATING_FIELD'
export const VALIDATION_FAILURE = 'VALIDATION_FAILURE'
export const VALIDATION_SUCCESS = 'VALIDATION_SUCCESS'

export const setFormState = makeAction(SET_FORM_STATE)
export const setValue = makeAction(SET_VALUE)
export const setAllValues = makeAction(SET_ALL_VALUES)
export const format = makeAction(FORMAT)
export const setError = makeAction(SET_ERROR)
export const setWarning = makeAction(SET_WARNING)
export const setSuccess = makeAction(SET_SUCCESS)
export const setAsyncError = makeAction(SET_ASYNC_ERROR)
export const setAsyncWarning = makeAction(SET_ASYNC_WARNING)
export const setAsyncSuccess = makeAction(SET_ASYNC_SUCCESS)
export const setTouched = makeAction(SET_TOUCHED)
export const setAllTouched = makeAction(SET_ALL_TOUCHED)
export const reset = makeAction(RESET)
export const resetAll = makeAction(RESET_ALL)
export const clearAll = makeAction(CLEAR_ALL)
export const submit = makeAction(SUBMIT)
export const submitted = makeAction(SUBMITTED)
export const submits = makeAction(SUBMITS)
export const submitting = makeAction(SUBMITTING)
export const validatingField = makeAction(VALIDATING_FIELD)
export const doneValidatingField = makeAction(DONE_VALIDATING_FIELD)
export const validationFailure = makeAction(VALIDATION_FAILURE)
export const validationSuccess = makeAction(VALIDATION_SUCCESS)

export function preValidate ({ field, validator }) {
  return (dispatch, getState) => {
    if (validator && validator !== Utils.noop) {
      // Call the validation function
      const result = validator(Utils.get(getState().values, field))
      if (typeof result === 'undefined') {
        console.info(
          `You have returned undefined from preValidate for the field: ${field.toString()}. If this was intentional, disregard this message.`
        )
      }
      dispatch(setValue({ field, value: result }))
    }
  }
}

export function validate ({ field, validator }) {
  return (dispatch, getState) => {
    if (!validator || validator === Utils.noop) {
      return
    }
    // Call the validation function and clean the result
    const result = validator(Utils.get(getState().values, field))

    const recurse = (current, path) => {
      // Normalize fieldPath
      path = Utils.makePathArray(path)

      // If it's a non object/array, treat it as an error
      if (!Utils.isObject(current) && !Utils.isArray(current)) {
        // Nested errors aren't allowed if using string errors, so return
        return dispatch(setError({ field: path, value: current }))
      }

      // If it's an error object, set a clean slate
      if (current.error || current.warning || current.success) {
        dispatch(setError({ field: path, value: false }))
        dispatch(setWarning({ field: path, value: false }))
        dispatch(setSuccess({ field: path, value: false }))

        // Now handle accordingly
        if (current.error) {
          dispatch(setError({ field: path, value: current.error }))
        }
        if (current.warning) {
          dispatch(setWarning({ field: path, value: current.warning }))
        }
        if (current.success) {
          dispatch(setSuccess({ field: path, value: current.success }))
        }
        return
      }

      // If result is an array, recurse into each item
      if (Utils.isArray(current)) {
        return current.map((subResult, i) => recurse(subResult, [path, i]))
      }

      // It must be a normal object, recurse on each key to set nested errors!
      Utils.mapObject(current, (subResult, key) => recurse(subResult, [path, key]))
    }

    // Recurse to set all errors
    recurse(result, field)

    return Utils.cleanError(result, { removeSuccess: true })
  }
}

export function asyncValidate ({ field, validator, validationPromiseIDs }) {
  return async (dispatch, getState) => {
    // Only validate if syncronous validation does not exist and there is a validator
    if (!validator || validator === Utils.noop) {
      return
    }
    // We are validating the specified field
    dispatch(validatingField(field))

    const fieldPathArray = Utils.makePathArray(field).join('.')

    // Set up an autoincrementing promise UID for this field on the form
    const uid = (validationPromiseIDs.get(fieldPathArray) || 0) + 1
    validationPromiseIDs.set(fieldPathArray, uid)

    let result

    try {
      // Call the asyncrounous validation function
      result = await validator(Utils.get(getState().values, field))

      if (validationPromiseIDs.get(fieldPathArray) !== uid) {
        // If the promise ID doesn't match we we originally sent, it means a
        // new promise has replaced it. Bail out!
        return
      }

      // Set up the error recursion
      const recurse = (current, path) => {
        // Normalize fieldPath
        path = Utils.makePathArray(path)

        // If it's a non object/array, treat it as an error
        if (!Utils.isObject(current) && !Utils.isArray(current)) {
          // Nested errors aren't allowed if using string errors, so return
          return dispatch(setAsyncError({ field: path, value: current }))
        }

        // If it's an error object, respond accordingly
        if (current.error || current.warning || current.success) {
          dispatch(setAsyncError({ field: path, value: false }))
          dispatch(setAsyncWarning({ field: path, value: false }))
          dispatch(setAsyncSuccess({ field: path, value: false }))
          if (current.error) {
            dispatch(setAsyncError({ field: path, value: current.error }))
          }
          if (current.warning) {
            dispatch(setAsyncWarning({ field: path, value: current.warning }))
          }
          if (current.success) {
            dispatch(setAsyncSuccess({ field: path, value: current.success }))
          }
          return
        }

        // If result is an array, recurse into each item
        if (Utils.isArray(current)) {
          return current.map((subResult, i) => recurse(subResult, [path, i]))
        }

        // It must be a normal object, recurse on each key to set nested errors!
        Utils.mapObject(current, (subResult, key) => recurse(subResult, [path, key]))
      }

      // Handle the error
      recurse(result, field)

      // We successfully validated so dispatch
      dispatch(validationSuccess(field))
    } catch (err) {
      // An validation error happened!
      // Set the error result to true to stop further validation up the chain
      result = true
      dispatch(validationFailure({ field, value: err }))
    }

    // Mark the field as done validating
    dispatch(doneValidatingField(field))

    return Utils.cleanError(result, { removeSuccess: true })
  }
}
