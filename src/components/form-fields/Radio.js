/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Import PropTypes library
import PropTypes from 'prop-types';

class Radio extends Component {

  // console.log('RENDER');

  render() {

    const {
      onClick,
      group,
      value,
      ...rest
    } = this.props;

    return (
      <input
        {...rest}
        checked={group.getValue() === value}
        onClick={(e) => {
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
    );

  }

}

Radio.propTypes = {
  value: PropTypes.string.isRequired,
  group: PropTypes.object.isRequired
};

export default Radio;
