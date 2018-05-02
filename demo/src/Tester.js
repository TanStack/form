
/* ------------- Imports -------------- */
import React, { Component } from 'react'

/* ------------- Form  Library Imports -------------- */
import { Form, Radio, RadioGroup } from '../../src/'

// const allValues = [0, 1, 2, 3, 4, 5]
//
// class CustomInput extends Component {
//   validate = (value, field) => {
//     //console.log(field, 'validating')
//     return !value || value.length < 3 ? 'Min. 3 characters' : null
//   };
//
//   render () {
//     const { field } = this.props
//     return (
//       <Field validate={value => this.validate(value, field)} field={field}>
//         {fieldApi => {
//           //console.log("rendering field", fieldApi.fieldName);
//           const { value, error, setValue, setTouched } = fieldApi
//           return (
//             <div>
//               <h4>CustomInput Name:</h4>
//               <input
//                 className="form-control"
//                 value={value}
//                 onChange={({ target: { value } }) => setValue(value)}
//                 onBlur={() => setTouched()}
//               />
//               <div>error: {error}</div>
//             </div>
//           )
//         }}
//       </Field>
//     )
//   }
// }
//
// class TestForm extends Component {
//   render () {
//     return (
//       <div>
//         <Form onChange={(api)=>console.log(JSON.stringify(api.errors))}>
//           {() =>
//             allValues.map((value, index) => (
//               <CustomInput key={"foo" + index} field={["items", index]} />
//             ))
//           }
//         </Form>
//       </div>
//     )
//   }
// }

class TestForm extends Component {
  render () {
    return (
      <div>
        <Form
          preSubmit={values => {
            console.log('preSubmit')
            return values
          }}
          onSubmit={() => console.log('Submitted')} >
          {formApi => (
            <form onSubmit={formApi.submitForm}>
              <RadioGroup field="happy">
                <Radio value="yes" />
                <Radio value="no" />
              </RadioGroup>
              <button type="submit">Submit</button>
            </form>
          )}
        </Form>
      </div>
    )
  }
}

export default TestForm
