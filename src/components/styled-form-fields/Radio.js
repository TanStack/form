/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Import classNames for generating classes
import classNames from 'classnames';

// Import PropTypes library
import PropTypes from 'prop-types';

// Import styled utils
import Utils from './utils';

class Radio extends Component {

  // console.log('RENDER');

  render() {

    const {
      onClick,
      group,
      value,
      label,
      ...rest
    } = this.props;

    const {
      getError,
      getWarning,
      getSuccess,
    } = group;

    const error = getError();
    const warning = getWarning();
    const success = getSuccess();

    const type = Utils.getMessageType( error, warning, success );

    const labelClasses = classNames(
      'react-form-control',
      'react-form-control-radio',
      rest.className || ''
    );

    const indicatorClasses = classNames(
      'react-form-control-indicator',
      'react-form-input',
      'react-form-radio',
      {
        [`react-form-input-${type}`]: type,
        [`react-form-radio-${type}`]: type
      }
    );

    return (
      <label className={labelClasses} htmlFor={rest.id}>{label}
        <input
          {...rest}
          checked={group.getValue() === value}
          onChange={(e) => {
            if (!e.target.checked) {
              return;
            }
            group.setValue(value);
            group.onChange(value, e);
            if (onClick) {
              onClick(e);
            }
          }}
          onBlur={(e) => {
            group.setTouched();
            group.onBlur(e);
          }}
          type="radio"
        />
        <div className={indicatorClasses} />
      </label>
    );

  }

}

Radio.propTypes = {
  value: PropTypes.string.isRequired,
  group: PropTypes.object.isRequired
};

export default Radio;
