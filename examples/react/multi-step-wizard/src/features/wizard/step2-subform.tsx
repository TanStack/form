import { withForm } from '../../hooks/form'
import { step2Schema, wizardFormOpts } from './shared-form'

export const Step2Form = withForm({
  ...wizardFormOpts,
  props: {
    step: 1,
    setStep: (_step: number) => {},
  },
  render: function Render({ form, step, setStep }) {
    return (
      <form.FormGroup
        name="step2"
        validators={{
          onDynamic: step2Schema,
        }}
        onGroupSubmit={({ value: _value }) => {
          form.handleSubmit()
        }}
      >
        {(formGroup) => (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              formGroup.handleSubmit()
            }}
          >
            <form.AppField name="step2.name">
              {(field) => <field.TextField label="Step 2 Name" />}
            </form.AppField>

            <button onClick={() => setStep(step - 1)}>Back</button>
            <form.AppForm>
              <form.SubscribeButton label="Submit" />
            </form.AppForm>
          </form>
        )}
      </form.FormGroup>
    )
  },
})
