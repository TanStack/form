import React, { Component } from 'react'
import { Form, MultiSelect } from '../../src/'


class MultiSelectExample extends Component {
  constructor (context, props) {
    super(context, props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      roles: ['admin', 'host', 'client'],
      selectedRoles: []
    }
  }
  handleSubmit (selectedRoles) {
    this.setState({
      selectedRoles: selectedRoles.roles
    })
  }
  render () {
    return (
      <div>
        <p>Multi select demo:</p>
        <Form onSubmit={this.handleSubmit}>
          {
            formApi => (
              <form onSubmit={formApi.submitForm}>
                <label className="label">Roles</label>
                <MultiSelect className="form-control" field="roles" options={this.state.roles} />
                <button className="btn btn-success" type="submit">Save</button>
              </form>
            )
          }
        </Form>
        <div className="row" style={{ marginTop: 12 }}>
          <div className="col-md-12">
            Selected Roles:
            {
              this.state.selectedRoles.map(r => (
                <b style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }} key={r}>{r}</b>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}
export default MultiSelectExample
