import React from 'react'
import Form from '../src/form'
import FormError from '../src/formError'
import Text from '../src/formInputs/text'
import Select from '../src/formInputs/select'
import FormInputTextarea from '../src/formInputs/textarea'
import Checkbox from '../src/formInputs/checkbox'
import Radio from '../src/formInputs/radio'

const FormComponent = ({ values, submitForm, addValue, removeValue, getError }) => {
  return (
    <form onSubmit={submitForm}>

      <div>
        <h6>Full Name</h6>
        <Text // This is the built-in Text formInput
          field='name' // field is a string version of the field location
          placeholder='Your name' // all other props are sent through to the underlying component, in this case an <input />
        />
      </div>

      <div>
        <h6>Hobby</h6>
        <Text // This is the built-in Text formInput
          field='hobby' // field is a string version of the field location
          placeholder='Your hobbies' // all other props are sent through to the underlying component, in this case an <input />
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
        <FormInputTextarea // This is the built-in Textarea formInput
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

      <button>
        Submit
      </button>
    </form>
  )
}

const DemoForm = Form({
  defaultValues: {
    friends: []
  },

  validate: values => {
    const { name, hobby, status, friends } = values
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
      })
    }
  },

  onValidationFail () {
    window.alert('There is something wrong with your form!  Please check for any required values and try again :)')
  }
})(FormComponent)

export default DemoForm
