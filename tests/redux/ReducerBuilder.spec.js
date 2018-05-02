import { expect } from 'chai'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import BuildReducer from '../../src/redux/BuildReducer'
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
  SET_DIRTY,
  SET_ALL_DIRTY
} = actions

describe('BuildReducer', () => {

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  describe('generated reducer', () => {
    const getState = state => {
      const defaultState = {
        values: {},
        touched: {},
        errors: undefined,
        warnings: undefined,
        successes: undefined,
        asyncErrors: undefined,
        asyncWarnings: undefined,
        asyncSuccesses: undefined,
        submitted: false,
        submits: 0,
        submitting: false,
        validating: undefined,
        validationFailed: undefined,
        validationFailures: 0,
        asyncValidations: 0,
        dirty: {}
      }
      return Object.assign({}, defaultState, state)
    }

    it('has an initial state', () => {
      const reducer = BuildReducer()
      const expectedState = getState()
      const action = { type: 'NOTHING' }
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_FORM_STATE}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ values: { foo: 'bar' }, submits: 3 })
      const action = actions.setFormState(expectedState)
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_VALUE}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ values: { foo: 'bar' } })
      const action = actions.setValue({ field: 'foo', value: 'bar' })
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_ALL_VALUES}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ values: { foo: 'bar', baz: 'taz' } })
      const action = actions.setAllValues({ foo: 'bar', baz: 'taz' })
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_ERROR}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ errors: { foo: 'bar' } })
      const action = actions.setError({ field: 'foo', value: 'bar' })
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_WARNING}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ warnings: { foo: 'bar' } })
      const action = actions.setWarning({ field: 'foo', value: 'bar' })
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_SUCCESS}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ successes: { foo: 'bar' } })
      const action = actions.setSuccess({ field: 'foo', value: 'bar' })
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_TOUCHED}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ touched: { foo: true } })
      const action = actions.setTouched({ field: 'foo', value: true })
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_ALL_TOUCHED}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ touched: { foo: true, baz: true } })
      const action = actions.setAllTouched({ foo: true, baz: true })
      const nextState = reducer(getState({ touched: { foo: false, baz: false } }), action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${PRE_VALIDATE}`, () => {
      const store = mockStore(getState({ values: { foo: 'bar' } }))
      const preValidate = value => `${value}baz`
      const expectedActions = [
        actions.setValue({ field: 'foo', value: 'barbaz' })
      ]
      store.dispatch(actions.preValidate({ field: 'foo', validator: preValidate }))
      expect(store.getActions()).to.deep.equal(expectedActions)
    })

    it(`handles ${VALIDATE}`, () => {
      const store = mockStore(getState())
      const validateError = () => 'error!!'
      const expectedActions = [
        actions.setError({ field: ['foo'], value: 'error!!' })
      ]
      store.dispatch(actions.validate({ field: 'foo', validator: validateError }))
      expect(store.getActions()).to.deep.equal(expectedActions)
    })

    it('handles ASYNC_VALIDATE', () => {
      const store = mockStore(getState())
      const validateError = async () => new Promise(res => res('error!!'))
      const expectedActions = [
        actions.validatingField('foo'),
        actions.setAsyncError({ field: ['foo'], value: 'error!!' }),
        actions.validationSuccess('foo'),
        actions.doneValidatingField('foo')
      ]
      return store.dispatch(actions.asyncValidate({ field: 'foo', validator: validateError,   validationPromiseIDs: new Map() })).then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
      })
    })

    it(`handles ${SUBMITTED}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ submitted: true })
      const action = actions.submitted()
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SUBMITS}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ submits: 1 })
      const action = actions.submits()
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SUBMITTING}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ submitting: true })
      const action = actions.submitting(true)
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${RESET}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({
        errors: undefined,
        warnings: undefined,
        successes: undefined,
        asyncErrors: undefined,
        asyncWarnings: undefined,
        asyncSuccesses: undefined,
        values: {
          foo: undefined
        },
        touched: {
          foo: undefined
        },
        dirty: {
          foo: undefined
        }
      })
      const action1 = actions.setValue({ field: 'foo', value: 'bar' })
      const state1 = reducer(undefined, action1)
      const action2 = actions.reset({ field: ['foo'] })
      const state2 = reducer(state1, action2)
      expect(state2).to.deep.equal(expectedState)
    })

    it(`handles ${RESET_ALL}`, () => {
      const reducer = BuildReducer({ defaultValues: { foo: 'foo' } })
      const expectedState = getState({ values: { foo: 'foo' } })
      const action1 = actions.setValue({ field: 'foo', value: 'bar' })
      const state1 = reducer(undefined, action1)
      const action2 = actions.resetAll()
      const state2 = reducer(state1, action2)
      expect(state2).to.deep.equal(expectedState)
    })

    it(`handles ${CLEAR_ALL}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState()
      const action1 = actions.setValue({ field: 'foo', value: 'bar' })
      const state1 = reducer(undefined, action1)
      const action2 = actions.clearAll()
      const state2 = reducer(state1, action2)
      expect(state2).to.deep.equal(expectedState)
    })

    it(`handles ${VALIDATING_FIELD}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ asyncValidations: 1, validating: { foo: true } })
      const action = actions.validatingField('foo')
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${DONE_VALIDATING_FIELD}`, () => {
      const reducer = BuildReducer()
      const expectedState1 = getState({ asyncValidations: 1, validating: { foo: true } })
      const expectedState2 = getState({ validating: undefined })
      const action1 = actions.validatingField('foo')
      const state1 = reducer(undefined, action1)
      expect(state1).to.deep.equal(expectedState1)
      const action2 = actions.doneValidatingField('foo')
      const state2 = reducer(state1, action2)
      expect(state2).to.deep.equal(expectedState2)
    })

    it(`handles ${VALIDATION_FAILURE}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ validationFailures: 1, validationFailed: { foo: 'error' } })
      const action = actions.validationFailure({ field: 'foo', value: 'error' })
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${VALIDATION_SUCCESS}`, () => {
      const reducer = BuildReducer()
      const expectedState1 = getState({ validationFailures: 1, validationFailed: { foo: 'error' } })
      const expectedState2 = getState({ validationFailed: undefined })
      const action1 = actions.validationFailure({ field: 'foo', value: 'error' })
      const state1 = reducer(undefined, action1)
      expect(state1).to.deep.equal(expectedState1)
      const action2 = actions.validationSuccess('foo')
      const state2 = reducer(state1, action2)
      expect(state2).to.deep.equal(expectedState2)
    })

    it(`handles ${SET_ASYNC_ERROR}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ asyncErrors: { foo: 'error' } })
      const action = actions.setAsyncError({ field: 'foo', value: 'error' })
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_ASYNC_WARNING}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ asyncWarnings: { foo: 'warning' } })
      const action = actions.setAsyncWarning({ field: 'foo', value: 'warning' })
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it(`handles ${SET_ASYNC_SUCCESS}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ asyncSuccesses: { foo: 'success' } })
      const action = actions.setAsyncSuccess({ field: 'foo', value: 'success' })
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })

    it('can be used with reduce', () => {
      const reducer = BuildReducer()

      const actionsToReduce = [
        actions.setValue({ field: 'foo', value: 'bar' }),
        actions.setValue({ field: 'baz', value: 'hello' }),
        actions.setAsyncError({ field: 'foo', value: 'error' }),
        actions.submitted()
      ]

      const expectedFinalState = getState({
        values: {
          foo: 'bar',
          baz: 'hello'
        },
        asyncErrors: {
          foo: 'error'
        },
        submitted: true
      })

      const finalState = actionsToReduce.reduce(reducer, undefined)

      expect(finalState).to.deep.equal(expectedFinalState)
    })
    it(`handles ${SET_DIRTY}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ dirty: { foo: true } })
      const action = actions.setDirty({ field: 'foo', value: true })
      const nextState = reducer(undefined, action)
      expect(nextState).to.deep.equal(expectedState)
    })
    it(`handles ${SET_ALL_DIRTY}`, () => {
      const reducer = BuildReducer()
      const expectedState = getState({ dirty: { foo: true, baz: true } })
      const action = actions.setAllDirty({ foo: true, baz: true })
      const nextState = reducer(getState({ dirty: { foo: false, baz: false } }), action)
      expect(nextState).to.deep.equal(expectedState)
    })
  })
})
