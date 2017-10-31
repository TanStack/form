/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Import PropTypes library
import PropTypes from 'prop-types';

// Inport the form input
import FormField from '../FormField';

class TextAreaWrapper extends Component {

  render() {

    // console.log('RENDER');

    const {
      onChange,
      onBlur,
      fieldApi,
      fieldDidUpdate,
      ...rest
    } = this.props;

    const {
      getValue,
      setValue,
      setTouched
    } = fieldApi;

    return (
      <textarea
        {...rest}
        value={getValue() || ''}
        onChange={( e ) => {
          setValue(e.target.value);
          if (fieldDidUpdate) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('fieldDidUpdate has been deprecated in favor of onChange. Please check the latest docs and update your app!')
            }
            fieldDidUpdate(e.target.value);
          }
          if ( onChange ) {
            onChange(e.target.value, e);
          }
        }}
        onBlur={(e) => {
          setTouched();
          if ( onBlur ) {
            onBlur(e);
          }
        }}
      />
    );

  }
}

class TextArea extends Component {

  render() {
    const {
      field,
      ...rest
    } = this.props;

    return (
      <FormField field={field}>
        <TextAreaWrapper {...rest} />
      </FormField>
    );
  }

}

TextArea.propTypes = {
  field: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
};

export default TextArea;
