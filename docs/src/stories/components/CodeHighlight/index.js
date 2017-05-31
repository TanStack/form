import React from 'react'
//
import './prism.css'
import './prism'

export default class CodeHighlight extends React.Component {
  render () {
    const { language, children } = this.props
    return (
      <pre>
        <code className={'language-' + (language || 'jsx')}>
          {children}
        </code>
      </pre>
    )
  }
  componentDidMount () {
    window.Prism.highlightAll()
  }
  componentDidUpdate () {
    window.Prism.highlightAll()
  }
}
