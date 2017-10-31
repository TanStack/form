/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Import PropTypes library
import PropTypes from 'prop-types';

// Inport the form input
import FormField from '../FormField';

class TextWrapper extends Component {
  render() {
    // console.log('RENDER');

    const { fieldApi, onChange, onBlur, ...rest } = this.props;

    const { getValue, setValue, setTouched } = fieldApi;

    return (
      <input
        {...rest}
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
    );
  }
}

class Text extends Component {
  render() {
    const { field, ...rest } = this.props;

    // console.log("REST", rest);
    // console.log("RENDER1");

    return (
      <FormField field={field}>
        <TextWrapper {...rest} />
      </FormField>
    );
  }
}

Text.propTypes = {
  field: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
};

export default Text;
