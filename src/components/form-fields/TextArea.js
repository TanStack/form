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
      fieldApi,
      fieldDidUpdate,
      onInput,
      ...rest
    } = this.props;

    const {
      getValue,
      setValue,
      setTouched
    } = fieldApi;

    return (
      <textarea
        value={getValue('')}
        onInput={( e ) => {
          setValue(e.target.value);
          if ( fieldDidUpdate ) {
            fieldDidUpdate(e.target.value);
          }
          if ( onInput ) {
            onInput( e );
          }
        }}
        onBlur={() => setTouched()}
        {...rest} />
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
