export const SET_FORM_STATE = 'SET_FORM_STATE';
export function setFormState( formState ) {
  return { type: SET_FORM_STATE, formState };
}

export const SET_VALUE = 'SET_VALUE';
export function setValue( field, value ) {
  return { type: SET_VALUE, field, value };
}

export const SET_ALL_VALUES = 'SET_ALL_VALUES';
export function setAllValues( values ) {
  return { type: SET_ALL_VALUES, values };
}

export const FORMAT = 'FORMAT';
export function format( field, fmt ) {
  return { type: FORMAT, field, format: fmt };
}

export const SET_ERROR = 'SET_ERROR';
export function setError( field, error ) {
  return { type: SET_ERROR, field, error };
}

export const SET_WARNING = 'SET_WARNING';
export function setWarning( field, warning ) {
  return { type: SET_WARNING, field, warning };
}

export const SET_SUCCESS = 'SET_SUCCESS';
export function setSuccess( field, success ) {
  return { type: SET_SUCCESS, field, success };
}

export const SET_ASYNC_ERROR = 'SET_ASYNC_ERROR';
export function setAsyncError( field, error ) {
  return { type: SET_ASYNC_ERROR, field, error };
}

export const SET_ASYNC_WARNING = 'SET_ASYNC_WARNING';
export function setAsyncWarning( field, warning ) {
  return { type: SET_ASYNC_WARNING, field, warning };
}

export const SET_ASYNC_SUCCESS = 'SET_ASYNC_SUCCESS';
export function setAsyncSuccess( field, success ) {
  return { type: SET_ASYNC_SUCCESS, field, success };
}

export const REMOVE_ASYNC_ERROR = 'REMOVE_ASYNC_ERROR';
export function removeAsyncError( field ) {
  return { type: REMOVE_ASYNC_ERROR, field };
}

export const REMOVE_ASYNC_WARNING = 'REMOVE_ASYNC_WARNING';
export function removeAsyncWarning( field ) {
  return { type: REMOVE_ASYNC_WARNING, field };
}

export const REMOVE_ASYNC_SUCCESS = 'REMOVE_ASYNC_SUCCESS';
export function removeAsyncSuccess( field ) {
  return { type: REMOVE_ASYNC_SUCCESS, field };
}

export const SET_TOUCHED = 'SET_TOUCHED';
export function setTouched( field, touched ) {
  return { type: SET_TOUCHED, field, touched };
}

export const SET_ALL_TOUCHED = 'SET_ALL_TOUCHED';
export function setAllTouched( touched ) {
  return { type: SET_ALL_TOUCHED, touched };
}

export const RESET = 'RESET';
export function reset( field ) {
  return { type: RESET, field };
}

export const RESET_ALL = 'RESET_ALL';
export function resetAll() {
  return { type: RESET_ALL };
}

export const CLEAR_ALL = 'CLEAR_ALL';
export function clearAll() {
  return { type: CLEAR_ALL };
}

export const PRE_VALIDATE = 'PRE_VALIDATE';
export function preValidate() {
  return { type: PRE_VALIDATE };
}

export const VALIDATE = 'VALIDATE';
export function validate() {
  return { type: VALIDATE };
}

export const SUBMIT = 'SUBMIT';
export function submit() {
  return { type: SUBMIT };
}

export const SUBMITTED = 'SUBMITTED';
export function submitted() {
  return { type: SUBMITTED };
}

export const SUBMITS = 'SUBMITS';
export function submits() {
  return { type: SUBMITS };
}

export const VALIDATING_FIELD = 'VALIDATING_FIELD';
export function validatingField( field ) {
  return { type: VALIDATING_FIELD, field };
}

export const DONE_VALIDATING_FIELD = 'DONE_VALIDATING_FIELD';
export function doneValidatingField( field ) {
  return { type: DONE_VALIDATING_FIELD, field };
}

export const VALIDATION_FAILURE = 'VALIDATION_FAILURE';
export function validationFailure( field, error ) {
  return { type: VALIDATION_FAILURE, field, error };
}

export const VALIDATION_SUCCESS = 'VALIDATION_SUCCESS';
export function validationSuccess( field ) {
  return { type: VALIDATION_SUCCESS, field };
}

export function asyncValidate( field, validators = () => { return {}; } ) {
  return async (dispatch, getState) => {
    // Field could be array, if so we pull of the first param
    const fld = Array.isArray(field) ? field[0] : field
    // Only validate if there exists an async validator for this field
    if ( validators[fld] ) {
      // We are validating the specified field
      dispatch( validatingField( field ) );
      try {
        // Call the asyncrounous validation function
        const result = await validators[fld](getState().values[fld]);
        // TODO null check on result??? Should we make the user return object
        // Dispatch the setters for error, success and warning if they exsit on object
        if ( result.hasOwnProperty('error') ) {
          dispatch(setAsyncError(field, result.error));
        }
        if ( result.hasOwnProperty('warning') ) {
          dispatch(setAsyncWarning(field, result.warning));
        }
        if ( result.hasOwnProperty('success') ) {
          dispatch(setAsyncSuccess(field, result.success));
        }
        // We successfully validated so dispatch
        dispatch(validationSuccess(field));
      } catch ( e ) {
        dispatch(validationFailure(field, e));
      }
      dispatch( doneValidatingField( field ) );
    }
  };
}
