import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import { Form, Select } from '../../../src'


describe('Select', () => {
  const mkOpt = (label, value) => ({ label, value })

  const sandbox = sinon.sandbox.create()

  beforeEach(() => {
    sandbox.restore()
  })

  it('renders options and call onChange callback', () => {
    const opts = [mkOpt('o1', 'v1'), mkOpt('o2', 'v2')]
    const onChange = sinon.spy()
    const wrapper = mount(
      <Form>
        <Select options={opts} placeholder={false} onChange={onChange} />
      </Form>
    )
    const select = wrapper.find('select')
    const options = select.find('option')
    expect(options.length).to.equal(2)
    expect(options.at(0).text()).to.equal('o1')
    expect(options.at(1).text()).to.equal('o2')

    select.simulate('change', { target: { value: 1 } })
    expect(onChange.callCount).to.equal(1)
    expect(onChange.firstCall.args[0]).to.equal('v2')
  })


  it('renders optgroups', () => {
    const opts = [
      { label: 'og1', options: [mkOpt('o1', 'v1'), mkOpt('o2', 'v2')] },
      mkOpt('o3', 'v3'),
      { label: 'og2',
        options: [mkOpt('o4', 'v4'), mkOpt('o5', 'v5'), mkOpt('o6', 'v6')] },
    ]
    const wrapper = mount(
      <Form>
        <Select options={opts} placeholder={false} />
      </Form>
    )
    const select = wrapper.find('select')
    const options = select.find('option')
    expect(options.length).to.equal(6)

    const optgroups = select.find('optgroup')
    expect(optgroups.map(optg => optg.props().label)).to.deep.equal(
      ['og1', 'og2'])
  })
})
