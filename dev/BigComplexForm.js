/* ------------- Imports -------------- */
import React, { Component } from 'react';
import Data from './Data';

/* ------------- Form  Library Imports -------------- */
import {
  Form,
  Text,
  Radio,
  RadioGroup,
  NestedForm
} from '../src/index';

/* ------------------ Validators ----------------- */

const errorValidator = (values) => {

  const validateField = ( field ) => {
    if ( values[field] !== field ) {
      return `Not ${field}`;
    }
    return null;
  };

  const validateNickName = ( nickname ) => {
    if ( !nickname || nickname.length <= 1 ) {
      return 'Nickname must be longer than 1 character!';
    }
    return null;
  };

  const validateNicknames = ( ) => {
    if ( !values.nicknames || values.nicknames.length < 2 ) {
      return 'You must enter two nicknames!';
    }
    return values.nicknames.map( nickname => validateNickName(nickname) );
  };

  const validateFriend = ( friend ) => {
    if ( !friend.name || friend.name === '' ) {
      return 'Fried must have a name.';
    }
    return null;
  };

  const validateFriends = ( ) => {
    if ( !values.friends || values.friends.length < 2 ) {
      return 'You must enter two friends!';
    }
    return values.friends.map( friend => validateFriend(friend) );
  };

  return {
    foo: validateField('foo'),
    bar: validateField('bar'),
    baz: validateField('baz'),
    nicknames: validateNicknames(),
    friends: validateFriends(),
    hey: validateField('hey'),
    a: validateField('a'),
    b: validateField('b'),
    c: validateField('c'),
    d: validateField('d'),
    e: validateField('e'),
    f: validateField('f'),
    g: validateField('g'),
    h: validateField('h')
  };

};

const nestedErrorValidator = (values) => {

  const validateField = ( field ) => {
    if ( values[field] !== field ) {
      return `Not ${field}`;
    }
    return null;
  };

  return {
    red: validateField('red'),
    green: validateField('green'),
    blue: validateField('blue')
  };

};

const nestedNestedErrorValidator = (values) => {

  const validateField = ( field ) => {
    if ( values[field] !== field ) {
      return `Not ${field}`;
    }
    return null;
  };

  return {
    pizza: validateField('pizza'),
    burrito: validateField('burrito'),
    sandwich: validateField('sandwich')
  };

};

const mappedNestedErrorValidator = (values) => {

  const validateField = ( field ) => {
    if ( values[field] !== field ) {
      return `Not ${field}`;
    }
    return null;
  };

  return {
    one: validateField('one'),
    two: validateField('two')
  };

};

const hiddenFormErrorValidator = (values) => {

  const validateField = ( field ) => {
    if ( values[field] !== field ) {
      return `Not ${field}`;
    }
    return null;
  };

  return {
    oh: validateField('oh'),
    no: validateField('no'),
  };

};

/* --------------------- Forms --------------------*/

const NestedForm2 = () => {
  return (
    <div>
      <Text field="pizza" />
      <Text field="burrito" />
      <Text field="sandwich" />
    </div>
  );
};


const NestedForm1 = () => {
  return (
    <div>
      <Text field="red" />
      <Text field="green" />
      <Text field="blue" />
      <NestedForm field="food">
        <Form validateError={nestedNestedErrorValidator}>
          <NestedForm2 />
        </Form>
      </NestedForm>
    </div>
  );
};

const TestNestedForm = ({ index }) => {
  return (
    <NestedForm field={['forms', index]} key={`bar${index}`}>
      <Form validateError={mappedNestedErrorValidator} key={`foo${index}`}>
        <TestForm />
      </Form>
    </NestedForm>
  );
};

const TestForm = () => {
  return (
    <div>
      <Text field="one" />
      <Text field="two" />
    </div>
  );
};

const NestedForms = () => {
  return (
    <div>
      {
        [1, 2, 3].map( ( elem, index ) => {
          return <TestNestedForm index={`${index}`} key={`nested${elem}`} />;
        })
      }
    </div>
  );
};

const HiddenForm = () => {
  return (
    <div>
      <Text field="oh" />
      <Text field="no" />
    </div>
  );
};

const Group = ({ group }) => {
  return (
    <div className="mb-2">
      <label className="d-block">Hide form:</label>
      <label htmlFor="yes" className="mr-1">Yes</label>
      <Radio group={group} value="yes" id="yes" className="mr-2" />
      <label htmlFor="no" className="mr-1">No</label>
      <Radio group={group} value="no" id="no" />
    </div>
  );
};

const FormContent = ({ formApi, aprop, setProp }) => {

  const hidden = !formApi.values.hideform || formApi.values.hideform === 'yes';

  return (
    <div className="row">
      <div className="col-sm-4">
        <form onSubmit={formApi.submitForm} id="form1">
          <Text field="foo" />
          <Text field="bar" />
          <Text field="baz" />
          <Text field={['nicknames', 0]} />
          <Text field={['nicknames', 1]} />
          <Text field={`friends[0].name`} />
          <Text field={`friends[1].name`} />
          <Text field="hey" />
          <Text field="a" />
          <Text field="b" />
          <Text field="c" />
          <Text field="d" />
          <Text field="e" />
          <Text field="f" />
          <Text field="g" />
          <Text field="h" />
          <NestedForm field="color">
            <Form validateError={nestedErrorValidator}>
              <NestedForm1 aprop={aprop} />
            </Form>
          </NestedForm>
          <NestedForms />
          <RadioGroup field="hideform">
            <Group />
          </RadioGroup>
          { !hidden ?
            <NestedForm field="hidden">
              <Form validateError={hiddenFormErrorValidator}>
                <HiddenForm />
              </Form>
            </NestedForm> :
            null
          }
          <button type="submit" className="mb-2 btn btn-primary">Submit</button>
        </form>
        {/* <button type="button" onClick={setProp} key="propbutton" className="mb-2 btn btn-primary">SETPROP</button> */}
      </div>
      <div className="col-sm-8">
        <Data title="values" data={formApi.values} />
        <Data title="errors" data={formApi.errors} />
        <Data title="touched" data={formApi.touched} />
      </div>
    </div>
  );

};

class BigComplexForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      aprop: false,
      hidden: true,
      clicked: 0
    };
    this.setProp = this.setProp.bind(this);
  }

  setProp(e) {
    e.preventDefault();
    this.setState( (prevState) => {
      return { aprop: this.state.clicked % 2 === 0 ? !prevState.aprop : prevState.aprop, clicked: prevState.clicked + 1 };
    });
  }

  render() {

    return (
      <div>
        <h3>Big Complex Form</h3>
        <br />
        <h5 style={{ backgroundColor: 'red' }}>Docs for big complex form are a work in progress but still shows off powerfull stuff.</h5>
        <br />
        <p>You can make very compex forms with react-form. The below form includes the following:</p>
        <ul>
          <li>Normal Text fields</li>
          <li>Array of Text fields</li>
          <li>Nested form</li>
          <li>Nested nested form</li>
          <li>Array of nested forms</li>
          <li>Hidden form</li>
        </ul>
        <Form
          onSubmit={((values) => { console.log('SUBMIT:', values); })}
          formDidUpdate={ state => console.log( "STATE:", state )}
          validateError={errorValidator}>
          <FormContent aprop={this.state.aprop} setProp={this.setProp} />
        </Form>
      </div>
    );

  }

}

export default BigComplexForm;
