import { withForm } from '../../hooks/form.tsrx'
import { step1Schema, wizardFormOpts } from './shared-form'

export const Step1Form = withForm({
  ...wizardFormOpts,
  props: {
    step: 0,
    setStep: (_step: number) => {},
  },
  render: ({ form, step, setStep }) => <form.FormGroup
    name="step1"
    validators={{
      onDynamic: step1Schema,
    }}
    onGroupSubmit={() => {
      setStep(step + 1)
    }}
    onGroupSubmitInvalid={() => {}}
  >
    {(formGroup) => <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void formGroup.handleSubmit()
      }}
    >
      <form.AppField name="step1.name">
        {(field) => <field.TextField label="Step 1 Name" />}
      </form.AppField>

      <form.AppForm>
        <form.SubscribeButton label="Submit" />
      </form.AppForm>
      {/* Form groups expose error maps and errors, just like forms and fields. */}
      <pre>{JSON.stringify(formGroup.state.meta.errorMap, null, 2)}</pre>
    </form>}
  </form.FormGroup>,
})
