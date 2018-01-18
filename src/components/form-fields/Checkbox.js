/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Inport the form input
import withFormField from '../withFormField';

class CheckboxWrapper extends Component {
  render() {
    

    const { fieldApi, onChange, onBlur, ...rest } = this.props;

    const { getValue, setValue, setTouched } = fieldApi;

    return (
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
    );
  }
}

const Checkbox = withFormField(CheckboxWrapper);

export default Checkbox;
