import { Component } from 'jumpsuit'

import CodeHighlight from 'components/codeHighlight'
import { Form, Text } from 'react-form'

const MyForm = Form({
  defaultValues: {
    firstName: '',
    lastName: '',
    hobby: ''
  }
})(Component({
  render () {
    const { submitForm } = this.props
    return (
      <form onSubmit={submitForm}>
        <Text
          field='firstName'
          placeholder='First Name'
        />
        <Text
          field='lastName'
          placeholder='Last Name'
        />
        <Text
          field='hobby'
          placeholder='Hobby'
        />
        <button>
          Submit
        </button>
      </form>
    )
  }
}))

export default Component({
  render () {
    return (
      <div>
        <div className='table-wrap'>
          <MyForm
            onSubmit={(values) => {
              window.alert(JSON.stringify(values, null, 2))
            }}
          />
        </div>
        <CodeHighlight>{getCode()}</CodeHighlight>
      </div>
    )
  }
})

function getCode () {
  return `
import { Form, Text } from '../../../lib/index.js'

const MyForm = Form({
  defaultValues: {
    firstName: '',
    lastName: '',
    hobby: ''
  }
})(({ submitForm }) => {
  return (
    <form onSubmit={submitForm}>
      <Text
        field='firstName'
      />
      <Text
        field='lastName'
      />
      <Text
        field='hobby'
      />
      <button>
        Submit
      </button>
    </form>
  )
})
  `
}
