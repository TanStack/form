/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Inport the form input
import FormField from '../FormField';

// Import our message
import Message from './Message';

class TextWrapper extends Component {
  render() {

    const {
      fieldApi,
      onChange,
      onBlur,
      ...rest
    } = this.props;

    const {
      getValue,
      getError,
      getWarning,
      getSuccess,
      setValue,
      setTouched,
    } = fieldApi;

    const error = getError();
    const warning = getWarning();
    const success = getSuccess();

    let type = null;
    if ( error ) type = 'error';
    if ( !error && warning ) type = 'warning';
    if ( !error && !warning && success ) type = 'success';
    const typeClass = type ? `react-form-input-${type}` : '';

    return (
      <div>
        <input
          {...rest}
          className={`react-form-input react-form-text ${typeClass}`}
          value={getValue() || ''}
          onChange={(e) => {
            setValue(e.target.value);
            if (onChange) {
              onChange(e.target.value, e);
            }
          }}
          onBlur={(e) => {
            setTouched();
            if (onBlur) {
              onBlur(e);
            }
          }}
        />
        { type && type === 'error' ? <Message message={error} type="error" /> : null }
        { type && type === 'warning' ? <Message message={warning} type="warning" /> : null }
        { type && type === 'success' ? <Message message={success} type="success" /> : null }
      </div>
    );
  }
}

const Text = FormField(TextWrapper);

export default Text;
