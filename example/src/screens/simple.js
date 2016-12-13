import React from 'react'

import CodeHighlight from 'components/codeHighlight'
import { Form, Text, Select, Textarea, Checkbox, Radio, NestedForm, FormError } from 'react-form'

// To create a new form, simply call `Form(config)(component)`

const MyForm = Form({
  // This is our config for the form. Think of it as the default props for your Form :)

  // Let's give the form some hard-coded default values
  defaultValues: {
    friends: []
  },

  // Validating your form is super easy, just use the `validate` life-cycle method
  validate: values => {
    const { name, hobby, status, friends, address } = values
    return {
      name: !name ? 'A name is required' : undefined,
      hobby: (hobby && hobby.length < 5) ? 'Your hobby must be at least 5 characters long' : false,
      status: !status ? 'A status is required' : null,
      friends: (!friends || !friends.length) ? 'You need at least one friend!' : friends.map(friend => {
        const { name, relationship } = friend
        return {
          name: !name ? 'A name is required' : undefined,
          relationship: !relationship ? 'A relationship is required' : undefined
        }
      }),
      address: !address ? 'A valid address is required' : 0
    }
  },

  // `onValidationFail` is another handy form life-cycle method
  onValidationFail () {
    window.alert('There is something wrong with your form!  Please check for any required values and try again :)')
  }
})(({ values, errors, touched, nestedErrors, dirty, submitForm, addValue, removeValue, getError }) => {
  // This is a stateless component, but you can use any valid react component to render your form.
  // Forms also supply plenty of useful props for your components to utilize. See the docs for a complete list.
  return (
    // When the form is submitted, call the `sumbitForm` callback prop
    <form onSubmit={submitForm}>

      <div>
        <h6>Full Name</h6>
        <Text // This is the built-in Text formInput
          field='name' // field is a string version of the field location
          placeholder='Your name' // all other props are sent through to the underlying component, in this case an <input />
        />
      </div>

      <div>
        <h6>Relationship Status</h6>
        <Select // This is the built-in Select formInput
          field='status'
          options={[{ // You can ship it some options like usual
            label: 'Single',
            value: 'single'
          }, {
            label: 'In a Relationship',
            value: 'relationship'
          }, {
            label: 'It\'s Complicated',
            value: 'complicated'
          }]}
        />
      </div>

      <div>
        <h6>Short Bio</h6>
        <Textarea // This is the built-in Textarea formInput
          field='bio'
          placeholder='Short Bio'
        />
      </div>

      {/* Arrays in forms are super easy to handle */}
      <h6>Friends</h6>
      {/* This is a custom form error for the root of the friends list (see validation function) */}
      <FormError field='friends' />
      <div className='nested'>
        {!values.friends.length ? (
          <em>No friends have been added yet</em>
        ) : values.friends.map((friends, i) => ( // Loop over the values however you'd like
          <div key={i}>

            <div>
              <h6>Full Name</h6>
              <Text
                field={['friends', i, 'name']} // You can easily pass an array-style field path. Perfect for passing down as props or nested values
                placeholder='Friend Name'
              />
            </div>

            <div>
              <h6>Relationship</h6>
              <Select
                field={`friends.${i}.relationship`} // If you don't like arrays, you can also use a string template
                options={[{
                  label: 'Friend',
                  value: 'friend'
                }, {
                  label: 'Acquaintance',
                  value: 'acquaintance'
                }, {
                  label: 'Colleague',
                  value: 'colleague'
                }]}
              />
            </div>

            <button // This button will remove this friend from the `friends` field
              type='button'
              onClick={() => removeValue('friends', i)} // `removeValue` takes a field location for an array, and the index for the item to remove
            >
              Remove Friend
            </button>

          </div>
        ))}
      </div>

      <div>
        <button // This button will add a new blank friend item to the `friends` field
          type='button'
          onClick={() => addValue('friends', {})} // `addValue` takes an array-like field, and the value to add
        >
          Add Friend
        </button>
      </div>

      <div>
        <h6>Address</h6>
        {/* An address has a couple of parts to it, and will probably have its own validation function. */}
        {/* Let's make it reusable by using a nested form */}
        <NestedForm
          form={AddressForm} // This is just another form that we built below
          field='address' // The results of this nested form will be set to this field value on this form.
        />
      </div>

      <div>
        <label>
          <Checkbox // This is the built-in checkbox formInput
            field='createAccount'
          />
          <span>Create Account?</span>
        </label>
      </div>

      <div>
        <h6>Notify me via</h6>
        <radiogroup>
          <label>
            <Radio // This is the built-in radio formInput
              field='notificationType'
              value='email'
            />
            <span>Email</span>
          </label>
          <label>
            <Radio // This is the built-in radio formInput
              field='notificationType'
              value='text'
            />
            <span>Text</span>
          </label>
          <label>
            <Radio // This is the built-in radio formInput
              field='notificationType'
              value='phone'
            />
            <span>Phone</span>
          </label>
        </radiogroup>
      </div>

      <br />
      <br />

      {/* // Since this is the parent form, let's put a submit button in there ;) */}
      {/* // You can submit your form however you want, as long as you call the `submitForm` callback */}
      <button>
        Submit
      </button>

      <br />
      <br />
      <hr />
      <br />

      <strong>Values</strong>
      <CodeHighlight language='javascript'>
        {() => JSON.stringify(values, null, 2)}
      </CodeHighlight>
      <strong>Errors</strong>
      <CodeHighlight language='javascript'>
        {() => JSON.stringify(errors, null, 2)}
      </CodeHighlight>
      <strong>Nest Forms with Errors</strong>
      <CodeHighlight language='javascript'>
        {() => JSON.stringify(nestedErrors, null, 2)}
      </CodeHighlight>
      <strong>Touched</strong>
      <CodeHighlight language='javascript'>
        {() => JSON.stringify(touched, null, 2)}
      </CodeHighlight>
      <strong>Form is Dirty</strong>
      <CodeHighlight language='javascript'>
        {() => `${!!dirty}`}
      </CodeHighlight>
    </form>
  )
})

// This is our reusable address form
const AddressForm = Form({
  // It can have its own validation function!
  validate: values => {
    return {
      street: !values.street ? 'A street is required' : undefined,
      city: !values.city ? 'A city is required' : undefined,
      state: !values.state ? 'A state is required' : undefined
    }
  }
})(() => {
  return (
    <div>
      <Text
        field='street'
        placeholder='Street'
      />
      <br />
      <Text
        field='city'
        placeholder='City'
      />
      <br />
      <Text
        field='state'
        placeholder='State'
      />
    </div>
  )
})

export default () => {
  return (
    <div>
      <div className='table-wrap'>
        <MyForm
          onSubmit={(values) => {
            window.alert(JSON.stringify(values, null, 2))
          }}
          // For more available props, see the docs!
        />
      </div>
      <CodeHighlight>
        {getCode}
      </CodeHighlight>
    </div>
  )
}

function getCode () {
  return `
import React from 'react'
import { Form, Text, Select, Textarea, Checkbox, Radio, NestedForm, FormError } from 'react-form'

// To create a new form, simply call \`Form(config)(component)\`

const MyForm = Form({
  // This is our config for the form. Think of it as the default props for your Form :)

  // Let's give the form some hard-coded default values
  defaultValues: {
    friends: []
  },

  // Validating your form is super easy, just use the \`validate\` life-cycle method
  validate: values => {
    const { name, hobby, status, friends, address } = values
    return {
      name: !name ? 'A name is required' : undefined,
      hobby: (hobby && hobby.length < 5) ? 'Your hobby must be at least 5 characters long' : false,
      status: !status ? 'A status is required' : null,
      friends: (!friends || !friends.length) ? 'You need at least one friend!' : friends.map(friend => {
        const { name, relationship } = friend
        return {
          name: !name ? 'A name is required' : undefined,
          relationship: !relationship ? 'A relationship is required' : undefined
        }
      }),
      address: !address ? 'A valid address is required' : 0
    }
  },

  // \`onValidationFail\` is another handy form life-cycle method
  onValidationFail () {
    window.alert('There is something wrong with your form!  Please check for any required values and try again :)')
  }
})(({ values, submitForm, addValue, removeValue, getError }) => {
  // This is a stateless component, but you can use any valid react component to render your form.
  // Forms also supply plenty of useful props for your components to utilize. See the docs for a complete list.
  return (
    // When the form is submitted, call the \`sumbitForm\` callback prop
    <form onSubmit={submitForm}>

      <div>
        <h6>Full Name</h6>
        <Text // This is the built-in Text formInput
          field='name' // field is a string version of the field location
          placeholder='Your name' // all other props are sent through to the underlying component, in this case an <input />
        />
      </div>

      <div>
        <h6>Relationship Status</h6>
        <Select // This is the built-in Select formInput
          field='status'
          options={[{ // You can ship it some options like usual
            label: 'Single',
            value: 'single'
          }, {
            label: 'In a Relationship',
            value: 'relationship'
          }, {
            label: 'It\'s Complicated',
            value: 'complicated'
          }]}
        />
      </div>

      <div>
        <h6>Short Bio</h6>
        <Textarea // This is the built-in Textarea formInput
          field='bio'
          placeholder='Short Bio'
        />
      </div>

      {/* Arrays in forms are super easy to handle */}
      <h6>Friends</h6>
      {/* This is a custom form error for the root of the friends list (see validation function) */}
      <FormError field='friends' />
      <div className='nested'>
        {!values.friends.length ? (
          <em>No friends have been added yet</em>
        ) : values.friends.map((friends, i) => ( // Loop over the values however you'd like
          <div key={i}>

            <div>
              <h6>Full Name</h6>
              <Text
                field={['friends', i, 'name']} // You can easily pass an array-style field path. Perfect for passing down as props or nested values
                placeholder='Friend Name'
              />
            </div>

            <div>
              <h6>Relationship</h6>
              <Select
                field={\`friends.\${i}.relationship\`} // If you don't like arrays, you can also use a string template
                options={[{
                  label: 'Friend',
                  value: 'friend'
                }, {
                  label: 'Acquaintance',
                  value: 'acquaintance'
                }, {
                  label: 'Colleague',
                  value: 'colleague'
                }]}
              />
            </div>

            <button // This button will remove this friend from the \`friends\` field
              type='button'
              onClick={() => removeValue('friends', i)} // \`removeValue\` takes a field location for an array, and the index for the item to remove
            >
              Remove Friend
            </button>

          </div>
        ))}
      </div>

      <div>
        <button // This button will add a new blank friend item to the \`friends\` field
          type='button'
          onClick={() => addValue('friends', {})} // \`addValue\` takes an array-like field, and the value to add
        >
          Add Friend
        </button>
      </div>

      <div>
        <h6>Address</h6>
        {/* An address has a couple of parts to it, and will probably have its own validation function. */}
        {/* Let's make it reusable by using a nested form */}
        <NestedForm
          form={AddressForm} // This is just another form that we built below
          field='address' // The results of this nested form will be set to this field value on this form.
        />
      </div>

      <div>
        <label>
          <Checkbox // This is the built-in checkbox formInput
            field='createAccount'
          />
          <span>Create Account?</span>
        </label>
      </div>

      <div>
        <h6>Notify me via</h6>
        <radiogroup>
          <label>
            <Radio // This is the built-in radio formInput
              field='notificationType'
              value='email' // This is the value the field will be set to when this radio button is active
            />
            <span>Email</span>
          </label>
          <label>
            <Radio
              field='notificationType'
              value='text'
            />
            <span>Text</span>
          </label>
          <label>
            <Radio
              field='notificationType'
              value='phone'
            />
            <span>Phone</span>
          </label>
        </radiogroup>
      </div>

      <br />
      <br />

      {/* // Since this is the parent form, let's put a submit button in there ;) */}
      {/* // You can submit your form however you want, as long as you call the \`submitForm\` callback */}
      <button>
        Submit
      </button>
    </form>
  )
})

// This is our reusable address form
const AddressForm = Form({
  // It can have its own validation function!
  validate: values => {
    return {
      street: !values.street ? 'A street is required' : undefined,
      city: !values.city ? 'A city is required' : undefined,
      state: !values.state ? 'A state is required' : undefined
    }
  }
})(() => {
  return (
    <div>
      <Text
        field='street'
        placeholder='Street'
      />
      <br />
      <Text
        field='city'
        placeholder='City'
      />
      <br />
      <Text
        field='state'
        placeholder='State'
      />
    </div>
  )
})

export default () => {
  return (
    <div>
      <div className='table-wrap'>
        <MyForm
          onSubmit={(values) => {
            window.alert(JSON.stringify(values, null, 2))
          }}
          // For more available props, see the docs!
        />
      </div>
    </div>
  )
}
  `
}
