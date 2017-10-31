/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Inport the form input
import FormField from '../FormField';

class CheckboxWrapper extends Component {

  render() {

    // console.log('RENDER');

    const {
      fieldDidUpdate,
      fieldApi,
      onChange,
      ...rest
    } = this.props;

    const {
      getValue,
      setValue,
      setTouched
    } = fieldApi;

    return (
      <input
        checked={!!getValue()}
        onBlur={() => setTouched()}
        onChange={(e) => {
          setValue(e.target.checked);
          if (onChange) {
            onChange(e);
          }
          if ( fieldDidUpdate ) {
            fieldDidUpdate( e.target.checked );
          }
        }}
        type="checkbox"
        {...rest} />
    );
  }
}

const Checkbox = FormField(CheckboxWrapper);

export default Checkbox;
