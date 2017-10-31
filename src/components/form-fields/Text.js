/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Inport the form input
import FormField from '../FormField';

class TextWrapper extends Component {

  render() {

    // console.log('RENDER');

    const {
      fieldDidUpdate,
      fieldApi,
      onInput,
      ...rest
    } = this.props;

    const {
      getValue,
      setValue,
      setTouched,
      format
    } = fieldApi;

    return (
      <input
        value={getValue() || ''}
        onInput={( e ) => {
          setValue(e.target.value);
          if ( fieldDidUpdate ) {
            fieldDidUpdate(e.target.value);
          }
          if ( onInput ) {
            onInput( e );
          }
        }
        }
        onBlur={() => {
          setTouched();
        }}
        {...rest} />
    );
  }
}

class Text extends Component {

  render() {
    const {
      field,
      ...rest
    } = this.props;

    //console.log("REST", rest);
    // console.log("RENDER1");

    return (
      <FormField field={field}>
        <TextWrapper {...rest} />
      </FormField>
    );
  }

}

Text.propTypes = {
  field: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
};

export default Text;
