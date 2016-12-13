import { Component } from 'jumpsuit'

export default Component({
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
