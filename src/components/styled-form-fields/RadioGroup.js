/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Inport the form input
import FormField from '../FormField';

// Import our message
import Message from './Message';

class RadioGroupWrapper extends Component {

  // Set the initial value
  componentWillMount() {
    if (this.props.value) {
      this.props.fieldApi.setValue(this.props.value);
    }
  }

  render() {

    // console.log('RENDER');

    const {
      fieldApi,
      children,
      component,
      render,
      onChange,
      onBlur
    } = this.props;

    const {
      getError,
      getWarning,
      getSuccess,
    } = fieldApi;

    const error = getError();
    const warning = getWarning();
    const success = getSuccess();

    let type = null;
    if ( error ) type = 'error';
    if ( !error && warning ) type = 'warning';
    if ( !error && !warning && success ) type = 'success';
    const typeClass = type ? `react-form-input-${type}` : '';
    const radioGroupTypeClass = type ? `react-form-radio-group-${type}` : '';

    fieldApi.onChange = ( val ) => {
      if ( onChange ) {
        onChange( val );
      }
    };

    fieldApi.onBlur = () => {
      if (onBlur) {
        onBlur();
      }
    };

    let content;

    // Expose field api as group
    if ( component ) {
      content = React.createElement(component, { group: fieldApi } );
    }
    else if ( render ) {
      content = render(fieldApi);
    }
    else if ( typeof children === 'function' ) {
      content = children(fieldApi);
    }
    else {
      content = React.cloneElement(children, { group: fieldApi } );
    }

    return (
      <div>
        <div className={`react-form-input react-form-radio-group ${typeClass} ${radioGroupTypeClass}`}>
          {content}
        </div>
        { type && type === 'error' ? <Message message={error} type="error" /> : null }
        { type && type === 'warning' ? <Message message={warning} type="warning" /> : null }
        { type && type === 'success' ? <Message message={success} type="success" /> : null }
      </div>
    );
  }
}

const RadioGroup = FormField(RadioGroupWrapper);

export default RadioGroup;
