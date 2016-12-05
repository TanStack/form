import { Component } from 'jumpsuit'

import CodeHighlight from 'components/codeHighlight'
import { Form, Text, Select, Checkbox, Textarea, NestedForm } from 'react-form'

const MyNestedForm = Form({
  validate: values => {
    return {
      moreNotes: !values.moreNotes ? 'Required' : undefined
    }
  }
})(({values}) => {
  return (
    <div>
      <Textarea
        field='moreNotes'
        placeholder='More Notes'
      />
    </div>
  )
})

const MyForm = Form({
  defaultValues: {
    status: 'available',
    createAccount: true
  },
  validate: values => {
    return {
      firstName: !values.firstName ? 'Required' : undefined,
      lastName: !values.lastName ? 'Required' : undefined,
      hobby: !values.hobby ? 'Required' : undefined
    }
  }
})(Component({
  render () {
    const { values, errors, nestedErrors, touched, submitForm } = this.props
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

        <Select
          field='status'
          options={[{
            label: 'Available',
            value: 'available'
          }, {
            label: 'Unavailable',
            value: 'unavailable'
          }]}
        />

        <Textarea
          field='notes'
          placeholder='Notes'
        />

        <NestedForm
          field='nestedFormValues'
          form={MyNestedForm}
        />

        <label>
          Create Account
          <Checkbox
            field='createAccount'
          />
        </label>

        <button>
          Submit
        </button>

        <br />
        <br />
        <br />

        <strong>Values</strong>
        <CodeHighlight>
          {JSON.stringify(values, null, 2)}
        </CodeHighlight>
        <strong>Errors</strong>
        <CodeHighlight>
          {JSON.stringify(errors, null, 2)}
        </CodeHighlight>
        <strong>Nest Forms with Errors</strong>
        <CodeHighlight>
          {JSON.stringify(nestedErrors, null, 2)}
        </CodeHighlight>
        <strong>Touched</strong>
        <CodeHighlight>
          {JSON.stringify(touched, null, 2)}
        </CodeHighlight>
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
import { Form, Text } from 'react-form'

const MyForm = Form({
  validate: values => {
    return {
      firstName: !values.firstName ? 'Required' : undefined,
      lastName: !values.lastName ? 'Required' : undefined,
      hobby: !values.hobby ? 'Required' : undefined
    }
  }
})(({ submitForm }) => {
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
      <Select
        field='status'
        options={[{
          label: 'Available',
          value: 'available'
        }, {
          label: 'Unavailable',
          value: 'unavailable'
        }]}
      />
      <Textarea
        field='notes'
        placeholder='Notes'
      />
      <NestedForm
        field='nestedFormValues'
        form={MyNestedForm}
      />
      <button>
        Submit
      </button>
    </form>
  )
})

const MyNestedForm = Form({
  validate: values => {
    return {
      moreNotes: !values.moreNotes ? 'moreNotes' : undefined
    }
  }
})(({values}) => {
  return (
    <div>
      <Textarea
        field='moreNotes'
        placeholder='More Notes'
      />
    </div>
  )
})


export default props => {
  return (
    <MyForm
      onSubmit={(values) => {
        window.alert(JSON.stringify(values, null, 2))
      }}
    />
  )
}
  `
}
