/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Import PropTypes library
import PropTypes from 'prop-types';

import Utils from '../redux/utils';

class FormField extends Component {
  // We want to set touched to true when the form was submitted ( not for nested forms! )
  componentWillReceiveProps(nextProps, nextContext) {
    if (
      nextContext.formApi.submitted !== this.context.formApi.submitted &&
      !this.props.nestedForm
    ) {
      this.context.formApi.setTouched(this.props.field, true, false);
    }
    if (
      nextContext.formApi.submits !== this.context.formApi.submits &&
      !this.props.nestedForm
    ) {
      this.context.formApi.setTouched(this.props.field, true, false);
    }
  }

  // Optimization to only rerender if nessisary
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    // Grab needed values
    const field = this.props.field;
    const currentApi = this.context.formApi;
    const nextApi = nextContext.formApi;

    // Check child props for changes so we know to re-render
    const nonChildrenProps = {
      ...this.props,
      children: null, // do not compare children, that would be an anti-pattern
    };
    const nextNonChildrenProps = {
      ...nextProps,
      children: null,
    };

    // TODO debug async error issue
    // console.log("WTF1", Utils.get( currentApi.errors, field ) );
    // console.log("WTF2", Utils.get( nextApi.errors, field ) );

    const shouldUpdate =
      Utils.get(nextApi.values, field) !==
        Utils.get(currentApi.values, field) ||
      Utils.get(nextApi.touched, field) !==
        Utils.get(currentApi.touched, field) ||
      Utils.get(nextApi.errors, field) !==
        Utils.get(currentApi.errors, field) ||
      Utils.get(nextApi.warnings, field) !==
        Utils.get(currentApi.warnings, field) ||
      Utils.get(nextApi.successes, field) !==
        Utils.get(currentApi.successes, field) ||
      Utils.get(nextApi.validating, field) !==
        Utils.get(currentApi.validating, field) ||
      Utils.get(nextApi.validationFailed, field) !==
        Utils.get(currentApi.validationFailed, field) ||
      !Utils.isShallowEqual(nextNonChildrenProps, nonChildrenProps) ||
      nextContext.formApi.submits !== this.context.formApi.submits;

    return shouldUpdate || false;
  }

  render() {
    // console.log("RENDER FIELD", this.props.field);

    const { formApi } = this.context;

    const { field, render, component, children, ...rest } = this.props;

    // Build field api from form api
    const fieldApi = {
      setValue: (value) => {
        formApi.setValue(field, value);
      },
      // format: ( format ) => {
      //   formApi.format( field, format ); // TODO not supported yet WIP
      // },
      setTouched: (touched) => {
        formApi.setTouched(field, touched);
      },
      setError: (error) => {
        formApi.setError(field, error);
      },
      setWarning: (warning) => {
        formApi.setWarning(field, warning);
      },
      setSuccess: (success) => {
        formApi.setSuccess(field, success);
      },
      addValue: value => formApi.addValue(field, value),
      removeValue: index => formApi.addValue(field, index),
      swapValues: (...args) => formApi.addValue(field, ...args),
      getFieldName: () => field,
      getValue: () => formApi.getValue(field),
      getTouched: () => formApi.getTouched(field),
      getError: () => formApi.getError(field),
      getWarning: () => formApi.getWarning(field),
      getSuccess: () => formApi.getSuccess(field),
      validatingField: () => formApi.validatingField(field),
      doneValidatingField: () => formApi.doneValidatingField(field),
      reset: () => formApi.reset(field),
      registerAsyncValidation: formApi.registerAsyncValidation,
      submitted: formApi.submitted,
      submits: formApi.submits,
    };

    if (component) {
      const Comp = component;
      return <Comp fieldApi={fieldApi} {...rest} />;
    }
    return (render || children)(fieldApi);
  }
}

FormField.contextTypes = {
  formApi: PropTypes.object,
};

export default FormField;
