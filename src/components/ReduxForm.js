/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Import PropTypes library
import PropTypes from 'prop-types';

import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { connect } from 'react-redux';
import { createLogger } from 'redux-logger';

import ReducerBuilder from '../redux/ReducerBuilder';
import * as actions from '../redux/actions';

import Utils from '../redux/utils';

/* ----- Recursive Check to see if form is valid  -----*/

// TODO maybe a better way to do this
const isFormValid = (errors) => {
  if ( Array.isArray( errors ) ) {
    return errors.some( k => isFormValid( k ) );
  }
  else if ( errors !== null && typeof errors === 'object') {
    return Object.keys(errors).some( k => isFormValid( errors[k] ) );
  }
  return errors;
};

/* ---------- Helper Methods ----------*/
const newErrors = (state) => {
  return Object.assign(state.errors, state.asyncErrors);
};

const newWarnings = (state) => {
  return Object.assign(state.warnings, state.asyncWarnings);
};

const newSuccesses = (state) => {
  return Object.assign(state.successes, state.asyncSuccesses);
};

const newState = ( state ) => {
  return Object.assign( JSON.parse( JSON.stringify( state ) ), {
    errors: newErrors(state),
    warnings: newWarnings(state),
    successes: newSuccesses(state)
  });
};

/* ---------- Form Component ----------*/

class Form extends Component {

  constructor(props) {
    super(props);
    this.asyncValidators = [];

    // Unfortunately, babel has some stupid bug with auto-binding async arrow functions
    // So we still need to manually bind them here
    // https://github.com/gaearon/react-hot-loader/issues/391
    this.finishSubmission = this.finishSubmission.bind(this);
    this.setAllValues = this.setAllValues.bind(this);
    this.setAllTouched = this.setAllTouched.bind(this);
    this.callAsynchronousValidators = this.callAsynchronousValidators.bind(this);
  }

  getChildContext() {
    return {
      formApi: this.api
    };
  }

  componentWillMount() {
    if (this.props.getApi) {
      this.props.getApi(this.api);
    }
  }

  componentDidMount() {
    if ( !this.props.dontValidateOnMount ) {
      // PreValidat
      this.props.dispatch(actions.preValidate());
      // Validate
      this.props.dispatch(actions.validate());
    }
    // Register async validators if you are a nested form ( only nested forms have registerAsync prop )
    if ( this.props.registerAsyncValidation ) {
      this.props.registerAsyncValidation( this.callAsynchronousValidators );
    }
  }

  componentWillReceiveProps(nextProps) {
    // If submits was incrimented
    if ( nextProps.submits > this.props.submits ) {
      // PreValidate
      this.props.dispatch(actions.preValidate());
      // Validate
      this.props.dispatch(actions.validate());
      // Inciment submit
      this.props.dispatch(actions.submits());
    }
    const didUpdate = JSON.stringify( nextProps.formState ) !== JSON.stringify( this.props.formState );
    // Call form did update
    if ( this.props.formDidUpdate && didUpdate ) {
      this.props.formDidUpdate( newState( nextProps.formState ) );
    }
    // Call update function if it exists
    if ( this.props.update && didUpdate ) {
      this.props.update( newState( nextProps.formState ) );
    }
  }

  componentWillUnmount() {
    // Reset the form if it has reset
    if ( this.props.reset ) {
      // Basically calling parent forms reset function
      this.props.reset();
    }
  }

  get api() {
    return {
      values: this.props.formState.values,
      errors: this.errors,
      warnings: this.warnings,
      successes: this.successes,
      touched: this.props.formState.touched,
      asyncValidations: this.props.formState.asyncValidations,
      validating: this.props.formState.validating,
      validationFailures: this.props.formState.validationFailures,
      validationFailed: this.props.formState.validationFailed,
      submitForm: this.submitForm,
      setValue: this.setValue,
      getValue: this.getValue,
      setTouched: this.setTouched,
      getTouched: this.getTouched,
      getWarning: this.getWarning,
      getError: this.getError,
      getSuccess: this.getSuccess,
      getFormState: this.getFormState,
      setFormState: this.setFormState,
      setError: this.setError,
      setWarning: this.setWarning,
      setSuccess: this.setSuccess,
      format: this.format,
      submitted: this.props.formState.submitted,
      submits: this.props.formState.submits,
      reset: this.reset,
      resetAll: this.resetAll,
      clearAll: this.clearAll,
      validatingField: this.validatingField,
      doneValidatingField: this.doneValidatingField,
      registerAsyncValidation: this.registerAsyncValidation,
      addValue: this.addValue,
      removeValue: this.removeValue,
      setAllValues: this.setAllValues,
      setAllTouched: this.setAllTouched,
      swapValues: this.swapValues
    };
  }

  getFormState = () => {
    return newState( this.props.formState );
  }

  get errors() {
    return Object.assign(this.props.formState.errors, this.props.formState.asyncErrors);
  }

  get warnings() {
    return Object.assign(this.props.formState.warnings, this.props.formState.asyncWarnings);
  }

  get successes() {
    return Object.assign(this.props.formState.successes, this.props.formState.asyncSuccesses);
  }

  get currentState() {
    return Object.assign( JSON.parse( JSON.stringify( this.props.formState ) ), {
      errors: this.errors,
      warnings: this.warnings,
      successes: this.successes
    });
  }

  setValue = ( field, value ) => {
    this.props.dispatch(actions.setValue(field, value));
    this.props.dispatch(actions.removeAsyncError(field));
    this.props.dispatch(actions.removeAsyncWarning(field));
    this.props.dispatch(actions.removeAsyncSuccess(field));
    this.props.dispatch(actions.preValidate());
    this.props.dispatch(actions.validate());
  }

  setTouched = ( field, touch = true, validate = true ) => {
    this.props.dispatch(actions.setTouched(field, touch));
    // We have a flag to perform async validate when touched
    if ( validate ) {
      this.props.dispatch(actions.asyncValidate(field, this.props.asyncValidators ));
    }
  }

  async setAllTouched( touched ) {
    this.props.dispatch(actions.setAllTouched( touched ));
    this.props.dispatch(actions.preValidate());
    this.props.dispatch(actions.validate());
    // Build up list of async functions that need to be called
    const validators = this.props.asyncValidators ? Object.keys(this.props.asyncValidators).map( ( field ) => {
      return this.props.dispatch(actions.asyncValidate(field, this.props.asyncValidators ));
    }) : [];
    await Promise.all( validators );
  }

  setError = ( field, error ) => {
    this.props.dispatch(actions.setError(field, error));
  }

  setWarning = ( field, warning ) => {
    this.props.dispatch(actions.setWarning(field, warning));
  }

  setSuccess = ( field, success ) => {
    this.props.dispatch(actions.setSuccess(field, success));
  }

  async setAllValues( values ) {
    this.props.dispatch(actions.setAllValues( values ));
    this.props.dispatch(actions.preValidate());
    this.props.dispatch(actions.validate());
    // Build up list of async functions that need to be called
    const validators = this.props.asyncValidators ? Object.keys(this.props.asyncValidators).map( ( field ) => {
      return this.props.dispatch(actions.asyncValidate(field, this.props.asyncValidators ));
    }) : [];
    await Promise.all( validators );
  }

  setFormState = ( formState ) => {
    this.props.dispatch( actions.setFormState( formState ) );
  }

  getTouched = ( field ) => {
    return Utils.get( this.props.formState.touched, field );
  }

  getValue = ( field ) => {
    return Utils.get( this.props.formState.values, field );
  }

  getError = ( field ) => {
    return Utils.get( this.errors, field );
  }

  getWarning = ( field ) => {
    return Utils.get( this.warnings, field );
  }

  getSuccess = ( field ) => {
    return Utils.get( this.successes, field );
  }

  addValue = ( field, value ) => {
    this.props.dispatch(actions.setValue(field, [
      ...( Utils.get( this.props.formState.values, field ) || []),
      value,
    ]));
    this.props.dispatch(actions.removeAsyncError(field));
    this.props.dispatch(actions.removeAsyncWarning(field));
    this.props.dispatch(actions.removeAsyncSuccess(field));
    this.props.dispatch(actions.preValidate());
    this.props.dispatch(actions.validate());
  }

  removeValue = ( field, index ) => {
    const fieldValue = Utils.get( this.props.formState.values, field ) || [];
    this.props.dispatch(actions.setValue( field, [
      ...fieldValue.slice(0, index),
      ...fieldValue.slice(index + 1)
    ]));
    const fieldTouched = Utils.get( this.props.formState.touched, field ) || [];
    this.props.dispatch(actions.setTouched( field, [
      ...fieldTouched.slice(0, index),
      ...fieldTouched.slice(index + 1)
    ]));
    this.props.dispatch(actions.removeAsyncError(field));
    this.props.dispatch(actions.removeAsyncWarning(field));
    this.props.dispatch(actions.removeAsyncSuccess(field));
    this.props.dispatch(actions.preValidate());
    this.props.dispatch(actions.validate());
  }

  swapValues = ( field, index, destIndex ) => {

    const min = Math.min(index, destIndex);
    const max = Math.max(index, destIndex);

    const fieldValues = Utils.get( this.props.formState.values, field ) || [];

    this.props.dispatch(actions.setValue(field, [
      ...fieldValues.slice(0, min),
      fieldValues[max],
      ...fieldValues.slice(min + 1, max),
      fieldValues[min],
      ...fieldValues.slice(max + 1),
    ] ));
  }

  registerAsyncValidation = ( func ) => {
    this.asyncValidators.push( func );
  }

  format = ( field, format ) => {
    this.props.dispatch(actions.format(field, format));
    this.props.dispatch(actions.preValidate());
    this.props.dispatch(actions.validate());
  }

  reset = ( field ) => {
    this.props.dispatch(actions.reset(field));
  }

  resetAll = () => {
    this.props.dispatch(actions.resetAll());
  }

  clearAll = () => {
    this.props.dispatch(actions.clearAll());
  }

  // This is an internal method used by nested forms to tell the parent that its validating
  validatingField = ( field ) => {
    this.props.dispatch(actions.validatingField(field));
  }

  // This is an internal method used by nested forms to tell the parent that its done validating
  doneValidatingField = ( field ) => {
    this.props.dispatch(actions.doneValidatingField(field));
  }

  submitForm = ( e ) => {
    // PreValidate
    this.props.dispatch(actions.preValidate());
    // Validate
    this.props.dispatch(actions.validate());
    // update submits
    this.props.dispatch(actions.submits());
    // We prevent default, by default, unless override is passed
    if ( e && e.preventDefault && !this.props.dontPreventDefault ) {
      e.preventDefault(e);
    }
    // We need to prevent default if override is passed and form is invalid
    if ( this.props.dontPreventDefault ) {
      const invalid = isFormValid( this.errors );
      if ( invalid && e && e.preventDefault ) {
        e.preventDefault(e);
      }
    }
    this.finishSubmission();
  }

  async finishSubmission(e) {
    // Call asynchronous validators
    await this.callAsynchronousValidators();
    // Only submit if we have no errors
    const errors = this.errors;
    const invalid = isFormValid( errors );
    // Only update submitted if we are not invalid and there are no active asynchronous validations
    if ( !invalid && this.props.formState.asyncValidations === 0 ) {
      let values = JSON.parse( JSON.stringify( this.props.formState.values ) );
      // Call pre submit
      if ( this.props.preSubmit ) {
        values = this.props.preSubmit( values, this.api );
      }
      // Update submitted
      this.props.dispatch(actions.submitted());
      if ( this.props.onSubmit ) {
        this.props.onSubmit( values, e, this.api );
      }
    }
  }

  async callAsynchronousValidators() {
    // Build up list of async functions that need to be called
    let validators = this.props.asyncValidators ? Object.keys(this.props.asyncValidators).map( ( field ) => {
      return this.props.dispatch(actions.asyncValidate(field, this.props.asyncValidators ));
    }) : [];
    const childValidators = this.asyncValidators ? this.asyncValidators.map( ( validator ) => {
      // This looks strange but you call an async function to generate a promise
      return validator();
    }) : [];
    // Add all other subscribed validators to the validators list
    validators = validators.concat(childValidators);
    // Call all async validators
    await Promise.all( validators );
  }

  render() {

    const {
      children,
      component,
      render
    } = this.props;

    if ( component ) {
      return React.createElement(component, { formApi: this.api } );
    }

    if ( render ) {
      return render(this.api);
    }

    if ( typeof children === 'function' ) {
      return children(this.api);
    }

    return React.cloneElement(children, { formApi: this.api } );

  }

}

Form.childContextTypes = {
  formApi: PropTypes.object
};

/* ---------- Container ---------- */

const mapStateToProps = state => ({
  formState: state
});

const mapDispatchToProps = dispatch => ({
  dispatch
});

const FormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);

/* ---------- Exports ---------- */
class ReduxForm extends Component {

  constructor(props) {
    super(props);
    const {
      validateError,
      validateWarning,
      validateSuccess,
      preValidate,
      defaultValues
    } = props;

    this.store = createStore(
      ReducerBuilder.build( { validateError, validateWarning, validateSuccess, preValidate, defaultValues } ),
      applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        // createLogger() // neat middleware that logs actions
      )
    );
  }

  render() {

    const {
      children,
      ...rest
    } = this.props;

    return (
      <FormContainer store={this.store} {...rest}>
        {children}
      </FormContainer>
    );
  }
}


export default ReduxForm;
