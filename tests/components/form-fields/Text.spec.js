import React from 'react'
import { expect } from 'chai'
import sinon from 'sinon'
import { mount } from 'enzyme'
import { Form, Text } from '../../../src'


describe('Text', () => {

  const sandbox = sinon.sandbox.create()

  beforeEach(() => {
    sandbox.restore()
  })

  it('should update value when user types', () => {
    let savedApi
    const wrapper = mount(
      <Form getApi={api => { savedApi = api }}>
        <Text field="greeting" />
      </Form>
    )
    const input = wrapper.find('input').at(0)
    input.simulate('change', { target: { value: 'Hello!' } })
    expect(savedApi.getFormState().values).to.deep.equal({ greeting: 'Hello!' })
  })

  it('validateOnSubmit should prevent validation until the form has been submitted', done => {
    let savedApi
    const validate = greeting => greeting === 'Foo' ? 'ooo thats no good' : null
    const wrapper = mount(
      <Form
        getApi={api => { savedApi = api }}>
        {api => (
          <form onSubmit={api.submitForm}>
            <Text field="greeting" validateOnSubmit validate={validate} />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
    const input = wrapper.find('input')
    input.simulate('change', { target: { value: 'Foo' } })
    expect(savedApi.getFormState().errors).to.equal(undefined)
    const button = wrapper.find('button')
    button.simulate('submit')
    setImmediate(() => {
      expect(savedApi.getFormState().errors).to.deep.equal({ greeting: 'ooo thats no good' })
      done()
    })
  })


})
