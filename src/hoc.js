import React from 'react';
import Form, { FormDefaultProps } from './form'
import FormField from './formField'
import FormError from './formError'
import FormInput from './formInput'
// Inputs
import Select from './formInputs/select'
import Checkbox from './formInputs/checkbox'
import Textarea from './formInputs/textarea'
import NestedForm from './formInputs/nestedForm'
import Text from './formInputs/text'
import RadioGroup from './formInputs/radioGroup'
import Radio from './formInputs/radio'

const createHOC = Component => config => View => props => (
  <Component {...config} {...props}>
    {(api) => <View {...api} />}
  </Component>
)

module.exports = {
  Form: createHOC(Form),
  FormDefaultProps: createHOC(FormDefaultProps),
  FormField: createHOC(FormField),
  FormError,
  FormInput: createHOC(FormInput),
  // Inputs
  Select,
  Checkbox,
  Textarea,
  NestedForm,
  Text,
  RadioGroup,
  Radio
}

