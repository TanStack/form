/* ------------- Imports -------------- */
import React, { Component } from 'react';
import { PrismCode } from 'react-prism';
import rawStyles from 'raw-loader!./styles.txt';

/* ------------- Form  Library Imports -------------- */
import {
  Form,
  Text
} from '../src/index';

import Data from './Data';

const formApiCodeExample = `
import { Form, Text } from 'react-savage-form';

const ExampleFormContent = (props) => {
  return (
    <form onSubmit={props.formApi.submitForm} id="form1">
      <label htmlFor="hello">Hello World</label>
      <Text field="hello" id="hello" />
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
}

const ExampleForm = ( ) => {
  return (
    <Form>
      <ExampleFormContent />
    </Form>
  );
}
`;

const formApiCodeExampleWithValidation = `
import { Form, Text } from 'react-savage-form';

const errorValidator = (values) => {
  return {
    hello: !values.hello ||
           !values.hello.match( /Hello World/ ) ? "Input must contain 'Hello World'" : null
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
    hello: values.hello &&
           values.hello.match( /Hello World/ ) ? "Thanks for entering 'Hello World'!" : null
  };
};

const ExampleFormContent = (props) => {
  return (
    <form onSubmit={props.formApi.submitForm} id="form1">
      <label htmlFor="hello">Hello World</label>
      <Text field="hello" id="hello" />
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
}

const ExampleForm = ( ) => {
  return (
    <Form
      validateWarning={warningValidator}
      validateSuccess={successValidator}
      validateError={errorValidator}>
      <ExampleFormContent />
    </Form>
  );
}
`;

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

const ExampleFormContent = (props) => {
  return (
    <div className="mb-4">
      <form onSubmit={props.formApi.submitForm} id="form1" className="mb-4">
        <label htmlFor="hello">Hello World</label>
        <Text field="hello" id="hello" />
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      <h5 className="mb-4">The <code>formApi</code> attributes:</h5>
      <FormApi formApi={props.formApi} />
    </div>
  );
};

const ExampleForm = ( ) => {
  return (
    <Form
      validateWarning={warningValidator}
      validateSuccess={successValidator}
      validateError={errorValidator}>
      <ExampleFormContent />
    </Form>
  );
};

const FormApi = ({ formApi }) => {
  return (
    <div>
      <table className="table" style={{ tableLayout: 'fixed' }}>
        <thead className="thead-inverse">
          <tr>
            <th style={{ width: '150px' }}>Attribute</th>
            <th>Example</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">values</th>
            <td><pre><PrismCode className="language-json">{JSON.stringify(formApi.values)}</PrismCode></pre></td>
            <td>
              Key value pair where key is the form <code>field</code> and value is the value entered or selected.
              Object is empty by default.
            </td>
          </tr>
          <tr>
            <th scope="row">touched</th>
            <td><pre><PrismCode className="language-json">{JSON.stringify(formApi.touched)}</PrismCode></pre></td>
            <td>
              Key value pair where key is the form <code>field</code> and value is true or undefined ( touched or untouched )
              Object is empty by default. Submitting form will cause all fields to be touched.
            </td>
          </tr>
          <tr>
            <th scope="row">errors</th>
            <td><pre><PrismCode className="language-json">{JSON.stringify(formApi.errors)}</PrismCode></pre></td>
            <td>
              Key value pair where key is the form <code>field</code> and value
              is the error associated with that field. Object is empty by
              default. If a <code>validateError</code> function is provided, then it will get
              called when the form mounts.
            </td>
          </tr>
          <tr>
            <th scope="row">warnings</th>
            <td><pre><PrismCode className="language-json">{JSON.stringify(formApi.warnings)}</PrismCode></pre></td>
            <td>
              Key value pair where key is the form <code>field</code> and value
              is the warning associated with that field. Object is empty by
              default. If a <code>validateWarning</code> function is provided, then it will get
              called when the form mounts.
            </td>
          </tr>
          <tr>
            <th scope="row">successes</th>
            <td><pre><PrismCode className="language-json">{JSON.stringify(formApi.successes)}</PrismCode></pre></td>
            <td>
              Key value pair where key is the form <code>field</code> and value
              is the success associated with that field. Object is empty by
              default. If a <code>validateSuccess</code> function is provided, then it will get
              called when the form mounts.
            </td>
          </tr>
          <tr>
            <th scope="row">submits</th>
            <td><pre><PrismCode className="language-json">{JSON.stringify(formApi.submits)}</PrismCode></pre></td>
            <td>
              Submission attempts. ( the number of times the submit button was clicked )
            </td>
          </tr>
          <tr>
            <th scope="row">submitted</th>
            <td><pre><PrismCode className="language-json">{JSON.stringify(formApi.submitted)}</PrismCode></pre></td>
            <td>
              If form was successfully submitted. ( only gets set once and only if form is NOT in error state )
            </td>
          </tr>
          <tr>
            <th scope="row">asyncValidations</th>
            <td><pre><PrismCode className="language-json">{JSON.stringify(formApi.asyncValidations)}</PrismCode></pre></td>
            <td>
              The number of asynchronous validations currently occuring.
              See the <a href="#async-validation">asynchronous validation section</a> of these docs for additional details.
            </td>
          </tr>
          <tr>
            <th scope="row">validating</th>
            <td><pre><PrismCode className="language-json">{JSON.stringify(formApi.validating)}</PrismCode></pre></td>
            <td>
              Key value pair where key is the form <code>field</code>, and value
              is a bool. Value is true when that field is activley validating, and falsey otherwise.
              See the <a href="#async-validation">asynchronous validation section</a> of these docs for additional details.
            </td>
          </tr>
          <tr>
            <th scope="row">validationFailures</th>
            <td><pre><PrismCode className="language-json">{JSON.stringify(formApi.validationFailures)}</PrismCode></pre></td>
            <td>
              The number of asynchronous validation failures that have occured. This value will get
              incimented each time an asynchronous validation fails, and decrimented if it succeeds.
              Note, it will NOT get incrimented twice for the same field.
              See the <a href="#async-validation">asynchronous validation section</a> of these docs for additional details.
            </td>
          </tr>
          <tr>
            <th scope="row">validationFailed</th>
            <td><pre><PrismCode className="language-json">{JSON.stringify(formApi.validationFailed)}</PrismCode></pre></td>
            <td>
              Key value pair where key is the form <code>field</code> and value
              is a bool. Value is true when that fields most recent async validation had a failure, and falsey otherwise.
              See the <a href="#async-validation">asynchronous validation section</a> of these docs for additional details.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const FormProps = () => {
  return (
    <div>
      <h3 className="mb-4">Form Props</h3>
      <table className="table" style={{ tableLayout: 'fixed' }}>
        <thead className="thead-inverse">
          <tr>
            <th style={{ width: '180px' }}>Name</th>
            <th style={{ width: '100px' }}>Type</th>
            <th style={{ width: '100px' }}>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"><code>children</code></th>
            <td><pre>node</pre></td>
            <td>yes</td>
            <td>React component that is given the form api as a prop.</td>
          </tr>
          <tr>
            <th scope="row"><code>onSubmit</code></th>
            <td><pre>func</pre></td>
            <td>no</td>
            <td>
              Function that gets called when form is submitted successfully.
              Function accepts the values as a parameter. <br />
              <pre><PrismCode className="language-jsx">onSubmit( values )</PrismCode></pre>
            </td>
          </tr>
          <tr>
            <th scope="row"><code>formDidUpdate</code></th>
            <td><pre>func</pre></td>
            <td>no</td>
            <td>
              Function that gets called when form updates.
              Function accepts the formApi as a parameter. <br />
              <pre><PrismCode className="language-jsx">formDidUpdate( formApi )</PrismCode></pre>
            </td>
          </tr>
          <tr>
            <th scope="row"><code>validateError</code></th>
            <td><pre>func</pre></td>
            <td>no</td>
            <td>
              Function that gets called when form performs validation.
              Function accepts the values as a parameter and must return errors
              object where the key is the field name, and the value is an error
              message or null<br />
              <pre><PrismCode className="language-jsx">validateError( values ) => {'{ firstName: null, lastName: "Last name is required"}'}</PrismCode></pre>
            </td>
          </tr>
          <tr>
            <th scope="row"><code>validateWarning</code></th>
            <td><pre>func</pre></td>
            <td>no</td>
            <td>
              Function that gets called when form performs validation.
              Function accepts the values as a parameter and must return warnings
              object where the key is the field name, and the value is an warning
              message or null<br />
              <pre><PrismCode className="language-jsx">validateWarning( values ) => {'{ firstName: null, lastName: "To short"}'}</PrismCode></pre>
            </td>
          </tr>
          <tr>
            <th scope="row"><code>validateSuccess</code></th>
            <td><pre>func</pre></td>
            <td>no</td>
            <td>
              Function that gets called when form performs validation.
              Function accepts the values and current errors as a parameters, and must return successes
              object where the key is the field name, and the value is an success
              message or null<br />
              <pre><PrismCode className="language-jsx">validateSuccess( values, errors ) => {'{ firstName: null, lastName: "Nice name!"}'}</PrismCode></pre>
            </td>
          </tr>
          <tr>
            <th scope="row"><code>asyncValidators</code></th>
            <td><pre>obj</pre></td>
            <td>no</td>
            <td>
              An object where the key is the field name, and the value is an asynchronous function.
              Each function accepts the value as a parameter, and must return a validation object,
              where the keys are one of ['error', 'warning', 'success'], and the value is a message or null.
              The function will get called when you tab out of the field for the associated function.
              If you do not want to overwrite the error, warning, or success values that were set by your syncronous validators,
              simply dont pass that parameter in the object you return.
              <br />
              <pre><PrismCode className="language-jsx">{'{ username: async () => { error: "Username already taken :(" } }'}</PrismCode></pre>
            </td>
          </tr>
          <tr>
            <th scope="row"><code>dontPreventDefault</code></th>
            <td><pre>bool</pre></td>
            <td>no</td>
            <td>
              Pass this in if you want to prevent the form submission from
               "preventingDefault". You would, for example, use this when you
               want to use a good old form submission using action="/foo.php"
               on your form. Note: if you are using form validators and the
               form has errors, i.e is in error state, then it will still prevent
               default, regardless of this prop.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

class Intro extends Component {

  render() {
    return (
      <div className="mb-4">
        <h3>Intro</h3>
        <p className="mb-4">
          Say hello to the best react form library you have ever used!
          <code>react-savage-form</code> is an extensive, simple, and efficient
          solution to creating simple to complex forms in react. Out of the box
          you get the ability to grab and manipulate values; set errors,
          warnings, and successes; customize your inputs, and much more!
        </p>
        <h3>Motivation</h3>
        <p className="mb-4">
          Simplicity and efficiency. This form works in IE! and its fast!
          There are many other libraries that exist, but they dont function in
          IE and, can get pretty complex. I must give credit to <a href="https://github.com/tannerlinsley/react-form">react-form</a> as
          this library was the inspiration for building <code>react-savage-form</code>.
        </p>
        <h3>Notes</h3>
        <p className="mb-4">
          Just wanted to point out that this webpage is styled with Bootstrap4,
          and the stylesheet you see below. The reason to point this out is
          that, by default, your inputs will not look the way mine do! Under
          the hood the default components are just inputs, selects, textareas,
          etc. I just added some simple styles to make them look good for
          presentation. So if you see classes in the example code like
          <code>"mb-4"</code>, or if you are quick to point out that inputs are
          not block elements by default dont freak out! Focus on the core
          structure of the forms.
        </p>
        <pre className="mb-4">
          <PrismCode className="language-css">
            {rawStyles}
          </PrismCode>
        </pre>
        <hr /><br />
        <FormProps />
        <hr /><br />
        <h3>Form Api</h3>
        <p className="mb-4">
          React Savage Form gives you access to the <code>formApi</code> through props.
          This works by passing the form Api as a prop to the direct child of
          the <code>&lt;Form&gt;</code>, see example below where we tie the
          <code>formApis.submitForm</code> to the native <code>&lt;form&gt;</code> onSubmit.
        </p>
        <h5>Source Code:</h5>
        <pre className="mb-4">
          <PrismCode className="language-jsx">
            {formApiCodeExample}
          </PrismCode>
        </pre>
        <h5>Rendered example:</h5>
        <p>
          Play around with the Hello World field and see how the api updates
          in the table! <strong>Hint:</strong> try typing {'"Foo", "Hello World", and "Hello World!!!"'}
        </p>
        <ExampleForm />
        <h5>Source code with validation:</h5>
        <p>
          The validation occured in the Hello World example above because of the
          validators that were passed in, see code below.
        </p>
        <pre className="mb-4">
          <PrismCode className="language-jsx">
            {formApiCodeExampleWithValidation}
          </PrismCode>
        </pre>
      </div>
    );
  }
}

export default Intro;
