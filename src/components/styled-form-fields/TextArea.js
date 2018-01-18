/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Import classNames for generating classes
import classNames from 'classnames';

// Inport the form input
import withFormField from '../withFormField';

// Import our message
import Message from './Message';

// Import styled utils
import Utils from '../../utils';

class TextAreaWrapper extends Component {
  render() {
    const {
      fieldApi,
      onChange,
      onBlur,
      className,
      noMessage,
      messageBefore,
      touchValidation,
      valueValidation,
      ...rest
    } = this.props;

    const {
      getValue,
      getError,
      getWarning,
      getSuccess,
      getTouched,
      setValue,
      setTouched,
    } = fieldApi;

    const error = getError();
    const warning = getWarning();
    const success = getSuccess();
    const touched = getTouched();
    const value = getValue();

    const type = Utils.getMessageType(error, warning, success);
    const showValidation = Utils.shouldShowValidation({
      valueValidation,
      touchValidation,
      touched,
      value,
    });

    const classes = classNames(
      className,
      'react-form-input',
      'react-form-textarea',
      {
        [`react-form-input-${type}`]: type && showValidation,
        [`react-form-textarea-${type}`]: type && showValidation,
      },
    );

    return (
      <div>
        {type && showValidation && !noMessage && messageBefore ? (
          <Message
            message={Utils.getMessage(error, warning, success)}
            type={type}
          />
        ) : null}
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
        {type && showValidation && !noMessage && !messageBefore ? (
          <Message
            message={Utils.getMessage(error, warning, success)}
            type={type}
          />
        ) : null}
      </div>
    );
  }
}

const TextArea = withFormField(TextAreaWrapper);

export default TextArea;
