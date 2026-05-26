---
id: form-groups
title: Form Groups
---

When building a multi-stage form that has many stages, like so:

![Form stepper](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/stepper.png)

It's common for each step to have its own form. However, this complicates the form submission and validation process by requiring you to add complex logic.

Luckily, TanStack Form provides a way to build out sub-forms that make this kind of development trivial to implement: `[tanstackFormGroup]`.

## Usage

To use a form group in TanStack Form, you'll use `injectForm` to create a `form` variable, then reference it with the `tanstackFormGroup` directive like you would with `tanstackField`:

```angular-ts
import { Component } from '@angular/core'
import { TanStackFormGroup, injectForm } from '@tanstack/angular-form'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackFormGroup],
  template: `
    <ng-container [tanstackFormGroup]="form" name="step1" #group="formGroup">
      <!-- `group.api` here has all of the form-like methods you'd expect like `deleteField` or `insertFieldValue` -->
      <!-- ... -->
    </ng-container>
  `,
})
export class AppComponent {
  form = injectForm({
    defaultValues: {
      step1: {
        name: '',
      },
      step2: {
        age: 0,
      },
    },
  })
}
```

This becomes much more useful when paired with external state to conditionally render a form group:

```angular-ts
import { Component, signal } from '@angular/core'
import {
  TanStackField,
  TanStackFormGroup,
  injectForm,
} from '@tanstack/angular-form'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField, TanStackFormGroup],
  template: `
    @if (step() === 0) {
      <ng-container
        [tanstackFormGroup]="form"
        name="step1"
        [onGroupSubmit]="onStep1Submit"
        [onGroupSubmitInvalid]="onStep1SubmitInvalid"
        [onSubmitMeta]="submitMeta"
        #group="formGroup"
      >
        <form
          (submit)="
            $event.preventDefault();
            $event.stopPropagation();
            group.api.handleSubmit()
          "
        >
          <ng-container [tanstackField]="form" name="step1.name" #name="field">
            <!-- ... -->
          </ng-container>
        </form>
      </ng-container>
    }

    @if (step() === 1) {
      <ng-container
        [tanstackFormGroup]="form"
        name="step2"
        [onGroupSubmit]="onStep2Submit"
        #group="formGroup"
      >
        <form
          (submit)="
            $event.preventDefault();
            $event.stopPropagation();
            group.api.handleSubmit()
          "
        >
          <ng-container [tanstackField]="form" name="step2.age" #age="field">
            <!-- ... -->
          </ng-container>
        </form>
      </ng-container>
    }
  `,
})
export class AppComponent {
  step = signal(0)
  submitMeta = {} as SomeType

  form = injectForm({
    defaultValues: {
      step1: {
        name: '',
      },
      step2: {
        age: 0,
      },
    },
  })

  onStep1Submit = () => {
    // We can move the step forward when validation passes
    this.step.update((step) => step + 1)
  }

  onStep1SubmitInvalid = () => {
    // Or handle invalid submissions, just like a top-level form
  }

  onStep2Submit = () => {
    // Then, use `form.handleSubmit()` to submit the entire form
    this.form.handleSubmit()
  }
}
```

When you split each step into its own component, pass the parent form down with [`tanstack-with-form`](./form-composition.md) and read it in the child with `injectWithForm`. The child can then use `[tanstackFormGroup]="withForm.form"` and `[tanstackField]="withForm.form"` against the same parent form instance.

## Form Group Validation

Form groups have a distinct validation procedure that we think makes sense for sub-forms:

- Form groups can have their own validation:

```angular-ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackFormGroup],
  template: `
    <ng-container
      [tanstackFormGroup]="form"
      name="step1"
      [validators]="{ onChange: groupValidator }"
      #group="formGroup"
    >
      <!-- group.api.state.meta.errorMap // {onChange: "Error" | undefined} -->
      <!-- group.api.state.meta.errors // ("Error")[] -->
    </ng-container>
  `,
})
export class AppComponent {
  form = injectForm({
    defaultValues: {
      step1: { name: '' },
    },
  })

  groupValidator = () => 'Error'
}
```

- Can set errors on sub-fields:

```angular-ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackFormGroup],
  template: `
    <ng-container
      [tanstackFormGroup]="form"
      name="step1"
      [validators]="{ onChange: groupValidator }"
    ></ng-container>
  `,
})
export class AppComponent {
  form = injectForm({
    defaultValues: {
      step1: { name: '' },
    },
  })

  groupValidator = ({ value }: { value: { name: string } }) => ({
    group: value.name === 'error' ? 'Group error' : undefined,
    fields: {
      // Must use the name of the field relative to the FormGroup as the error key,
      // to stay consistent with how standard schema works with form groups
      name: value.name === 'error' ? 'Field error' : undefined,
    },
  })
}
```

- And can even accept standard schemas:

```angular-ts
import { z } from 'zod'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackFormGroup],
  template: `
    <ng-container
      [tanstackFormGroup]="form"
      name="step1"
      [validators]="{ onChange: step1Schema }"
    ></ng-container>
  `,
})
export class AppComponent {
  step1Schema = z.object({
    name: z.string().min(2),
  })

  form = injectForm({
    defaultValues: {
      step1: { name: '' },
    },
  })
}
```

> The reason we don't use the full path names for fields is so that you can compose your schemas like so:
>
> ```ts
> const step1Schema = z.object({
>   name: z.string().min(2),
> })
>
> const schema = z.object({
>   step1: step1Schema,
>   step2: step2Schema,
> })
> ```
>
> And pass the `step1Schema` to a form group and `schema` to the parent form. That way, partially validated data will still flag errors if the group is bypassed.

### Dynamic Group Validation

If you want to use [dynamic validation (`onDynamic`)](./dynamic-validation.md) with a form group, do not rely on the `onDynamic` validator passed to `injectForm`:

```ts
form = injectForm({
  validationLogic: revalidateLogic(),
  validators: {
    // This validator will not run `onChange` when a sub-form is submitted;
    // it will only run `onChange` when the form itself is submitted.
    onDynamic: schema,
  },
})
```

Instead, pass your sub-schema for the group to the `onDynamic` validation of the group itself:

```angular-ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackFormGroup],
  template: `
    <ng-container
      [tanstackFormGroup]="form"
      name="step1"
      [validators]="{ onDynamic: step1Schema }"
    ></ng-container>
  `,
})
export class AppComponent {
  step1Schema = step1Schema

  form = injectForm({
    defaultValues: {
      step1: { name: '' },
    },
  })
}
```

It will treat `group.api.submissionAttempts` as the way to change what validator is run before/after submit.

## Form Group State

Just like you're able to access `group.api.state.meta.errors`, you're also able to access the group's value using `group.api.state.value`. Likewise, here are some valuable properties you can access in the `group.api.state.meta`:

- `group.api.state.meta.isFieldsValid`: `true` when the field-level validators have no errors
- `group.api.state.meta.isGroupValid`: `true` when the group-level validators have no errors
- `group.api.state.meta.isValid`: `true` when both the field-level and group-level validators have no errors
- `group.api.state.meta.isSubmitting`: `true` when the group is in the process of being submitted
