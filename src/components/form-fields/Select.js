/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Inport the form input
import FormField from '../FormField';

class SelectWrapper extends Component {

  render() {

    // console.log('RENDER');

    const {
      fieldDidUpdate,
      fieldApi,
      options,
      onChange,
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
        onBlur={() => setTouched()}
        onChange={(e) => {
          const val = resolvedOptions[e.target.value].value;
          setValue(val);
          if (onChange) {
            onChange(e);
          }
          if ( fieldDidUpdate ) {
            fieldDidUpdate( val );
          }
        }}
        value={selectedIndex > -1 ? selectedIndex : nullIndex}
        {...rest}>
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
