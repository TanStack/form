import { withForm } from "../../hooks/form";
import { wizardFormOpts } from "./shared-form";
import { z } from "zod";

export const Step1Form = withForm({
    ...wizardFormOpts,
    props: {
        step: 0,
        setStep: (_step: number) => { },
    },
    render: function Render({ form, step, setStep }) {
        return (
            // FormGroup internally provides a sub-form context for its children including a `doNotValidate` flag to disable the parent form's validation on field changes
            <form.FormGroup
                name="step1"
                validators={{
                    // If `validators` are defined on the FormGroup, they will disable the parent form's validators for this group's `onGroupSubmit`
                    // Only required for async or for performance optimizations on sync validations
                    onDynamic: z.object({
                        name: z.string().min(2, "Name must be at least 2 characters"),
                    })
                }}
                onGroupSubmit={({ value: _value }) => {
                    setStep(step + 1);
                }}
                onGroupSubmitInvalid={() => { }}
            >
                {(formGroup) => (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        formGroup.handleSubmit();
                    }}>
                        {/* Then, Field component consumes `sub-form` context and enables us to pass options to `FieldApi` */}
                        <form.AppField
                            name="step1.name"
                        >
                            {field => (
                                <field.TextField label="Step 1 Name" />
                            )}
                        </form.AppField>

                        <form.AppForm>
                            <form.SubscribeButton label="Submit" />
                        </form.AppForm>
                        {/* formGroup contains errorMaps and errors, just like forms and fields */}
                        <pre>{JSON.stringify(formGroup.state.meta.errorMap, null, 2)}</pre>
                    </form>
                )}
            </form.FormGroup>
        )
    },
})