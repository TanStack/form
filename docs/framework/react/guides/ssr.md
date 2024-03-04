---
id: ssr
title: Next.js Usage
---

Before reading this guide, it's suggested you understand how React Server Components and React Server Actions work. [Check out this blog series for more information](https://unicorn-utterances.com/collections/react-beyond-the-render)



# Using TanStack Form in a Next.js App Router

TanStack Form is compatible with React out of the box, supporting `SSR` and being framework-agnostic. However, specific configurations are necessary according to your chosen framework.


This guide focuses on integrating TanStack Form with `Next.js`, particularly using the `App Router` and `Server Actions`.


_Remix Support Coming soon_

## Prerequisites

- Start a new `Next.js` project, following the steps in the [Next.js Documentation](https://nextjs.org/docs/getting-started/installation). Ensure you select `yes` for `Would you like to use App Router?` during the setup to access all new features provided by Next.js.
- Install `@tanstack/react-form` and any validator of your choice.




# App Router intergration

- To use TanStack Form, the component containing the form should be a client component. This requires adding the `"use client"` directive. Wrap this client component within a server component like so:

```tsx
export default function Home() {
  return (
    <>
      <ClientComp />
    </>
  )
}
```
- The form and its logic reside inside  `ClientComp`


- in order to keep our code separated lets create a file called `shared-code` which would create an instances of the form we are later going to use

```tsx
import { createFormFactory } from '@tanstack/react-form'

export const formFactory = createFormFactory({
  defaultValues: {
    firstName: '',
    age: 0,
  },
  onServerValidate({ value }) {
    if (value.age < 12) {
      return 'Server validation: You must be at least 12 to sign up'
    }
  },
})
```

- As you might already know, there are different approaches to using `form` in your application. One popular method is the `useForm` hook provided by `@tanstack/react-form`. Alternatively, `createFormFactory` is also available, offering a more structured way and reusable.

- Much like the `useForm` hook, `createFormFactory` allows you to pass `defaultValues` and other configuration options. A key feature here is the ability to include a property called `onServerValidate`. This special validation, in contrast to client-side validations, is executed exclusively on the server when a `server action` is triggered.

- For instance, a validation rule we might implement is: "You must be at least 12 years old to sign up." This rule is enforced on the server-side and the corresponding message is sent back to the client. We'll explore more on this shortly.

- Before we delve into using our `formFactory`, let's set up a file named `server-action.ts`. In this file, we'll encapsulate the logic necessary for leveraging Next.js server actions.


```tsx
"use server";
import { formFactory } from "./shared-code";

export default async function someAction(prev: unknown, formData: FormData) {
  return await formFactory.validateFormData(formData);
}
```
- The action we've discussed is straightforward yet essential. It activates exclusively on the server side when we submit our form. In the example given, the action employs `formFactory.validateFormData(formData)`. This function takes care of validating the data received from the client during form submission. It's an efficient way to ensure data compliance with our predefined server rules.

- Now, let's shift our focus to the client component:
  - For those who might be exploring this for the first time, `useFormState` is a relatively new hook in React. You can find more details in React's documentation on [useFormState](https://react.dev/reference/react-dom/hooks/useFormState). This hook represents a significant advancement as it allows us to dynamically update the state based on the outcomes of a form action. It's an effective way to manage form states, especially in response to server-side interactions.

```tsx
import {
  FormApi,
  mergeForm,
  useTransform,
} from "@tanstack/react-form";

import { formFactory } from "./shared-code";
import someAction from "./server-action";


const ClientComp = () => {
 const [state, action] = useFormState(
    someAction,
    formFactory.initialFormState
  );

   const { useStore, Provider, Subscribe, handleSubmit, Field } =
    formFactory.useForm({
      transform: useTransform(
        (baseForm: FormApi<any, any>) => mergeForm(baseForm, state),
        [state]
      ),
    });

    const formErrors = useStore((formState) => formState.errors);

   return (
    .....
   )
}

```
- Understanding `useFormState` Hook: This hook is pivotal in managing the state and actions of our form. Here, we provide it with an action `someAction` and an initial state derived from `formFactory.initialFormState`. This setup enables the component to  handle form submissions and state changes.

- Lets understand what is happening here, we need to use the `useFormState` hooks which give us the current state and the action. The way the hooks work is we have to give it an `action` in our case would be `someAction` and a initialState which for use would be `formFactory.initialFormState`

- Benefits of `formFactory`: Much like the useForm hook, formFactory streamlines the process of form management. It provides us with necessary functionalities such as:
  - `useStore`: Observes and reflects the current state of the form on the client side.
  - `Provider`: Acts as a context provider for the form, ensuring state and actions are accessible throughout the component.
  - `Subscribe`: Enables the component to listen to form-specific events, like `canSubmit` and `isSubmitting`.
  - `handleSubmit`: Orchestrates the submission logic of the form.
  - `Field`: Manages individual form fields, adopting the `renderProps` pattern for greater flexibility.

- The `formFactory.useForm` takes a few properties that we can pass to it as an object the one we are using here is transform and we are using another hook that `@tanstack/react-form` provides which is the `useTransform` and you can see we are passing a callback and we call `mergeForm` which is a function that comes from `@tanstack/react-form` and to this we need to pass the dependecies array in our case would be the `[state]`

- Accessing Form Errors: Through `useStore`, we can access and display formErrors, enhancing user feedback and experience.

- Finishing up the  `UI`

```tsx
const ClientComp = () => {
 ...

  return (
    <Provider>
      <form action={action as never} onSubmit={() => handleSubmit()}>
        {formErrors.map((error) => (
          <p key={error as string}>{error}</p>
        ))}

        <Field
          name="age"
          validators={{
            onChange: ({ value }) =>
              value < 8
                ? "Client validation: You must be at least 8"
                : undefined,
          }}
        >
          {(field) => {
            return (
              <div>
                <input
                  className="text-black"
                  name="age"
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error as string}>{error}</p>
                ))}
              </div>
            );
          }}
        </Field>
        <Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </button>
          )}
        </Subscribe>
      </form>
    </Provider>
  );
};
```

- In our UI, implementing the form is straightforward. We encapsulate our form within a `Provider`. A notable aspect here is the integration of our server action within the `form`. For the form's `action`, we utilize the `action` obtained from `useFormState`. This setup triggers the server action upon form submission. If everything processes successfully, the action will complete without issues. Otherwise, we'll encounter an error like "Server validation: You must be at least 12 to sign up."

- You might now be wondering about client-side validation. How do we implement it? 🤔 The answer lies in the `handleSubmit` function. By assigning `handleSubmit` to the form's `onSubmit` event, we can handle client-side validation in the normal client side manner.
