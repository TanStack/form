import { withForm } from '../../hooks/form.tsx'
import { step2Schema, wizardFormOpts } from './shared-form.tsx'

export const Step2Form = withForm({
  ...wizardFormOpts,
  props: {
    step: 1,
    setStep: (_step: number) => {},
  },
  render: (props) => {
    return (
      <props.form.FormGroup
        name="step2"
        validators={{
          onDynamic: step2Schema,
        }}
        onGroupSubmit={({ value: _value }) => {
          props.form.handleSubmit()
        }}
      >
        {(formGroup) => (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              formGroup().handleSubmit()
            }}
          >
            <props.form.AppField name="step2.name">
              {(field) => <field.TextField label="Step 2 Name" />}
            </props.form.AppField>

            <button onClick={() => props.setStep(props.step - 1)}>Back</button>
            <props.form.AppForm>
              <props.form.SubscribeButton label="Submit" />
            </props.form.AppForm>
          </form>
        )}
      </props.form.FormGroup>
    )
  },
})
