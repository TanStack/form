import React from 'react'
import { expect } from 'chai'
import sinon from 'sinon'
import { mount } from 'enzyme'
import { Form, MultiSelect } from '../../../src'

describe('MultiSelect', () => {
  const sandbox = sinon.sandbox.create()

  beforeEach(() => {
    sandbox.restore()
  })

  it('should update value when user selects/deselects the option', () => {
    let savedApi
    const wrapper = mount(
      <Form getApi={api => { savedApi = api }} defaultValues={{ roles: ['xyz'] }}>
        <MultiSelect field="roles" options={['xyz', 'pqr']} />
      </Form>
    )
    const select = wrapper.find('select').at(0)
    expect(select.props().value).to.deep.equal(['xyz'])
    select.simulate('change', { target: { value: 'pqr' } })
    expect(savedApi.getFormState().values).to.deep.equal({ roles: ['xyz', 'pqr'] })
    select.simulate('change', { target: { value: 'pqr' } })
    expect(savedApi.getFormState().values).to.deep.equal({ roles: ['xyz'] })
  })

  it('check if no default value is given', () => {
    let savedApi
    const wrapper = mount(
      <Form getApi={api => { savedApi = api }}>
        <MultiSelect field="roles" options={['xyz', 'pqr']} />
      </Form>
    )
    const select = wrapper.find('select').at(0)
    expect(select.props().value).to.deep.equal([])
    select.simulate('change', { target: { value: 'pqr' } })
    expect(savedApi.getFormState().values).to.deep.equal({ roles: ['pqr'] })
    select.simulate('change', { target: { value: 'xyz' } })
    expect(savedApi.getFormState().values).to.deep.equal({ roles: ['pqr', 'xyz'] })
  })
})
