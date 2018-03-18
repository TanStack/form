import React from 'react'
import { expect } from 'chai'
import sinon from 'sinon'
import { mount } from 'enzyme'
import { Form, Radio, RadioGroup } from '../../../src'


describe('RadioButton', () => {

  const sandbox = sinon.sandbox.create()

  beforeEach(() => {
    sandbox.restore()
  })

  it('should pass value to the vanilla input', () => {
    const wrapper = mount(<Radio id="radio-example-yes" value="yes" radioGroup={{}} />)
    const input = wrapper.find('input').at(0)
    expect(input.prop('value')).to.equal('yes')
  })

  it('should update value when user clicks radio', () => {
    let savedApi
    const wrapper = mount(
      <Form getApi={api => { savedApi = api }}>
        <RadioGroup field="happy">
          <Radio id="radio-example-yes" value="yes" />
          <Radio id="radio-example-no" value="no" />
        </RadioGroup>
      </Form>
    )
    const input = wrapper.find('input').at(0)
    input.simulate('change', { target: { checked: true } })
    expect(savedApi.getFormState().values).to.deep.equal({ happy: 'yes' })
  })

  it('should update error when user clicks radio and validator fails', () => {
    let savedApi
    const validate = () => 'Error!!'
    const wrapper = mount(
      <Form getApi={api => { savedApi = api }}>
        <RadioGroup field="happy" validate={validate}>
          <Radio id="radio-example-yes" value="yes" />
          <Radio id="radio-example-no" value="no" />
        </RadioGroup>
      </Form>
    )
    const input = wrapper.find('input').at(0)
    input.simulate('change', { target: { checked: true } })
    expect(savedApi.getFormState().errors).to.deep.equal({ happy: 'Error!!' })
  })

  it('should toggle value when user toggles value option', () => {
    let savedApi
    const wrapper = mount(
      <Form getApi={api => { savedApi = api }}>
        <RadioGroup field="happy">
          <Radio id="radio-example-yes" value="yes" />
          <Radio id="radio-example-no" value="no" />
        </RadioGroup>
      </Form>
    )
    const yes = wrapper.find('input').at(0)
    const no = wrapper.find('input').at(1)
    yes.simulate('change', { target: { checked: true } })
    expect(savedApi.getFormState().values).to.deep.equal({ happy: 'yes' })
    no.simulate('change', { target: { checked: true } })
    expect(savedApi.getFormState().values).to.deep.equal({ happy: 'no' })
    yes.simulate('change', { target: { checked: true } })
    expect(savedApi.getFormState().values).to.deep.equal({ happy: 'yes' })
  })

  it('should call onChange passed to Radio when value changes', () => {
    const spy = sandbox.spy()
    const wrapper = mount(
      <Form >
        <RadioGroup field="happy">
          <Radio id="radio-example-yes" value="yes" onChange={spy} />
          <Radio id="radio-example-no" value="no" />
        </RadioGroup>
      </Form>
    )
    const input = wrapper.find('input').at(0)
    input.simulate('change', { target: { checked: true } })
    expect(spy.called).to.equal(true)
    expect(spy.args[0][0].target.checked).to.equal(true)
  })

  it('should call onChange passed to RadioGroup when value changes', () => {
    const spy = sandbox.spy()
    const wrapper = mount(
      <Form >
        <RadioGroup field="happy" onChange={spy} >
          <Radio id="radio-example-yes" value="yes" />
          <Radio id="radio-example-no" value="no" />
        </RadioGroup>
      </Form>
    )
    const input = wrapper.find('input').at(0)
    input.simulate('change', { target: { checked: true } })
    expect(spy.called).to.equal(true)
    expect(spy.args[0][0].target.checked).to.equal(true)
  })

  it('should call onBlur passed to Radio when value changes', () => {
    const spy = sandbox.spy()
    const wrapper = mount(
      <Form >
        <RadioGroup field="happy">
          <Radio id="radio-example-yes" value="yes" onBlur={spy} />
          <Radio id="radio-example-no" value="no" />
        </RadioGroup>
      </Form>
    )
    const input = wrapper.find('input').at(0)
    input.simulate('change', { target: { checked: true } })
    input.simulate('blur')
    expect(spy.called).to.equal(true)
  })

  it('should call onBlur passed to RadioGroup when value changes', () => {
    const spy = sandbox.spy()
    const wrapper = mount(
      <Form >
        <RadioGroup field="happy" onBlur={spy}>
          <Radio id="radio-example-yes" value="yes" />
          <Radio id="radio-example-no" value="no" />
        </RadioGroup>
      </Form>
    )
    const input = wrapper.find('input').at(0)
    input.simulate('change', { target: { checked: true } })
    input.simulate('blur')
    expect(spy.called).to.equal(true)
  })

})
