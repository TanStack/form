import React from 'react'
import Form from '../src/form'
import Select from '../src/formInputs/select'

const SimpleSelect = Form({
  defaultValues: {
    weekday: 'fri',
    all_weekdays: ['mon', 'wed']
  }
})(({submitForm, values}) => {
  const allOptions = [
    {label: 'Monday', value: 'mon'},
    {label: 'Tuesday', value: 'tue'},
    {label: 'Wednesday', value: 'wed'},
    {label: 'Thursday', value: 'thr'},
    {label: 'Friday', value: 'fri'},
    {label: 'Saturday', value: 'sat'},
    {label: 'Sunday', value: 'sun'}
  ]

  const allPlans = [
    {label: 'No plan', value: 'no answer is an answer!'},
    {label: 'Plan A', value: 'run away'},
    {label: 'Plan B', value: 'run even more away'}
  ]

  return (
    <form onSubmit={submitForm}>
      <p>Submit event would have 3 objects: values, state and props.</p>
      <div>
        <h6>Choose your lucky day</h6>
        <Select
          field="weekday"
          options={allOptions}
          placeholder="common, pick one!"
        />
        <p>default value can be set via text field below in the KNOBS tab</p>
        <pre>current default value: {values.weekday} <br />
        available options: [{allOptions.map(element => element.value).join(', ')}]</pre>
      </div>
      <div>
        <h6>Choose your favorite number</h6>
        <Select
          field="number"
          options={[
            {label: 'One', value: '1'},
            {label: 'Two', value: '2'},
            {label: 'Three', value: '3'},
            {label: 'Four', value: '4'},
            {label: 'Five', value: '5'},
            {label: 'DADA', value: 'null'}
          ]}
          placeholder="common, pick one!"
        />
        <pre>[no default value is set]</pre>
        <pre>selected number is: {!values.number ? 'pick one!' : values.number} </pre>
      </div>
      <div>
        <h6>Choose your favorite number</h6>
        <Select
          field="plan"
          options={allPlans}
          placeholder={null}
        />
        <pre>[no default value is set, placeholder is <b>null</b>]</pre>
        <pre>selected plan is: {!values.plan ? 'decide!' : values.plan} </pre>
      </div>
      <div>
        <h6>Now choose multi lucky days</h6>
        <Select
          field="all_weekdays"
          options={allOptions}
          placeholder="common, pick away!"
          multiple
        />
        <p>default value can be set via text field below in the KNOBS tab</p>
        <pre>current value(s): [{values.all_weekdays && values.all_weekdays.join(', ')}] <br />
        available options: [{allOptions.map(element => element.value).join(', ')}]</pre>
      </div>
      <button type="submit">Submit</button>
    </form>
  )
})

export default SimpleSelect
