import React from 'react'

export default React.createClass({
  render () {
    const { language, children } = this.props
    return (
      <pre>
        <code className={'language-' + (language || 'jsx')}>
          {children()}
        </code>
      </pre>
    )
  },
  componentDidUpdate () {
    window.Prism.highlightAll()
  }
})
