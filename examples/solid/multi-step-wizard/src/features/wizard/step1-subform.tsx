import { withForm } from '../../hooks/form.tsx'
import { step1Schema, wizardFormOpts } from './shared-form.tsx'

export const Step1Form = withForm({
  ...wizardFormOpts,
  props: {
    step: 0,
    setStep: (_step: number) => {},
  },
  render: (props) => {
    return (
      <props.form.FormGroup
        name="step1"
        validators={{
          onDynamic: step1Schema,
        }}
        onGroupSubmit={({ value: _value }) => {
          props.setStep(props.step + 1)
        }}
        onGroupSubmitInvalid={() => {
          // Just like a form, you can also handle invalid submits at the group level, which is useful for multi-step wizards to prevent going to the next step if the current step is invalid
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
            <props.form.AppField name="step1.name">
              {(field) => <field.TextField label="Step 1 Name" />}
            </props.form.AppField>

            <props.form.AppForm>
              <props.form.SubscribeButton label="Submit" />
            </props.form.AppForm>
            {/* formGroup contains errorMaps and errors, just like forms and fields */}
            <pre>
              {JSON.stringify(formGroup().state.meta.errorMap, null, 2)}
            </pre>
          </form>
        )}
      </props.form.FormGroup>
    )
  },
})
