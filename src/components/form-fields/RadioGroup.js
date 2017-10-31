/* ---------- Imports ---------- */

// Import React
import React, { Component } from 'react';

// Inport the form input
import FormField from '../FormField';

class RadioGroupWrapper extends Component {

  // Set the initial value
  componentWillMount() {
    if (this.props.value) {
      this.props.fieldApi.setValue(this.props.value);
    }
  }

  render() {

    // console.log('RENDER');

    const {
      fieldApi,
      children,
      component,
      render,
      onChange,
      onBlur
    } = this.props;

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

    // Expose field api as group
    if ( component ) {
      return React.createElement(component, { group: fieldApi } );
    }

    if ( render ) {
      return render(fieldApi);
    }

    if ( typeof children === 'function' ) {
      return children(fieldApi);
    }

    return React.cloneElement(children, { group: fieldApi } );
  }
}

const RadioGroup = FormField(RadioGroupWrapper);

export default RadioGroup;
