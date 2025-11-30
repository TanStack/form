'use client';

import { useActionState } from 'react';
import { mergeForm, useForm } from '@tanstack/react-form-nextjs';
import { initialFormState, useTransform } from '@tanstack/react-form-nextjs';
import someAction from './action';
import { formOpts } from './shared-code';
import { z } from 'zod';

export const ClientComp = () => {
  const [state, action] = useActionState(someAction, initialFormState);

    debugger

  const form = useForm({
    ...formOpts,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, state ?? {}),
      [state]
    ),
  });

  return (
    <form action={action as never} onSubmit={() => form.handleSubmit()}>
      <form.Field
        name="age"
        validators={{
          onChange: z.coerce.number().min(8),
        }}
      >
        {(field) => {
          return (
            <div>
              <input
                name="age"
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error?.message ?? ''}>{error?.message}</p>
              ))}
            </div>
          );
        }}
      </form.Field>
      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? '...' : 'Submit'}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
};
