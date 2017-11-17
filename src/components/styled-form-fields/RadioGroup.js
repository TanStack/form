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

class RadioGroupWrapper extends Component {

  // Set the initial value
  componentWillMount() {
    if (this.props.value) {
      this.props.fieldApi.setValue(this.props.value);
    }
  }

  render() {

    const {
      fieldApi,
      children,
      component,
      render,
      onChange,
      onBlur,
      noMessage,
      className,
      messageBefore
    } = this.props;

    const {
      getError,
      getWarning,
      getSuccess,
    } = fieldApi;

    const error = getError();
    const warning = getWarning();
    const success = getSuccess();

    const type = Utils.getMessageType( error, warning, success );

    const classes = classNames(
      className,
      'react-form-input',
      'react-form-radio-group',
      {
        [`react-form-input-${type}`]: type,
        [`react-form-radio-group-${type}`]: type
      }
    );

    fieldApi.onChange = ( val ) => {
      if ( onChange ) {
        onChange( val );
      }
    };

    fieldApi.onBlur = () => {
      if (onBlur) {
        onBlur();
      }
    };

    let content;

    // Expose field api as group
    if ( component ) {
      content = React.createElement(component, { group: fieldApi } );
    }
    else if ( render ) {
      content = render(fieldApi);
    }
    else if ( typeof children === 'function' ) {
      content = children(fieldApi);
    }
    else {
      content = React.cloneElement(children, { group: fieldApi } );
    }

    return (
      <div>
        { type && !noMessage && messageBefore ? <Message message={Utils.getMessage( error, warning, success )} type={type} /> : null }
        <div className={classes}>
          {content}
        </div>
        { type && !noMessage && !messageBefore ? <Message message={Utils.getMessage( error, warning, success )} type={type} /> : null }
      </div>
    );
  }
}

const RadioGroup = FormField(RadioGroupWrapper);

export default RadioGroup;
