import React, { Component } from 'react'

class Data extends Component {
  render () {
    const { title, data, reference } = this.props

    const code = JSON.stringify(data, null, 2)

    return (
      <div className="mb-4">
        {title ? <h5 className="d-inline-block mr-3">{`${title}:`}</h5> : null}
        {reference ? (
          <span>
            (<code>{reference}</code>)
          </span>
        ) : null}
        <pre>
          <pre>
            <code className="language-json">{code}</code>
          </pre>
        </pre>
      </div>
    )
  }
}

export default Data
