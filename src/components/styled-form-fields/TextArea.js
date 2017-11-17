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
      className,
      noMessage,
      messageBefore,
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
      className,
      'react-form-input',
      'react-form-textarea',
      {
        [`react-form-input-${type}`]: type,
        [`react-form-textarea-${type}`]: type
      }
    );

    return (
      <div>
        { type && !noMessage && messageBefore ? <Message message={Utils.getMessage( error, warning, success )} type={type} /> : null }
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
        { type && !noMessage && !messageBefore ? <Message message={Utils.getMessage( error, warning, success )} type={type} /> : null }
      </div>
    );
  }
}

const TextArea = FormField(TextAreaWrapper);

export default TextArea;
