/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Import PropTypes library
import PropTypes from 'prop-types';

/* ---------- Form Component ----------*/

class FormField extends Component {

  // We want to set touched to true when the form was submitted ( not for nested forms! )
  componentWillReceiveProps(nextProps, nextContext) {
    if ( nextContext.formApi.submitted !== this.context.formApi.submitted && !this.props.nestedForm ) {
      this.context.formApi.setTouched( this.props.field, true, false );
    }
    if ( nextContext.formApi.submits !== this.context.formApi.submits && !this.props.nestedForm ) {
      this.context.formApi.setTouched( this.props.field, true, false );
    }
  }

  render() {

    // console.log("RENDER FIELD", this.props.field);

    const {
      formApi
    } = this.context;

    const {
      children,
      field
    } = this.props;

    // Build field api from form api
    const fieldApi = {
      setValue: ( value ) => {
        formApi.setValue( field, value );
      },
      format: ( format ) => {
        formApi.format( field, format );
      },
      setTouched: ( touched ) => {
        formApi.setTouched( field, touched );
      },
      setError: ( error ) => {
        formApi.setError( field, error );
      },
      setWarning: ( warning ) => {
        formApi.setWarning( field, warning );
      },
      setSuccess: ( success ) => {
        formApi.setSuccess( field, success );
      },
      getValue: ( ) => formApi.getValue( field ),
      getTouched: ( ) => formApi.getTouched( field ),
      getError: ( ) => formApi.getError( field ),
      getWarning: ( ) => formApi.getWarning( field ),
      getSuccess: ( ) => formApi.getSuccess( field ),
      validatingField: ( ) => formApi.validatingField( field ),
      doneValidatingField: ( ) => formApi.doneValidatingField( field ),
      reset: ( ) => formApi.reset( field ),
      registerAsyncValidation: formApi.registerAsyncValidation,
      submitted: formApi.submitted,
      submits: formApi.submits
    };

    return React.cloneElement(children, { fieldApi } );

  }

}

FormField.contextTypes = {
  formApi: PropTypes.object
};

export default FormField;
