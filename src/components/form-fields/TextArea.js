/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Inport the form input
import FormField from '../FormField';

class TextAreaWrapper extends Component {
  render() {
    // console.log('RENDER');

    const { onChange, fieldApi, fieldDidUpdate, onInput, ...rest } = this.props;

    const { getValue, setValue, setTouched } = fieldApi;

    return (
      <textarea
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
        onBlur={() => setTouched()}
        {...rest}
      />
    );
  }
}

const TextArea = FormField(TextAreaWrapper);

export default TextArea;
