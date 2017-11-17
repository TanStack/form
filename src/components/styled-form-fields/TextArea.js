/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Import classNames for generating classes
import classNames from 'classnames';

// Inport the form input
import FormField from '../FormField';

// Import our message
import Message from './Message';

// Import styled utils
import Utils from './utils';

class TextAreaWrapper extends Component {
  render() {

    const {
      fieldApi,
      onChange,
      onBlur,
      ...rest
    } = this.props;

    const {
      getValue,
      getError,
      getWarning,
      getSuccess,
      setValue,
      setTouched,
    } = fieldApi;

    const error = getError();
    const warning = getWarning();
    const success = getSuccess();

    const type = Utils.getMessageType( error, warning, success );

    const classes = classNames(
      'react-form-input',
      'react-form-textarea',
      {
        [`react-form-input-${type}`]: type,
        [`react-form-textarea-${type}`]: type
      }
    );

    return (
      <div>
        <textarea
          {...rest}
          className={classes}
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
        { type ? <Message message={Utils.getMessage( error, warning, success )} type={type} /> : null }
      </div>
    );
  }
}

const TextArea = FormField(TextAreaWrapper);

export default TextArea;
