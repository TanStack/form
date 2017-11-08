/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Inport the form input
import FormField from '../FormField';

class TextWrapper extends Component {
  render() {
    //console.log('RENDER');

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

const Text = FormField(TextWrapper);

export default Text;
