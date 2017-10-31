/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Inport the form input
import FormField from '../FormField';

class TextWrapper extends Component {
  render() {
    // console.log('RENDER');

    const { fieldDidUpdate, fieldApi, onInput, ...rest } = this.props;

    const { getValue, setValue, setTouched } = fieldApi;

    return (
      <input
        value={getValue() || ''}
        onInput={(e) => {
          setValue(e.target.value);
          if (fieldDidUpdate) {
            fieldDidUpdate(e.target.value);
          }
          if (onInput) {
            onInput(e);
          }
        }}
        onBlur={() => {
          setTouched();
        }}
        {...rest}
      />
    );
  }
}

const Text = FormField(TextWrapper);

export default Text;
