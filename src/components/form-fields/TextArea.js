/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Inport the form input
import withFormField from '../withFormField';

class TextAreaWrapper extends Component {
  render() {
    // console.log('RENDER');

    const { onChange, onBlur, fieldApi, ...rest } = this.props;

    const { getValue, setValue, setTouched } = fieldApi;

    return (
      <textarea
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

const TextArea = withFormField(TextAreaWrapper);

export default TextArea;
