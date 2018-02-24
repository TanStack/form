import React from 'react'
import { expect } from 'chai'
import sinon from 'sinon'
import Enzyme, { mount } from 'enzyme'
// import Adapter from 'enzyme-adapter-react-16'

// Enzyme.configure({ adapter: new Adapter() })

import { Form, Text } from '../../src'

describe('Form', () => {
  const sandbox = sinon.sandbox.create()

  const checkFormApi = api => {
    expect(api).to.have.own.property('getError')
    expect(api).to.have.own.property('getSuccess')
    expect(api).to.have.own.property('getTouched')
    expect(api).to.have.own.property('getValue')
    expect(api).to.have.own.property('getWarning')
    expect(api).to.have.own.property('getFormState')
    expect(api).to.have.own.property('resetAll')
    expect(api).to.have.own.property('setError')
    expect(api).to.have.own.property('setSuccess')
    expect(api).to.have.own.property('setTouched')
    expect(api).to.have.own.property('setAllTouched')
    expect(api).to.have.own.property('setValue')
    expect(api).to.have.own.property('setAllValues')
    expect(api).to.have.own.property('setWarning')
    expect(api).to.have.own.property('submitForm')
    expect(api).to.have.own.property('setWarning')
    expect(api).to.have.own.property('swapValues')
    expect(api).to.have.own.property('removeValue')
    expect(api).to.have.own.property('addValue')
  }

  const checkFormState = state => {
    const formState = {
      values: {},
      touched: {},
      validationFailures: 0,
      asyncValidations: 0,
      submitted: false,
      submits: 0,
      submitting: false
    }
    expect(JSON.stringify(state)).to.deep.equal(JSON.stringify(formState))
  }

  const getState = state => {
    const defaultState = {
      values: {},
      touched: {},
      submitted: false,
      submits: 0,
      submitting: false,
      validationFailures: 0,
      asyncValidations: 0
    }
    return Object.assign({}, defaultState, state)
  }

  beforeEach(() => {
    sandbox.restore()
  })

  it('should call onChange function when value changes', () => {
    const spy = sandbox.spy()
    const wrapper = mount(<Form onChange={spy}>{() => <Text field="greeting" />}</Form>)
    const input = wrapper.find('input')
    input.simulate('change', { target: { value: 'hello' } })
    expect(spy.called).to.equal(true)
    expect(spy.args[0][0].values).to.deep.equal({ greeting: 'hello' })
  })

  it('should call onSubmit function with values when the form is submitted', done => {
    const spy = sandbox.spy()
    const wrapper = mount(
      <Form onSubmit={spy}>
        {api => (
          <form onSubmit={api.submitForm}>
            <Text field="greeting" />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    const input = wrapper.find('input')
    input.simulate('change', { target: { value: 'hello' } })
    const button = wrapper.find('button')
    button.simulate('submit')
    setImmediate(() => {
      expect(spy.called).to.equal(true)
      expect(spy.args[0][0]).to.deep.equal({ greeting: 'hello' })
      done()
    })
  })

  it('should call preventDefault when the form is submitted', done => {
    const spy = sandbox.spy()
    const wrapper = mount(
      <Form onSubmit={() => {}}>
        {api => (
          <form onSubmit={api.submitForm}>
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    const button = wrapper.find('button')
    button.simulate('submit', {
      preventDefault: spy
    })
    setImmediate(() => {
      expect(spy.called).to.equal(true)
      done()
    })
  })

  it('should call not preventDefault if set to false', done => {
    const spy = sandbox.spy()
    const wrapper = mount(
      <Form onSubmit={() => {}} preventDefault={false}>
        {api => (
          <form onSubmit={api.submitForm}>
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    const button = wrapper.find('button')
    button.simulate('submit', {
      preventDefault: spy
    })
    setImmediate(() => {
      expect(spy.called).to.equal(false)
      done()
    })
  })

  it('should NOT call onSubmit function with values when the invalid form is submitted', done => {
    const spy = sandbox.spy()
    let api
    const setApi = param => {
      api = param
    }
    const wrapper = mount(
      <Form onSubmit={spy} getApi={setApi}>
        {api => (
          <form onSubmit={api.submitForm}>
            <Text field="greeting" />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    api.setError('greeting', 'error')
    const button = wrapper.find('button')
    button.simulate('submit')
    setImmediate(() => {
      expect(spy.called).to.equal(false)
      done()
    })
  })

  it('should call onSubmitFailure function with errors when the invalid form is submitted', done => {
    const spy = sandbox.spy()
    let api
    const setApi = param => {
      api = param
    }
    const wrapper = mount(
      <Form onSubmitFailure={spy} getApi={setApi}>
        {api => (
          <form onSubmit={api.submitForm}>
            <Text field="greeting" />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    api.setError('greeting', 'error')
    const button = wrapper.find('button')
    button.simulate('submit')
    setImmediate(() => {
      expect(spy.called).to.equal(true)
      expect(spy.args[0][0]).to.deep.equal({ greeting: 'error' })
      done()
    })
  })

  it('should call preSubmit function with values when the form is submitted', done => {
    const spy = sandbox.spy()
    const wrapper = mount(
      <Form preSubmit={spy}>
        {api => (
          <form onSubmit={api.submitForm}>
            <Text field="greeting" />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    const input = wrapper.find('input')
    input.simulate('change', { target: { value: 'hello' } })
    const button = wrapper.find('button')
    button.simulate('submit')
    setImmediate(() => {
      expect(spy.called).to.equal(true)
      expect(spy.args[0][0]).to.deep.equal({ greeting: 'hello' })
      done()
    })
  })

  it('should update submitted when the form is submitting', done => {
    let savedApi
    const setApi = param => {
      savedApi = param
    }
    const wrapper = mount(
      <Form getApi={setApi}>
        {api => (
          <form onSubmit={api.submitForm}>
            <Text field="greeting" />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    const input = wrapper.find('input')
    input.simulate('change', { target: { value: 'hello' } })
    const button = wrapper.find('button')
    button.simulate('submit')
    setImmediate(() => {
      expect(savedApi.getFormState().submitted).to.equal(true)
      done()
    })
  })

  it('should update submits when the form has been submitted', done => {
    let savedApi
    const setApi = param => {
      savedApi = param
    }
    const wrapper = mount(
      <Form getApi={setApi}>
        {api => (
          <form onSubmit={api.submitForm}>
            <Text field="greeting" />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    const input = wrapper.find('input')
    input.simulate('change', { target: { value: 'hello' } })
    const button = wrapper.find('button')
    button.simulate('submit')
    setImmediate(() => {
      expect(savedApi.getFormState().submits).to.equal(1)
      done()
    })
  })

  it('getApi should give the passed function the formApi', () => {
    let api
    const setApi = param => {
      api = param
    }
    mount(<Form getApi={setApi}>{() => <Text field="greeting" />}</Form>)
    checkFormApi(api)
  })

  it('should set default values when default values are passed', () => {
    let api
    const setApi = param => {
      api = param
    }
    mount(
      <Form getApi={setApi} defaultValues={{ greeting: 'hello' }}>
        {() => <Text field="greeting" />}
      </Form>
    )
    expect(api.getFormState().values).to.deep.equal({ greeting: 'hello' })
  })

  it('setFormState should set the formState', () => {
    let api
    const setApi = param => {
      api = param
    }
    mount(<Form getApi={setApi}>{() => <Text field="greeting" />}</Form>)
    api.setFormState({ values: { greeting: 'hello' } })
    expect(api.getFormState().values).to.deep.equal({ greeting: 'hello' })
  })

  it('resetAll should reset the form to its initial state', () => {
    let api
    const setApi = param => {
      api = param
    }
    mount(<Form getApi={setApi}>{() => <Text field="greeting" />}</Form>)
    api.setFormState({ values: { greeting: 'hello' } })
    expect(api.getFormState()).to.deep.equal(getState({ values: { greeting: 'hello' } }))
    api.resetAll()
    expect(api.getFormState()).to.deep.equal(getState())
  })

  it('setValue should set a value', () => {
    let api
    const setApi = param => {
      api = param
    }
    mount(<Form getApi={setApi}>{() => <Text field="greeting" />}</Form>)
    api.setValue('greeting', 'hello')
    expect(api.getFormState()).to.deep.equal(getState({ values: { greeting: 'hello' } }))
  })

  it('setError should set an error', () => {
    let api
    const setApi = param => {
      api = param
    }
    mount(<Form getApi={setApi}>{() => <Text field="greeting" />}</Form>)
    api.setError('greeting', 'error')
    expect(api.getFormState()).to.deep.equal(getState({ errors: { greeting: 'error' } }))
  })

  it('setWarning should set a warning', () => {
    let api
    const setApi = param => {
      api = param
    }
    mount(<Form getApi={setApi}>{() => <Text field="greeting" />}</Form>)
    api.setWarning('greeting', 'warning')
    expect(api.getFormState()).to.deep.equal(getState({ warnings: { greeting: 'warning' } }))
  })

  it('setWarning should set a success', () => {
    let api
    const setApi = param => {
      api = param
    }
    mount(<Form getApi={setApi}>{() => <Text field="greeting" />}</Form>)
    api.setSuccess('greeting', 'success')
    expect(api.getFormState()).to.deep.equal(getState({ successes: { greeting: 'success' } }))
  })

  it('should give child function access to formApi', done => {
    const inputs = api => {
      checkFormApi(api)
      done()
    }
    mount(<Form>{api => inputs(api)}</Form>)
  })

  it('form Api should conain all properties and functions', done => {
    const inputs = api => {
      checkFormApi(api)
      done()
    }
    mount(<Form>{api => inputs(api)}</Form>)
  })

  it('should give render function access to formApi and formState', done => {
    const inputs = api => {
      checkFormApi(api)
      checkFormState(api)
      done()
    }
    mount(<Form render={inputs} />)
  })

  it('should give component passed in access to formApi as prop', () => {
    const Inputs = () => null
    const comp = mount(<Form component={Inputs} />)
    const inputs = comp.find('Inputs')
    expect(inputs.length).to.equal(1)
    checkFormApi(inputs.props().formApi)
  })

  it('errors should update when input is changed', done => {
    const validate = values => ({
      name: values.name === 'Foo' ? 'ooo thats no good' : null
    })
    let api
    const setApi = param => {
      api = param
    }
    const wrapper = mount(
      <Form validate={validate} getApi={setApi}>
        <Text field="name" />
      </Form>
    )
    expect(api.getFormState().errors).to.equal(undefined)
    const input = wrapper.find('input')
    input.simulate('change', { target: { value: 'Foo' } })
    setImmediate(() => {
      expect(api.getFormState().errors).to.deep.equal({ name: 'ooo thats no good' })
      done()
    })
  })

  it('warnings should update when input is changed', done => {
    const validate = name => ({
      warning: name === 'Foo' ? 'ooo thats no good' : null
    })
    let api
    const setApi = param => {
      api = param
    }
    const wrapper = mount(
      <Form getApi={setApi}>
        <Text field="name" validate={validate} />
      </Form>
    )
    expect(api.getFormState().errors).to.equal(undefined)
    const input = wrapper.find('input')
    input.simulate('change', { target: { value: 'Foo' } })
    setImmediate(() => {
      expect(api.getFormState().warnings).to.deep.equal({ name: 'ooo thats no good' })
      done()
    })
  })

  it('successes should update when input is changed', done => {
    const validate = name => ({
      success: name === 'Foo' ? 'ooo thats awesome!' : null
    })
    let api
    const setApi = param => {
      api = param
    }
    const wrapper = mount(
      <Form getApi={setApi}>
        <Text field="name" validate={validate} />
      </Form>
    )
    expect(api.getFormState().errors).to.equal(undefined)
    const input = wrapper.find('input')
    input.simulate('change', { target: { value: 'Foo' } })
    setImmediate(() => {
      expect(api.getFormState().successes).to.deep.equal({ name: 'ooo thats awesome!' })
      done()
    })
  })

  describe('option flag', () => {
    it('validateOnSubmit should prevent validation until the form has been submitted', done => {
      let api
      const validate = values => ({
        greeting: values.greeting === 'Foo' ? 'ooo thats no good' : null
      })
      const wrapper = mount(
        <Form
          getApi={param => {
            api = param
          }}
          validate={validate}
          validateOnSubmit
        >
          {api => (
            <form onSubmit={api.submitForm}>
              <Text field="greeting" />
              <button type="submit">Submit</button>
            </form>
          )}
        </Form>
      )
      const input = wrapper.find('input')
      input.simulate('change', { target: { value: 'Foo' } })
      expect(api.getFormState()).to.deep.equal(
        getState({
          values: { greeting: 'Foo' }
        })
      )
      const button = wrapper.find('button')
      button.simulate('submit')
      setImmediate(() => {
        expect(api.getFormState().errors).to.deep.equal({ greeting: 'ooo thats no good' })
        done()
      })
    })

    it('validateOnMount should validate on mount', done => {
      let api
      const validate = values => ({
        greeting: values.greeting === 'Foo' ? 'ooo thats no good' : null
      })
      const wrapper = mount(
        <Form
          getApi={param => {
            api = param
          }}
          validate={validate}
          defaultValues={{ greeting: 'Foo' }}
          validateOnMount>
          {api => (
            <form onSubmit={api.submitForm}>
              <Text field="greeting" />
              <button type="submit">Submit</button>
            </form>
          )}
        </Form>
      )
      setImmediate(() => {
        expect(api.getFormState().errors).to.deep.equal({ greeting: 'ooo thats no good' })
        done()
      })
    })
  })

  it('should call onSubmitFailure function when submit throws', done => {
    const spy = sandbox.spy()
    const error = new Error('Submission Error')
    const wrapper = mount(
      <Form
        onSubmitFailure={spy}
        onSubmit={() => {
          throw error
        }}
      >
        {({ submitForm }) => (
          <form onSubmit={submitForm}>
            <Text field="greeting" />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    const button = wrapper.find('button')
    button.simulate('submit')
    setImmediate(() => {
      expect(spy.called).to.equal(true)
      const { args: [[validationErrors, submitError]] } = spy
      expect(validationErrors).to.deep.equal({})
      expect(submitError).to.equal(error)
      done()
    })
  })

  it('should call onSubmitFailure function when submit throws (async)', done => {
    const spy = sandbox.spy()
    const error = new Error('Submission Error')
    const wrapper = mount(
      <Form
        onSubmitFailure={spy}
        onSubmit={async () => {
          throw error
        }}
      >
        {({ submitForm }) => (
          <form onSubmit={submitForm}>
            <Text field="greeting" />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    const button = wrapper.find('button')
    button.simulate('submit')
    setImmediate(() => {
      expect(spy.called).to.equal(true)
      const { args: [[validationErrors, submitError]] } = spy
      expect(validationErrors).to.deep.equal({})
      expect(submitError).to.equal(error)
      done()
    })
  })
})
