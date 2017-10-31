/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Inport the form input
import FormField from '../FormField';

class CheckboxWrapper extends Component {

  render() {

    // console.log('RENDER');

    const {
      fieldApi,
      onChange,
      onBlur,
      ...rest
    } = this.props;

    const {
      getValue,
      setValue,
      setTouched
    } = fieldApi;

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
          if ( onBlur ) {
            onBlur(e);
          }
        }}
        type="checkbox"
      />
    );
  }
}

const Checkbox = FormField(CheckboxWrapper);

export default Checkbox;
