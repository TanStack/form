/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Inport the form input
import FormField from '../FormField';

class SelectWrapper extends Component {

  render() {

    // console.log('RENDER');

    const {
      fieldApi,
      options,
      onChange,
      onBlur,
      placeholder,
      ...rest
    } = this.props;

    const {
      getValue,
      setValue,
      setTouched
    } = fieldApi;

    const resolvedOptions = options.find(d => d.value === '') ? options : [
      {
        label: placeholder || 'Select One...',
        value: '',
        disabled: true
      },
      ...options
    ];

    const nullIndex = resolvedOptions.findIndex(d => d.value === '');
    const selectedIndex = resolvedOptions.findIndex(d => d.value === getValue());

    return (
      <select
        {...rest}
        value={selectedIndex > -1 ? selectedIndex : nullIndex}
        onChange={(e) => {
          const val = resolvedOptions[e.target.value].value;
          setValue(val);
          if (onChange) {
            onChange(val, e);
          }
        }}
        onBlur={(e) => {
          setTouched();
          if ( onBlur ) {
            onBlur(e);
          }
        }}
      >
        {resolvedOptions.map((option, i) => (
          <option
            key={option.value}
            value={i}
            disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
}

const Select = FormField(SelectWrapper);

export default Select;
