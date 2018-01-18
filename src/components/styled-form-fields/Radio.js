/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Import classNames for generating classes
import classNames from 'classnames';

// Import PropTypes library
import PropTypes from 'prop-types';

// Import styled utils
import Utils from './utils';
import withFormField from '../withFormField';

class RadioComp extends Component {
  render() {
    const {
      onClick,
      group,
      value,
      label,
      className,
      valueValidation,
      touchValidation,
      onChange,
      onBlur,
      fieldApi: {
        getValue,
        setValue,
        setTouched,
        getError,
        getWarning,
        getSuccess,
        getTouched,
      },
      ...rest
    } = this.props;

    const error = getError();
    const warning = getWarning();
    const success = getSuccess();
    const touched = getTouched();

    const type = Utils.getMessageType(error, warning, success);
    const showValidation = Utils.shouldShowValidation({
      valueValidation,
      touchValidation,
      touched,
      value,
    });

    const labelClasses = classNames(
      className,
      'react-form-control',
      'react-form-control-radio',
    );

    const indicatorClasses = classNames(
      'react-form-control-indicator',
      'react-form-input',
      'react-form-radio',
      {
        [`react-form-input-${type}`]: type && showValidation,
        [`react-form-radio-${type}`]: type && showValidation,
      },
    );

    return (
      <label className={labelClasses} htmlFor={rest.id}>
        {label}
        <input
          {...rest}
          checked={getValue() === value}
          onChange={(e) => {
            if (!e.target.checked) {
              return;
            }
            setValue(value);
            if (onChange) {
              onChange(value, e);
            }
            if (onClick) {
              onClick(e);
            }
          }}
          onBlur={(e) => {
            setTouched();
            if (onBlur) {
              onBlur(e);
            }
          }}
          type="radio"
        />
        <div className={indicatorClasses} />
      </label>
    );
  }
}

const Radio = withFormField(RadioComp);

export default Radio;
