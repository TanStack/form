import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Form, Text } from '../../src';

describe('ReduxForm', () => {

  const sandbox = sinon.sandbox.create();

  const formApi = {
    values: {},
    errors: {},
    warnings: {},
    successes: {},
    touched: {},
    asyncValidations: 0,
    validating: {},
    validationFailures: 0,
    validationFailed: {},
    submitted: false,
    submits: 0
  };

  beforeEach(() => {
    sandbox.restore();
  });

  it('should call formDidUpdate function when value changes', () => {
    const spy = sandbox.spy();
    const wrapper = mount(
      <Form formDidUpdate={spy}>
        { () => <Text field="greeting" /> }
      </Form>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'hello' } });
    setImmediate( () => {
      expect(spy.called).to.equal( true );
      expect(spy.args[0][0].values).to.deep.equal({ greeting: 'hello' });
    });
  });

  it('should give child function access to formApi', (done) => {
    const inputs = ( api ) => {
      expect( JSON.stringify( api ) ).to.deep.equal( JSON.stringify( formApi ) );
      done();
    };
    mount(<Form >{ api => inputs(api) }</Form>);
  });

  it('form Api should conain all properties and functions', (done) => {
    const inputs = ( api ) => {
      expect( JSON.stringify( api ) ).to.deep.equal( JSON.stringify( formApi ) );
      expect( api ).to.have.own.property( 'getError' );
      expect( api ).to.have.own.property( 'getSuccess' );
      expect( api ).to.have.own.property( 'getTouched' );
      expect( api ).to.have.own.property( 'getValue' );
      expect( api ).to.have.own.property( 'getWarning' );
      expect( api ).to.have.own.property( 'registerAsyncValidation' );
      expect( api ).to.have.own.property( 'reset' );
      expect( api ).to.have.own.property( 'resetAll' );
      expect( api ).to.have.own.property( 'format' );
      expect( api ).to.have.own.property( 'setError' );
      expect( api ).to.have.own.property( 'setSuccess' );
      expect( api ).to.have.own.property( 'setTouched' );
      expect( api ).to.have.own.property( 'setValue' );
      expect( api ).to.have.own.property( 'setAllValues' );
      expect( api ).to.have.own.property( 'setWarning' );
      expect( api ).to.have.own.property( 'submitForm' );
      expect( api ).to.have.own.property( 'setWarning' );
      expect( api ).to.have.own.property( 'swapValues' );
      expect( api ).to.have.own.property( 'removeValue' );
      expect( api ).to.have.own.property( 'validatingField' );
      expect( api ).to.have.own.property( 'addValue' );
      expect( api ).to.have.own.property( 'doneValidatingField' );
      done();
    };
    mount(<Form >{ api => inputs(api) }</Form>);
  });

  it('should give render function access to formApi', (done) => {
    const inputs = ( api ) => {
      expect( JSON.stringify( api ) ).to.deep.equal( JSON.stringify( formApi ) );
      done();
    };
    mount(<Form render={inputs} />);
  });

  it('should give child component access to formApi as prop', (done) => {
    const Inputs = ( props ) => {
      expect( JSON.stringify( props.formApi ) ).to.deep.equal( JSON.stringify( formApi ) );
      done();
    };
    mount(<Form ><Inputs /></Form>);
  });

  it('should give component passed in access to formApi as prop', () => {
    const Inputs = () => null;
    const comp = mount(<Form component={Inputs} />);
    const inputs = comp.find('Inputs');
    expect( inputs.length ).to.equal( 1 );
    expect( JSON.stringify( inputs.props().formApi ) ).to.equal( JSON.stringify( formApi ) );
  });

  it('errors should update when input is changed', () => {
    const validate = ( values ) => {
      return {
        name: values.name === 'Foo' ? 'ooo thats no good' : null
      };
    };
    let currentErrors;
    const inputs = ( { errors } ) => {
      currentErrors = errors;
      return ( <Text field="name" /> );
    };
    const wrapper = mount(<Form validateError={validate}>{ api => inputs(api) }</Form>);
    expect( currentErrors ).to.deep.equal({ name: null });
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Foo' } });
    expect( currentErrors ).to.deep.equal({ name: 'ooo thats no good' });
  });

  it('warnings should update when input is changed', () => {
    const validate = ( values ) => {
      return {
        name: values.name === 'Foo' ? 'ooo thats no good' : null
      };
    };
    let currentWarnings;
    const inputs = ( { warnings } ) => {
      currentWarnings = warnings;
      return ( <Text field="name" /> );
    };
    const wrapper = mount(<Form validateWarning={validate}>{ api => inputs(api) }</Form>);
    expect( currentWarnings ).to.deep.equal({ name: null });
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Foo' } });
    expect( currentWarnings ).to.deep.equal({ name: 'ooo thats no good' });
  });

  it('successes should update when input is changed', () => {
    const validate = ( values ) => {
      return {
        name: values.name === 'Foo' ? 'ooo thats awesome!' : null
      };
    };
    let currentSuccesses;
    const inputs = ( { successes } ) => {
      currentSuccesses = successes;
      return ( <Text field="name" /> );
    };
    const wrapper = mount(<Form validateSuccess={validate}>{ api => inputs(api) }</Form>);
    expect( currentSuccesses ).to.deep.equal({ name: null });
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Foo' } });
    expect( currentSuccesses ).to.deep.equal({ name: 'ooo thats awesome!' });
  });

});
