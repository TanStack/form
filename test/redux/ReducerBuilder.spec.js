import { expect } from 'chai';

import ReducerBuilder from '../../src/redux/ReducerBuilder';
import {
  SET_VALUE,
  SET_ERROR,
  SET_WARNING,
  SET_SUCCESS,
  SET_TOUCHED,
  PRE_VALIDATE,
  VALIDATE,
  SUBMITS,
  SUBMITTED,
  RESET
} from '../../src/redux/actions';
import * as actions from '../../src/redux/actions';

describe('ReducerBuilder', () => {

  describe('generated reducer', () => {

    const getState = (state) => {
      const defaultState = {
        values: {},
        touched: {},
        errors: {},
        warnings: {},
        successes: {},
        asyncErrors: {},
        asyncWarnings: {},
        asyncSuccesses: {},
        submitted: false,
        submits: 0,
        validating: {},
        validationFailed: {},
        validationFailures: 0,
        asyncValidations: 0,
      };
      return Object.assign({}, defaultState, state)
    };

    it('has an initial state', () => {
      const reducer = ReducerBuilder.build();
      const expectedState = getState();
      const action = { type: 'NOTHING' };
      const nextState = reducer(undefined, action);
      expect(nextState).to.deep.equal(expectedState);
    });

    it(`handles ${SET_VALUE}`, () => {
      const reducer = ReducerBuilder.build();
      const expectedState = getState({ values: { foo: 'bar' } });
      const action = actions.setValue('foo', 'bar');
      const nextState = reducer(undefined, action);
      expect(nextState).to.deep.equal(expectedState);
    });

    it(`handles ${SET_ERROR}`, () => {
      const reducer = ReducerBuilder.build();
      const expectedState = getState({ errors: { foo: 'bar' } });
      const action = actions.setError('foo', 'bar');
      const nextState = reducer(undefined, action);
      expect(nextState).to.deep.equal(expectedState);
    });

    it(`handles ${SET_WARNING}`, () => {
      const reducer = ReducerBuilder.build();
      const expectedState = getState({ warnings: { foo: 'bar' } });
      const action = actions.setWarning('foo', 'bar');
      const nextState = reducer(undefined, action);
      expect(nextState).to.deep.equal(expectedState);
    });

    it(`handles ${SET_SUCCESS}`, () => {
      const reducer = ReducerBuilder.build();
      const expectedState = getState({ successes: { foo: 'bar' } });
      const action = actions.setSuccess('foo', 'bar');
      const nextState = reducer(undefined, action);
      expect(nextState).to.deep.equal(expectedState);
    });

    it(`handles ${SET_TOUCHED}`, () => {
      const reducer = ReducerBuilder.build();
      const expectedState = getState({ touched: { foo: true } });
      const action = actions.setTouched('foo', true);
      const nextState = reducer(undefined, action);
      expect(nextState).to.deep.equal(expectedState);
    });

    it(`handles ${PRE_VALIDATE}`, () => {
      const reducer = ReducerBuilder.build({
        preValidate: ( values ) => { return { foo: values.foo + 'baz'} }
      });
      const expectedState = getState({ values: { foo: 'barbaz' } });
      const action1 = actions.setValue('foo', 'bar');
      const state1 = reducer(undefined, action1);
      const action2 = actions.preValidate();
      const state2 = reducer(state1, action2);
      expect(state2).to.deep.equal(expectedState);
    });

    it(`handles ${VALIDATE}`, () => {
      const reducer = ReducerBuilder.build({
        validateError: ( ) => { return { foo: 'error!!'} }
      });
      const expectedState = getState({ values: { foo: 'bar' }, errors: { foo: 'error!!' } });
      const action1 = actions.setValue('foo', 'bar');
      const state1 = reducer(undefined, action1);
      const action2 = actions.validate();
      const state2 = reducer(state1, action2);
      expect(state2).to.deep.equal(expectedState);
    });

    it(`handles ${SUBMITTED}`, () => {
      const reducer = ReducerBuilder.build();
      const expectedState = getState({ submitted: true });
      const action = actions.submitted();
      const nextState = reducer(undefined, action);
      expect(nextState).to.deep.equal(expectedState);
    });

    it(`handles ${SUBMITS}`, () => {
      const reducer = ReducerBuilder.build();
      const expectedState = getState({ submits: 1 });
      const action = actions.submits();
      const nextState = reducer(undefined, action);
      expect(nextState).to.deep.equal(expectedState);
    });

    it(`handles ${RESET}`, () => {
      const reducer = ReducerBuilder.build();
      const expectedState = getState({
        errors: { foo: null },
        warnings: { foo: null },
        successes: { foo: null },
        asyncErrors: { foo: null },
        asyncWarnings: { foo: null },
        asyncSuccesses: { foo: null },
        values: { foo: null },
        touched: { foo: null },
      });
      const action1 = actions.setValue('foo', 'bar');
      const state1 = reducer(undefined, action1);
      const action2 = actions.reset('foo');
      const state2 = reducer(state1, action2);
      expect(state2).to.deep.equal(expectedState);
    });

    // it('can be used with reduce', () => {
    //   const actionsToReduce = [
    //   ];
    //
    //   const expectedFinalState = {
    //     data: {
    //       name: 'testGuy',
    //     },
    //     isFetching: false,
    //   };
    //
    //   const finalState = actions.reduce(reducer, undefined);
    //
    //   expect(finalState).to.deep.equal( expectedFinalState );
    //
    // });


  });

});
