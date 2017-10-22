/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Import PropTypes library
import PropTypes from 'prop-types';

class Radio extends Component {

  // console.log('RENDER');

  render() {

    const {
      onChange,
      onClick,
      group,
      value,
      ...rest
    } = this.props;

    return (
      <input
        checked={group.getValue() === value}
        onBlur={() => group.setTouched()}
        onClick={(e) => {
          group.setValue(value);
          group.fieldDidUpdate(value);
          if (onClick) {
            onClick(e);
          }
        }}
        type="radio"
        {...rest} />
    );

  }

}

Radio.propTypes = {
  value: PropTypes.string.isRequired,
  group: PropTypes.object.isRequired
};

export default Radio;
