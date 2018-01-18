import React from 'react';
import PropTypes from 'prop-types';

//

import Utils from '../redux/utils';

class FormField extends React.Component {
  componentWillMount() {
    this.buildApi(this.props);
  }
  // We want to set touched to true when the form was submitted ( not for nested forms! )
  componentWillReceiveProps(nextProps, nextContext) {
    this.buildApi(nextProps);
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
    const strict = nextProps.strict;

    let shouldUpdate;

    // When strict, we need to check props and form state to determine if we
    // should update. Otherwise, update all the time.
    if (strict) {
      // check child props for changes so we know to re-render
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

      shouldUpdate =
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
    return true;
  }

  buildApi = (props) => {
    const { formApi } = this.context;
    const { field } = props;
    this.fieldApi = {
      setValue: value => formApi.setValue(field, value),
      setTouched: touched => formApi.setTouched(field, touched),
      setError: error => formApi.setError(field, error),
      setWarning: warning => formApi.setWarning(field, warning),
      setSuccess: success => formApi.setSuccess(field, success),
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
  };

  render() {
    const {
      field,
      strict,
      nestedForm,
      render,
      component,
      children,
      ...rest
    } = this.props;

    if (component) {
      const Comp = component;
      return <Comp fieldApi={this.fieldApi} {...rest} />;
    }
    return (render || children)(this.fieldApi);
  }
}

FormField.contextTypes = {
  formApi: PropTypes.object,
};

export default FormField;
