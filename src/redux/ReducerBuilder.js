import {
  SET_FORM_STATE,
  SET_VALUE,
  SET_ALL_VALUES,
  SET_ERROR,
  SET_WARNING,
  SET_SUCCESS,
  SET_TOUCHED,
  SET_ALL_TOUCHED,
  PRE_VALIDATE,
  VALIDATE,
  FORMAT,
  SUBMITS,
  SUBMITTED,
  RESET,
  RESET_ALL,
  CLEAR_ALL,
  VALIDATING_FIELD,
  DONE_VALIDATING_FIELD,
  VALIDATION_FAILURE,
  VALIDATION_SUCCESS,
  SET_ASYNC_ERROR,
  SET_ASYNC_WARNING,
  SET_ASYNC_SUCCESS,
  REMOVE_ASYNC_ERROR,
  REMOVE_ASYNC_WARNING,
  REMOVE_ASYNC_SUCCESS
} from './actions';

import Utils from './utils';

const INITIAL_STATE = {
  values: {},
  touched: {},
  errors: {},
  warnings: {},
  successes: {},
  asyncErrors: {},
  asyncWarnings: {},
  asyncSuccesses: {},
  validating: {},
  validationFailed: {},
  validationFailures: 0,
  asyncValidations: 0,
  submitted: false,
  submits: 0
};

const setFormState = ( state, action ) => {
  return { ...INITIAL_STATE, ...action.formState };
};

const setValue = ( state, action ) => {

  const {
    field,
    value
  } = action;

  let newValues = JSON.parse(JSON.stringify(state.values));

  newValues = Utils.set( newValues, field, value );

  return {
    ...state,
    values: newValues
  };

};

const setAllValues = ( state, action ) => {

  const {
    values
  } = action;

  const oldValues = JSON.parse(JSON.stringify(state.values));

  return {
    ...state,
    values: { ...oldValues, ...values }
  };

};

const format = ( state, action ) => {

  const {
    field
  } = action;

  let newValues = JSON.parse(JSON.stringify(state.values));

  newValues = Utils.set( newValues, field, action.format( Utils.get( newValues, field ) ) );

  return {
    ...state,
    values: newValues
  };

};

const setTouched = ( state, action ) => {

  const {
    field,
    touched
  } = action;

  let newTouched = JSON.parse(JSON.stringify(state.touched));

  newTouched = Utils.set( newTouched, field, touched );

  return {
    ...state,
    touched: newTouched
  };

};

const setAllTouched = ( state, action ) => {

  const {
    touched
  } = action;

  const oldTouched = JSON.parse(JSON.stringify(state.touched));

  return {
    ...state,
    touched: { ...oldTouched, ...touched }
  };

};

const setWarning = ( state, action ) => {

  const {
    field,
    warning
  } = action;

  let newWarnings = JSON.parse(JSON.stringify(state.warnings));

  newWarnings = Utils.set( newWarnings, field, warning );

  return {
    ...state,
    warnings: newWarnings
  };

};

const setError = ( state, action ) => {

  const {
    field,
    error
  } = action;

  let newErrors = JSON.parse(JSON.stringify(state.errors));

  newErrors = Utils.set( newErrors, field, error );

  return {
    ...state,
    errors: newErrors
  };

};

const setSuccess = ( state, action ) => {

  const {
    field,
    success
  } = action;

  let newSuccesses = JSON.parse(JSON.stringify(state.successes));

  newSuccesses = Utils.set( newSuccesses, field, success );

  return {
    ...state,
    successes: newSuccesses
  };

};


const setAsyncWarning = ( state, action ) => {

  const {
    field,
    warning
  } = action;

  const newWarnings = JSON.parse(JSON.stringify(state.asyncWarnings));

  if ( Array.isArray(field) ) {
    newWarnings[field[0]] = warning;
  }
  else {
    newWarnings[field] = warning;
  }

  return {
    ...state,
    asyncWarnings: newWarnings
  };

};

const setAsyncError = ( state, action ) => {

  const {
    field,
    error
  } = action;

  const newErrors = JSON.parse(JSON.stringify(state.asyncErrors));

  if ( Array.isArray(field) ) {
    newErrors[field[0]] = error;
  }
  else {
    newErrors[field] = error;
  }

  return {
    ...state,
    asyncErrors: newErrors
  };

};

const setAsyncSuccess = ( state, action ) => {

  const {
    field,
    success
  } = action;

  const newSuccesses = JSON.parse(JSON.stringify(state.asyncSuccesses));

  if ( Array.isArray(field) ) {
    newSuccesses[field[0]] = success;
  }
  else {
    newSuccesses[field] = success;
  }

  return {
    ...state,
    asyncSuccesses: newSuccesses
  };

};

const removeAsyncWarning = ( state, action ) => {

  const {
    field
  } = action;

  const newWarnings = JSON.parse(JSON.stringify(state.asyncWarnings));

  if ( Array.isArray(field) ) {
    delete newWarnings[field[0]];
  }
  else {
    delete newWarnings[field];
  }

  return {
    ...state,
    asyncWarnings: newWarnings
  };

};

const removeAsyncError = ( state, action ) => {

  const {
    field,
  } = action;

  const newErrors = JSON.parse(JSON.stringify(state.asyncErrors));

  if ( Array.isArray(field) ) {
    delete newErrors[field[0]];
  }
  else {
    delete newErrors[field];
  }

  return {
    ...state,
    asyncErrors: newErrors
  };

};

const removeAsyncSuccess = ( state, action ) => {

  const {
    field
  } = action;

  const newSuccesses = JSON.parse(JSON.stringify(state.asyncSuccesses));

  if ( Array.isArray(field) ) {
    delete newSuccesses[field[0]];
  }
  else {
    delete newSuccesses[field];
  }

  return {
    ...state,
    asyncSuccesses: newSuccesses
  };

};

const validate = ( state, action, validateError, validateWarning, validateSuccess ) => {

  let errors = validateError ? validateError( state.values ) : {};
  let warnings = validateWarning ? validateWarning( state.values ) : {};
  let successes = validateSuccess ? validateSuccess( state.values, errors ) : {};
  errors = { ...state.errors, ...errors };
  warnings = { ...state.warnings, ...warnings };
  successes = { ...state.successes, ...successes };
  return {
    ...state,
    errors,
    warnings,
    successes
  };
};

const preValidate = ( state, action, preValidator ) => {

  const values = preValidator ? preValidator( JSON.parse( JSON.stringify( state.values) ) ) : state.values;

  return {
    ...state,
    values
  };
};

const submits = ( state ) => {
  return {
    ...state,
    submits: state.submits + 1,
  };
};

const submitted = ( state ) => {
  return {
    ...state,
    submitted: true,
  };
};

const reset = ( state, action ) => {

  const {
    field
  } = action;

  const newState = JSON.parse( JSON.stringify( state ) );
  newState.values[field] = null;
  newState.touched[field] = null;
  newState.errors[field] = null;
  newState.warnings[field] = null;
  newState.successes[field] = null;
  newState.asyncErrors[field] = null;
  newState.asyncWarnings[field] = null;
  newState.asyncSuccesses[field] = null;

  return {
    ...state,
    ...newState
  };
};

const validatingField = ( state, action ) => {

  const {
    field
  } = action;

  const validating = JSON.parse(JSON.stringify(state.validating));

  let asyncValidations = state.asyncValidations;

  if ( Array.isArray(field) ) {
    // Only incriment validations if this field is going from falsey to true
    asyncValidations = !validating[field[0]] ? asyncValidations + 1 : asyncValidations;
    validating[field[0]] = true;
  }
  else {
    // Only incriment validations if this field is going from falsey to true
    asyncValidations = !validating[field] ? asyncValidations + 1 : asyncValidations;
    validating[field] = true;
  }

  return {
    ...state,
    asyncValidations,
    validating
  };

};

const doneValidatingField = ( state, action ) => {

  const {
    field
  } = action;

  const validating = JSON.parse(JSON.stringify(state.validating));

  let asyncValidations = state.asyncValidations;

  if ( Array.isArray(field) ) {
    // Only deccriment validations if this field is going from true to false
    asyncValidations = validating[field[0]] ? asyncValidations - 1 : asyncValidations;
    validating[field[0]] = false;
  }
  else {
    // Only deccriment validations if this field is going from true to false
    asyncValidations = validating[field] ? asyncValidations - 1 : asyncValidations;
    validating[field] = false;
  }

  return {
    ...state,
    asyncValidations,
    validating
  };

};

const validationFailure = ( state, action ) => {

  const {
    field
  } = action;

  const validationFailed = JSON.parse(JSON.stringify(state.validationFailed));

  let validationFailures = state.validationFailures;

  if ( Array.isArray(field) ) {
    // Only incriment faulures if this field is going from false to true
    validationFailures = validationFailed[field[0]] === false ? validationFailures + 1 : validationFailures;
    validationFailed[field[0]] = true;
  }
  else {
    // Only incriment faulures if this field is going from falsey to true
    validationFailures = !validationFailed[field] ? validationFailures + 1 : validationFailures;
    validationFailed[field] = true;
  }

  return {
    ...state,
    validationFailures,
    validationFailed
  };

};

const validationSuccess = ( state, action ) => {

  const {
    field
  } = action;

  let validationFailures = state.validationFailures;

  const validationFailed = JSON.parse(JSON.stringify(state.validationFailed));

  if ( Array.isArray(field) ) {
    // Only devcriment faulures if this field is going from true to false
    validationFailures = validationFailed[field[0]] === true ? validationFailures - 1 : validationFailures;
    validationFailed[field[0]] = false;
  }
  else {
    // Only devcriment faulures if this field is going from true to false
    validationFailures = validationFailed[field] === true ? validationFailures - 1 : validationFailures;
    validationFailed[field] = false;
  }

  return {
    ...state,
    validationFailures,
    validationFailed
  };

};

class ReducerBuilder {

  static build( properties = {} ) {

    const {
      validateError,
      validateWarning,
      validateSuccess,
      defaultValues
    } = properties;

    const COMBINED_INITIAL_STATE = Object.assign({}, INITIAL_STATE, {
      values: defaultValues || {}
    });

    const reducer = (state = COMBINED_INITIAL_STATE, action) => {
      switch ( action.type ) {
        case SET_FORM_STATE:
          return setFormState( state, action );
        case SET_VALUE:
          return setValue( state, action );
        case SET_ALL_VALUES:
          return setAllValues( state, action );
        case FORMAT:
          return format( state, action );
        case SET_ERROR:
          return setError( state, action );
        case SET_WARNING:
          return setWarning( state, action );
        case SET_SUCCESS:
          return setSuccess( state, action );
        case SET_ASYNC_ERROR:
          return setAsyncError( state, action );
        case SET_ASYNC_WARNING:
          return setAsyncWarning( state, action );
        case SET_ASYNC_SUCCESS:
          return setAsyncSuccess( state, action );
        case SET_TOUCHED:
          return setTouched( state, action );
        case SET_ALL_TOUCHED:
          return setAllTouched( state, action );
        case REMOVE_ASYNC_ERROR:
          return removeAsyncError( state, action );
        case REMOVE_ASYNC_WARNING:
          return removeAsyncWarning( state, action );
        case REMOVE_ASYNC_SUCCESS:
          return removeAsyncSuccess( state, action );
        case PRE_VALIDATE:
          return preValidate( state, action, properties.preValidate );
        case VALIDATE:
          return validate( state, action, validateError, validateWarning, validateSuccess );
        case SUBMITTED:
          return submitted( state, action );
        case SUBMITS:
          return submits( state, action );
        case RESET:
          return reset( state, action );
        case RESET_ALL:
          return COMBINED_INITIAL_STATE;
        case CLEAR_ALL:
          return INITIAL_STATE;
        case VALIDATION_FAILURE:
          return validationFailure( state, action );
        case VALIDATION_SUCCESS:
          return validationSuccess( state, action );
        case DONE_VALIDATING_FIELD:
          return doneValidatingField( state, action );
        case VALIDATING_FIELD:
          return validatingField( state, action );
        default:
          return state;
      }
    };

    return reducer;

  }

}

export default ReducerBuilder;
