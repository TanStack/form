import { withForm } from '../../hooks/form.tsrx'
import { step2Schema, wizardFormOpts } from './shared-form'

export const Step2Form = withForm({
  ...wizardFormOpts,
  props: {
    step: 1,
    setStep: (_step: number) => {},
  },
  render: ({ form, step, setStep }) => <form.FormGroup
    name="step2"
    validators={{
      onDynamic: step2Schema,
    }}
    onGroupSubmit={() => form.handleSubmit()}
  >
    {(formGroup) => <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void formGroup.handleSubmit()
      }}
    >
      <form.AppField name="step2.name">
        {(field) => <field.TextField label="Step 2 Name" />}
      </form.AppField>

      <button type="button" onClick={() => setStep(step - 1)}>
        Back
      </button>
      <form.AppForm>
        <form.SubscribeButton label="Submit" />
      </form.AppForm>
    </form>}
  </form.FormGroup>,
})
