/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Import classNames for generating classes
import classNames from 'classnames';

// Inport the form input
import FormField from '../FormField';

// Import our message
import Message from './Message';

// Import styled utils
import Utils from './utils';

class CheckboxWrapper extends Component {

  render() {

    const {
      fieldApi,
      onChange,
      onBlur,
      label,
      ...rest
    } = this.props;

    const {
      getValue,
      setValue,
      setTouched,
      getError,
      getWarning,
      getSuccess,
    } = fieldApi;

    const error = getError();
    const warning = getWarning();
    const success = getSuccess();

    const type = Utils.getMessageType( error, warning, success );

    const labelClasses = classNames(
      'react-form-control',
      'react-form-control-checkbox',
      rest.className || ''
    );

    const indicatorClasses = classNames(
      'react-form-control-indicator',
      'react-form-input',
      'react-form-checkbox',
      {
        [`react-form-input-${type}`]: type,
        [`react-form-checkbox-${type}`]: type
      }
    );

    return (
      <div>
        <label className={labelClasses} htmlFor={rest.id}>{label}
          <input
            {...rest}
            checked={!!getValue()}
            onChange={(e) => {
              setValue(e.target.checked);
              if (onChange) {
                onChange(e.target.checked, e);
              }
            }}
            onBlur={(e) => {
              setTouched();
              if ( onBlur ) {
                onBlur(e);
              }
            }}
            type="checkbox"
          />
          <div className={indicatorClasses} />
        </label>
        { type ? <Message message={Utils.getMessage( error, warning, success )} type={type} /> : null }
      </div>
    );
  }
}

const Checkbox = FormField(CheckboxWrapper);

export default Checkbox;
