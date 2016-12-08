import { Component } from 'jumpsuit'

export default Component({
  render () {
    return (
      <pre>
        <code className='language-jsx'>
          {this.props.children()}
        </code>
      </pre>
    )
  }
})
