import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import type { AnyFieldApi, DeepKeys } from '@tanstack/react-form';

const userSchema = z.object({
  firstName: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof userSchema>;

function FieldUI({ field, label }: { field: AnyFieldApi; label: string }) {
  return (
    <div>
      <input
        key={label}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={label}
      />
      {field.state.meta.errors.length > 0 && (
        <em style={{ color: 'red' }}>
          {field.state.meta.errors
            .map((e) => (typeof e === 'string' ? e : e.message))
            .join(', ')}
        </em>
      )}
    </div>
  );
}

export default function App() {
  const [step, setStep] = React.useState(0);

  const form = useForm({
    defaultValues: {
      firstName: '',
      email: '',
    } as FormData,
    validators: { onSubmit: userSchema },
    onSubmit: async ({ value }) => console.log('Final submit:', value),
  });

  const steps = [
    {
      fields: ['firstName'] as const,
      component: () => (
        <form.Field
          name="firstName"
          validators={{ onBlur: userSchema.shape.firstName }}
          children={(f) => <FieldUI field={f} label="First Name" />}
        />
      ),
    },
    {
      fields: ['email'] as const,
      component: () => (
        <form.Field
          name="email"
          validators={{ onBlur: userSchema.shape.email }}
          children={(f) => <FieldUI field={f} label="Email" />}
        />
      ),
    },
  ];

  type FormFieldName = DeepKeys<FormData>;

  const validateFieldGroup = async (fields: readonly FormFieldName[]) => {
    await Promise.all(fields.map((field) => form.validateField(field, 'blur')));
    return fields.every(
      (field) => (form.getFieldMeta(field)?.errors.length ?? 0) === 0
    );
  };

  const next = async () => {
    const result = await validateFieldGroup(steps[step].fields);
    if (result) {
      setStep((s) => s + 1);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {steps[step].component()}
      <div style={{ marginTop: 20 }}>
        {step > 0 && (
          <button
            key="back"
            type="button"
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button key="next" type="button" onClick={next}>
            Next
          </button>
        ) : (
          <button style={{ marginLeft: 20 }} type="submit">
            Submit
          </button>
        )}
      </div>
    </form>
  );
}



const rootElement = document.getElementById('root')!

createRoot(rootElement).render(
  <React.StrictMode>
    <App />

    <TanStackDevtools
      config={{ hideUntilHover: true }}
      plugins={[formDevtoolsPlugin()]}
    />
  </React.StrictMode>,
)
