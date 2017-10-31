/* ------------- Imports -------------- */
import React, { Component } from 'react';

/* ------------- Form  Library Imports -------------- */
import {
  Form,
  Text,
  FormField
} from '../src/index';

/* ---------------- Other Imports ------------------ */

import Data from './Data';
import Code from './Code';

/* ------------------ Form Stuff --------------------*/

const Message = ({ color, message }) => {
  return (
    <div className="mb-4" style={{ color }}>
      <small>{message}</small>
    </div>
  );
};

class CustomTextWrapper extends Component {

  render() {

    const {
      fieldApi,
      onInput,
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

    return (
      <div>
        <input
          value={getValue()}
          onInput={( e ) => {
            setValue(e.target.value);
            if ( onInput ) {
              onInput( e );
            }
          }}
          onBlur={() => {
            setTouched();
          }}
          {...rest} />
        { error ? <Message color="red" message={error} /> : null }
        { !error && warning ? <Message color="orange" message={warning} /> : null }
        { !error && !warning && success ? <Message color="green" message={success} /> : null }
      </div>
    );
  }
}

const CustomText = FormField(CustomTextWrapper);

const FormContent = ({ formApi }) => {

  return (
    <div>
      <form onSubmit={formApi.submitForm} id="form5">
        <label htmlFor="firstName4">First name</label>
        <Text field="firstName" id="firstName4" />
        <label htmlFor="hello2">Custom hello world</label>
        <CustomText field="hello" id="hello2" />
        <button type="submit" className="mb-4 btn btn-primary">Submit</button>
      </form>
      <br />
      <Data title="Values" reference="formApi.values" data={formApi.values} />
    </div>
  );

};

const CustomFormCode = () => {

  const code = `
  import { Form, Text, FormField } from 'react-form';

  // Define a custom message component
  const Message = ({ color, message }) => {
    return (
      <div className="mb-4" style={{ color }}>
        <small>{message}</small>
      </div>
    );
  }

  // Define your custom input
  // Note, the ...rest is important because it allows you to pass any
  // additional fields to the internal <input>.
  class CustomTextWrapper extends Component {

    render() {

      const {
        fieldApi,
        onInput,
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

      return (
        <div>
          <input
            value={getValue()}
            onInput={( e ) => {
              setValue(e.target.value);
              if ( onInput ) {
                onInput( e );
              }
            }}
            onBlur={() => {
              setTouched();
            }}
            {...rest} />
          { error ? <Message color="red" message={error} /> : null }
          { !error && warning ? <Message color="orange" message={warning} /> : null }
          { !error && !warning && success ? <Message color="green" message={success} /> : null }
        </div>
      );
    }
  }

  // Use the form field and your custom input together to create your very own input!
  // Note, You must use the child component syntax for creating custom inputs with form fields.
  const CustomText = FormField(CustomTextWrapper);

  const errorValidator = (values) => {
    return {
      hello: !values.hello || !values.hello.match( /Hello World/ ) ? "Input must contain 'Hello World'" : null
    };
  };

  const warningValidator = (values) => {
    return {
      hello: !values.hello ||
             !values.hello.match( /^Hello World$/ ) ? "Input should equal 'Hello World'" : null
    };
  };

  const successValidator = (values) => {
    return {
      hello: values.hello && values.hello.match( /Hello World/ ) ? "Thanks for entering 'Hello World'!" : null
    };
  };

  class FormWithCustomInput extends Component {
    render() {
      return (
        <div>
          <Form
            validateWarning={warningValidator}
            validateSuccess={successValidator}
            validateError={errorValidator}>
            { formApi => (
              <form onSubmit={formApi.submitForm} id="form5">
                <label htmlFor="firstName4">First name</label>
                <Text field="firstName" id="firstName4" />
                <label htmlFor="hello2">Custom hello world</label>
                <CustomText field="hello" id="hello2" />
                <button type="submit" className="mb-4 btn btn-primary">Submit</button>
              </form>
            )}
          </Form>
        </div>
      );
    }
  }
`;

  return (
    <div>
      <h5>Source Code:</h5>
      <Code type="html">
        {code}
      </Code>
    </div>
  );
};

const errorValidator = (values) => {
  return {
    hello: !values.hello || !values.hello.match( /Hello World/ ) ? "Input must contain 'Hello World'" : null
  };
};

const warningValidator = (values) => {
  return {
    hello: !values.hello ||
           !values.hello.match( /^Hello World$/ ) ? "Input should equal 'Hello World'" : null
  };
};

const successValidator = (values) => {
  return {
    hello: values.hello && values.hello.match( /Hello World/ ) ? "Thanks for entering 'Hello World'!" : null
  };
};

class CustomInput extends Component {

  constructor( props ) {
    super( props );
    this.state = {};
  }

  render() {

    return (
      <div>
        <h2 className="mb-4">Custom Input</h2>
        <p>
          If the out of the box inputs are not enough for you. You can simply
          customize them, by creating your very own input elements. This is done
          by leverageing the FormField HOC that is availible in react-form.
          Below is an example of a form that uses a custom input. Our custom input has
          internal error, success, and warning messages that know when to get shown.
        </p>
        <p>
          Play around with the Hello World field and see how the custom text input reacts.
        </p>
        <p>
          <strong> Hint: </strong> try typing {'"Foo", "Hello World", and "Hello World!!!"'}
        </p>
        <Form
          validateWarning={warningValidator}
          validateSuccess={successValidator}
          validateError={errorValidator}>
          <FormContent />
        </Form>
        <br />
        <CustomFormCode />
      </div>
    );
  }
}

export default CustomInput;
