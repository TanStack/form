import { expect } from 'chai'

import ReducerBuilder from '../../src/redux/ReducerBuilder'
import * as actions from '../../src/redux/actions'

const {
  SET_FORM_STATE,
  SET_VALUE,
  SET_ALL_VALUES,
  SET_ERROR,
  SET_WARNING,
  SET_SUCCESS,
  SET_TOUCHED,
  SET_ALL_TOUCHED,
  PRE_VALIDATE,
  VALIDATE,
  SUBMITS,
  SUBMITTED,
  SUBMITTING,
  RESET,
  RESET_ALL,
  VALIDATING_FIELD,
  DONE_VALIDATING_FIELD,
  VALIDATION_FAILURE,
  VALIDATION_SUCCESS,
  SET_ASYNC_ERROR,
  SET_ASYNC_WARNING,
  SET_ASYNC_SUCCESS,
  REMOVE_ASYNC_ERROR,
  REMOVE_ASYNC_WARNING,
  REMOVE_ASYNC_SUCCESS,
  CLEAR_ALL,
} = actions

describe('ReducerBuilder', () => {
  describe('generated reducer', () => {
    const getState = state => {
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
        submitting: false,
        validating: {},
        validationFailed: {},
        validationFailures: 0,
        asyncValidations: 0,
      }
      return Object.assign({}, defaultState, state)
    }

    it('has an initial state', () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState()
      const action = { type: 'NOTHING' }
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_FORM_STATE}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ values: { foo: 'bar' }, submits: 3 })
      const action = actions.setFormState(expectedState)
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_VALUE}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ values: { foo: 'bar' } })
      const action = actions.setValue('foo', 'bar')
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_ALL_VALUES}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ values: { foo: 'bar', baz: 'taz' } })
      const action = actions.setAllValues({ foo: 'bar', baz: 'taz' })
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_ERROR}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ errors: { foo: 'bar' } })
      const action = actions.setError('foo', 'bar')
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_WARNING}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ warnings: { foo: 'bar' } })
      const action = actions.setWarning('foo', 'bar')
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_SUCCESS}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ successes: { foo: 'bar' } })
      const action = actions.setSuccess('foo', 'bar')
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_TOUCHED}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ touched: { foo: true } })
      const action = actions.setTouched('foo', true)
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_ALL_TOUCHED}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ touched: { foo: true, baz: true } })
      const action = actions.setAllTouched({ foo: true, baz: true })
      const nextState = reducer(getState({ touched: { foo: false, baz: false } }), action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${PRE_VALIDATE}`, () => {
      const reducer = ReducerBuilder.build({
        preValidate: values => ({ foo: `${values.foo}baz` }),
      })
      const expectedState = getState({ values: { foo: 'barbaz' } })
      const action1 = actions.setValue('foo', 'bar')
      const state1 = reducer(undefined, action1)
      const action2 = actions.preValidate()
      const state2 = reducer(state1, action2)
      expect(state2).to.deep.equal(expectedState)
    })

    it(`handles ${VALIDATE}`, () => {
      const reducer = ReducerBuilder.build({
        validateError: () => ({ foo: 'error!!' }),
      })
      const expectedState = getState({ values: { foo: 'bar' }, errors: { foo: 'error!!' } })
      const action1 = actions.setValue('foo', 'bar')
      const state1 = reducer(undefined, action1)
      const action2 = actions.validate()
      const state2 = reducer(state1, action2)
      expect(state2).to.deep.equal(expectedState)
    })

    it(`handles ${SUBMITTED}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ submitted: true })
      const action = actions.submitted()
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SUBMITS}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ submits: 1 })
      const action = actions.submits()
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SUBMITTING}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ submitting: true })
      const action = actions.submitting(true)
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${RESET}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({
        errors: { foo: undefined },
        warnings: { foo: undefined },
        successes: { foo: undefined },
        asyncErrors: { foo: undefined },
        asyncWarnings: { foo: undefined },
        asyncSuccesses: { foo: undefined },
        values: { foo: undefined },
        touched: { foo: undefined },
      })
      const action1 = actions.setValue('foo', 'bar')
      const state1 = reducer(undefined, action1)
      const action2 = actions.reset('foo')
      const state2 = reducer(state1, action2)
      expect(state2).to.deep.equal(expectedState)
    })

    it(`handles ${RESET_ALL}`, () => {
      const reducer = ReducerBuilder.build({ defaultValues: { foo: 'foo' } })
      const expectedState = getState({ values: { foo: 'foo' } })
      const action1 = actions.setValue('foo', 'bar')
      const state1 = reducer(undefined, action1)
      const action2 = actions.resetAll()
      const state2 = reducer(state1, action2)
      expect(state2).to.deep.equal(expectedState)
    })

    it(`handles ${CLEAR_ALL}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState()
      const action1 = actions.setValue('foo', 'bar')
      const state1 = reducer(undefined, action1)
      const action2 = actions.clearAll()
      const state2 = reducer(state1, action2)
      expect(state2).to.deep.equal(expectedState)
    })

    it(`handles ${VALIDATING_FIELD}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ asyncValidations: 1, validating: { foo: true } })
      const action = actions.validatingField('foo')
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${DONE_VALIDATING_FIELD}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState1 = getState({ asyncValidations: 1, validating: { foo: true } })
      const expectedState2 = getState({ validating: { foo: false } })
      const action1 = actions.validatingField('foo')
      const state1 = reducer(undefined, action1)
      expect(state1).to.deep.equal(expectedState1)
      const action2 = actions.doneValidatingField('foo')
      const state2 = reducer(state1, action2)
      expect(state2).to.deep.equal(expectedState2)
    })

    it(`handles ${VALIDATION_FAILURE}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ validationFailures: 1, validationFailed: { foo: true } })
      const action = actions.validationFailure('foo')
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${VALIDATION_SUCCESS}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState1 = getState({ validationFailures: 1, validationFailed: { foo: true } })
      const expectedState2 = getState({ validationFailed: { foo: false } })
      const action1 = actions.validationFailure('foo')
      const state1 = reducer(undefined, action1)
      expect(state1).to.deep.equal(expectedState1)
      const action2 = actions.validationSuccess('foo')
      const state2 = reducer(state1, action2)
      expect(state2).to.deep.equal(expectedState2)
    })

    it(`handles ${SET_ASYNC_ERROR}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ asyncErrors: { foo: 'error' } })
      const action = actions.setAsyncError('foo', 'error')
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_ASYNC_WARNING}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ asyncWarnings: { foo: 'warning' } })
      const action = actions.setAsyncWarning('foo', 'warning')
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_ASYNC_SUCCESS}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ asyncSuccesses: { foo: 'success' } })
      const action = actions.setAsyncSuccess('foo', 'success')
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${REMOVE_ASYNC_ERROR}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ asyncErrors: {} })
      const action = actions.removeAsyncError('foo')
      const initialState = getState({ asyncErrors: { foo: 'error' } })
      const nextState = reducer(initialState, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${REMOVE_ASYNC_WARNING}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ asyncWarnings: {} })
      const action = actions.removeAsyncWarning('foo')
      const initialState = getState({ asyncWarnings: { foo: 'warning' } })
      const nextState = reducer(initialState, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${REMOVE_ASYNC_SUCCESS}`, () => {
      const reducer = ReducerBuilder.build()
      const expectedState = getState({ asyncSuccesses: {} })
      const action = actions.removeAsyncSuccess('foo')
      const initialState = getState({ asyncSuccesses: { foo: 'success' } })
      const nextState = reducer(initialState, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it('can be used with reduce', () => {
      const reducer = ReducerBuilder.build()

      const actionsToReduce = [
        actions.setValue('foo', 'bar'),
        actions.setValue('baz', 'hello'),
        actions.setAsyncError('foo', 'error'),
        actions.submitted(),
      ]

      const expectedFinalState = getState({
        values: {
          foo: 'bar',
          baz: 'hello',
        },
        asyncErrors: {
          foo: 'error',
        },
        submitted: true,
      })

      const finalState = actionsToReduce.reduce(reducer, undefined)

      expect(finalState).to.deep.equal(expectedFinalState)
    })
  })
})
