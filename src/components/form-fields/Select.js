/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Import PropTypes library
import PropTypes from 'prop-types';

// Inport the form input
import FormField from '../FormField';

class SelectWrapper extends Component {

  render() {

    // console.log('RENDER');

    const {
      fieldApi,
      options,
      onChange,
      fieldDidUpdate,
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
          if (fieldDidUpdate) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('fieldDidUpdate has been deprecated in favor of onChange. Please check the latest docs and update your app!')
            }
            fieldDidUpdate(val);
          }
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

class Select extends Component {

  render() {
    const {
      field,
      ...rest
    } = this.props;

    //console.log("REST", rest);

    return (
      <FormField field={field}>
        <SelectWrapper {...rest} />
      </FormField>
    );
  }

}

Select.propTypes = {
  field: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
};

export default Select;
