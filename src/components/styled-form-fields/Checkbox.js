/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Import classNames for generating classes
import classNames from 'classnames';

// Inport the form input
import withFormField from '../withFormField';

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
      noMessage,
      messageBefore,
      valueValidation,
      touchValidation,
      ...rest
    } = this.props;

    const {
      getValue,
      setValue,
      setTouched,
      getError,
      getWarning,
      getSuccess,
      getTouched,
    } = fieldApi;

    const error = getError();
    const warning = getWarning();
    const success = getSuccess();
    const touched = getTouched();
    const value = getValue();

    const type = Utils.getMessageType(error, warning, success);
    const showValidation = Utils.shouldShowValidation({
      valueValidation,
      touchValidation,
      touched,
      value,
    });

    const labelClasses = classNames(
      'react-form-control',
      'react-form-control-checkbox',
      rest.className || '',
    );

    const indicatorClasses = classNames(
      'react-form-control-indicator',
      'react-form-input',
      'react-form-checkbox',
      {
        [`react-form-input-${type}`]: type && showValidation,
        [`react-form-checkbox-${type}`]: type && showValidation,
      },
    );

    return (
      <div>
        {type && showValidation && !noMessage && messageBefore ? (
          <Message
            message={Utils.getMessage(error, warning, success)}
            type={type}
          />
        ) : null}
        <label className={labelClasses} htmlFor={rest.id}>
          {label}
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
              if (onBlur) {
                onBlur(e);
              }
            }}
            type="checkbox"
          />
          <div className={indicatorClasses} />
        </label>
        {type && showValidation && !noMessage && !messageBefore ? (
          <Message
            message={Utils.getMessage(error, warning, success)}
            type={type}
          />
        ) : null}
      </div>
    );
  }
}

const Checkbox = withFormField(CheckboxWrapper);

export default Checkbox;
