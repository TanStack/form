---
id: submission-handling
title: Submission handling
---

## Passing additional data to submission handling

You may have multiple types of submission behaviour, for example, going back to another page or staying on the form.
You can accomplish this by specifying the `onSubmitMeta` property. This meta data will be passed to the `onSubmit` function.

> Note: if `form.handleSubmit()` is called without metadata, it will use the provided default.

```angular-ts
import { Component } from '@angular/core';
import { injectForm } from '@tanstack/angular-form';


type FormMeta = {
  submitAction: 'continue' | 'backToMenu' | null;
};

// Metadata is not required to call form.handleSubmit().
// Specify what values to use as default if no meta is passed
const defaultMeta: FormMeta = {
  submitAction: null,
};

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <form (submit)="handleSubmit($event)">
      <button type="submit" (click)="
        handleClick({ submitAction: 'continue' })
      ">Submit and continue</button>
      <button type="submit" (click)="
        handleClick({ submitAction: 'backToMenu' })
      ">Submit and back to menu</button>
    </form>
  `,
})
export class AppComponent {
  name = 'Angular';
  form = injectForm({
    defaultValues: {
      data: '',
    },
    // Define what meta values to expect on submission
    onSubmitMeta: defaultMeta,
    onSubmit: async ({ value, meta }) => {
      // Do something with the values passed via handleSubmit
      console.log(`Selected action - ${meta.submitAction}`, value);
    },
  });

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleClick(meta: FormMeta) {
    // Overwrites the default specified in onSubmitMeta
    this.form.handleSubmit(meta);
  }
}
```

## Transforming data with Standard Schemas

While Tanstack Form provides [Standard Schema support](./validation.md) for validation, it does not preserve the Schema's output data.

The value passed to the `onSubmit` function will always be the input data. To receive the output data of a Standard Schema, parse it in the `onSubmit` function:

```tsx
import { z } from 'zod'
// ...

const schema = z.object({
  age: z.string().transform((age) => Number(age)),
})

// Tanstack Form uses the input type of Standard Schemas
const defaultValues: z.input<typeof schema> = {
  age: '13',
}

// ...

export class AppComponent {
  name = 'Angular'
  form = injectForm({
    defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: ({ value }) => {
      const inputAge: string = value.age
      // Pass it through the schema to get the transformed value
      const result = schema.parse(value)
      const outputAge: number = result.age
    },
  })
}
```
