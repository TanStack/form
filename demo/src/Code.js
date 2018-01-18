/* ------------- Imports -------------- */
import React, { Component } from 'react'
// import { PrismCode } from 'react-prism';

class Code extends Component {
  render () {
    const { children } = this.props

    return (
      <code>
        <pre>{children}</pre>
      </code>
    )

    // return (
    //   <pre>
    //     <pre><code className="language-jsx">{children}</code></pre>
    //   </pre>
    // )
  }
}

export default Code
