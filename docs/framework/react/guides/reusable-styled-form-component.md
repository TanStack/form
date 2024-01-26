---
id: reusable-styled-form-component
title: Reusable Styled Form Component
---

# Creating your own Reusable Styled Form Component
This guide will walk you through the process of creating a reusable styled form component. A reusable styled form component is a component that encapsulates the logic and styling of a form, allowing you to reuse it across your application. It is highly opinionated and meant to be customised for your specific project. The concepts in this guide are applicable to any UI library and it is meant as a reference for you to create your own reusable styled form component. 

You can think of a reusable styled form component as a wrapper around TanStack Form that encapsulates the logic and styling of a form for a higher level of abstraction. It can be thought of as a giant UI component for forms that implements simpler UI components like `Input`, `Select`, `Button`, etc.

## When to Create a Reusable Styled Form Component
Creating a reusable styled form component is a great way to reduce boilerplate and enforce consistency across your application. It is especially useful if you have a lot of forms in your application, but in many cases it is overkill. If you only have a few forms in your application, it is probably better to use TanStack Form directly. 

## Prerequisites
This example uses [Tailwind CSS](https://tailwindcss.com/) for styling and [Class Variance Authority](https://beta.cva.style/) for UI component variants. You can use any styling solution of your choice, just replace the custom components with your own and provide the appropriate props. It also uses `Zod` for validation, but you can use any validation library of your choice. If you want to take a look at the custom UI components you can see them in the codesandbox in the examples section.

## Composition
The reusable form component is composed of compound components to make it easier to customise. The `<Form />` component is the main component. While `<Form.Field />` and `<Form.Subscribe />` renders the appropriate components from TanStack Form. The rest of the compound components are examples of components that you can add to your own reusable form component. For example, `<Form.Field.Text />` is a compound component that renders a text field. You can add as many compound components as you want to your reusable form component and some of the examples in this guide are just that, examples. You may not need a `<Form.ResetButton />` component, but it is included here. All the components in this example are forwarding the ref to the underlying HTML element. This is so that you can access the HTML element directly if needed. For example, if you want to focus the first field in the form when the form is submitted.

## Let's Get Started

### `<Form />`

```tsx
const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, formOptions, ...props }, ref) => {
    const { Provider, Field, handleSubmit, useStore, Subscribe, reset } =
      useForm({
        validatorAdapter: zodValidator,
        ...formOptions,
      })
    return (
      <Provider>
        <form
          className={className}
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleSubmit()
          }}
          ref={ref}
          {...props}
        >
          <FormContext.Provider value={{ Field, Subscribe, reset }}>
            {typeof children === 'function' ? children(useStore) : children}
          </FormContext.Provider>
        </form>
      </Provider>
    )
  },
) as FormComponentProps
```
The `<Form />` component wraps the form in the `<Provider />` from TanStack Form and provides the appropriate `onSubmit` props which is something you would normally do when using TanStack Form directly. It also initiates the `useForm` from Tanstack Form and here you can pass any options that you want to have in every single form in your application. For example the validator adapter. The `<Form />` component also renders the `<FormContext.Provider />` which provides the `<Form.Field />` and `<Form.Subscribe />` components to the rest of the form. The `<Form />` component also provides the `useStore` hook from TanStack Form to the rest of the form. This is so that you can access the form state from anywhere in the form.

### `<Form.Field />` & `<Form.Subscribe />`

```tsx
Form.Field = React.forwardRef<FormFieldProps>(({ ...props }, ref) => {
  const { Field } = React.useContext(FormContext)
  return <Field ref={ref} {...props} />
})

Form.Subscribe = React.forwardRef<FormFieldProps>(({ ...props }, ref) => {
  const { Subscribe } = React.useContext(FormContext)
  return <Subscribe ref={ref} {...props} />
})
```
The `<Form.Field />` and `<Form.Subscribe />` components are just wrappers around the `<Field />` and `<Subscribe />` components from TanStack Form. They are not necessary, but they make it easier to customise the form. For example, `<Form.Field />` gives access to the `field` prop which is the field object from TanStack Form. This allows you to access and overwrite any value that you pass down in your UI compound components. For example, you can have a default `onChange={(e) => field.handleChange(e.target.value)}` prop that you want to change to something else like `onChange={(e) => field.handleChange(e.target.valueAsNumber)}` where you still would need access to the `field` prop. The `<Form.Subscribe />` component can be useful if you want to render a component that is not a field, but still needs access to the form state. For example, a loading indicator, a button that is disabled when the form is submitting, a JSON representation of the form state, etc. If you don't need this flexibility in your reusable form component, you can hardcode the `<Field />` and `<Subscribe />` components from TanStack Form directly into your UI compound components.

### `<Form.Field.Text />`, `<Form.Field.Checkbox />` & `<Form.Field.Select />`

```tsx
Form.Field.Text = React.forwardRef<HTMLInputElement, FormFieldTextProps>(
  ({ className, hasErrorField, field, label, ...props }, ref) => {
    return (
      <div className="flex relative">
        <Input
          className={cx(
            'placeholder:text-white dark:placeholder:text-black',
            className,
          )}
          invalid={field.state.meta.errors.length !== 0}
          type="text"
          id={field.name}
          name={field.name}
          placeholder={label}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-describedby={
            hasErrorField && field.state.meta.errors.length !== 0
              ? `${field.name}-error`
              : ''
          }
          aria-invalid={field.state.meta.errors.length !== 0}
          ref={ref}
          {...props}
        />
        {label && (
          <Label
            className={cx(
              'pointer-events-none absolute origin-left translate-x-[5px] translate-y-[9px] scale-100 rounded-md bg-white dark:bg-black px-2 py-1 font-normal text-gray-500 transition peer-focus:-translate-y-[11px] peer-focus:translate-x-[7px] peer-focus:scale-[calc(12/14)] peer-focus:text-blue-500 peer-[:not(:placeholder-shown):not(:focus)]:-translate-y-[11px] peer-[:not(:placeholder-shown):not(:focus)]:translate-x-[7px] peer-[:not(:placeholder-shown):not(:focus)]:scale-[calc(12/14)] peer-[:not(:placeholder-shown):not(:focus)]:text-gray-500',
              field.state.meta.errors.length !== 0 &&
                'peer-focus:text-red-500 peer-[:not(:placeholder-shown):not(:focus)]:text-red-500',
            )}
            htmlFor={field.name}
          >
            {label}
          </Label>
        )}
      </div>
    )
  },
)

Form.Field.Checkbox = React.forwardRef<
  HTMLInputElement,
  FormFieldCheckboxProps
>(({ className, children, field, label, ...props }, ref) => {
  return (
    <div className="flex relative items-center gap-2">
      <Input
        className={className}
        type="checkbox"
        id={field.name}
        name={field.name}
        placeholder={label}
        checked={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.checked)}
        ref={ref}
        {...props}
      />
      {label && (
        <Label className="cursor-pointer" htmlFor={field.name}>
          {label}
        </Label>
      )}
    </div>
  )
})

Form.Field.Select = React.forwardRef<HTMLSelectElement, FormFieldSelectProps>(
  ({ className, hasErrorField, field, label, ...props }, ref) => {
    return (
      <div className="flex flex-col relative gap-2">
        {label && (
          <Label className="cursor-pointer" htmlFor={field.name}>
            {label}
          </Label>
        )}
        <Select
          className={className}
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-describedby={
            hasErrorField && field.state.meta.errors.length !== 0
              ? `${field.name}-error`
              : ''
          }
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)
```
The `<Form.Field.Text />`, `<Form.Field.Checkbox /` and `<Form.Field.Select />` components are examples of compound components that you can add to your reusable form component. They are using the custom UI components `<Input />`, `<Label />`, `<Select />` and aswell as extra Tailwind styles to style the form. You can use your own UI components, style the primitive HTML elements directly or use a UI styling library. All of these components have all the base props that you would have to supply anyway like `id`, `name`, `value`, `onChange`, `onBlur`, etc. given through the field prop. You pass this prop from the `<Form.Field />` which make it easy to overwrite anything if needed. They also optionaly render a label and error message if you pass the `label` and `hasErrorField` props. The `hasErrorField` prop is a boolean that enables aria labelling when you combine it with an error message component. This is not applicable to the Checkbox.

### `<Form.Field.Error />`

```tsx
Form.Field.Error = React.forwardRef<HTMLSpanElement, FormFieldErrorProps>(
  ({ className, field, ...props }, ref) => {
    return (
      <>
        <ExclamationCircleIcon
          className={cx(
            'absolute h-4 w-4 translate-x-[3px] translate-y-px text-red-500 opacity-0 transition-opacity',
            field.state.meta.errors.length !== 0 && 'opacity-100',
          )}
        />
        <span
          className={cx(
            'absolute translate-x-5 leading-none translate-y-px text-xs text-red-500 opacity-0 transition-opacity',
            field.state.meta.errors.length !== 0 && 'opacity-100',
          )}
          id={`${field.name}-error`}
          aria-hidden={field.state.meta.errors.length !== 0 ? 'false' : 'true'}
          ref={ref}
          {...props}
        >
          {field.state.meta.errors.length !== 0 &&
            field.state.meta.errors[0].split(', ')[0]}
        </span>
      </>
    )
  },
)
```
The `<Form.Field.Error />` component is an example of a styled error message compound component that you can combine with the other field compound components to render an error message. It shows an error message only when needed and uses aria labelling to make it accessible. It also only renders a single error message even if there are multiple errors. You can use your own error message component or style the error message directly on the field compound components. This is just an example.

### `<Form.ResetButton />` & `<Form.SubmitButton />`

```tsx
Form.SubmitButton = React.forwardRef<HTMLButtonElement, FormSubmitButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <Button
            className={className}
            variant="primary"
            size="md"
            type="submit"
            disabled={!canSubmit}
            ref={ref}
            {...props}
          />
        )}
      </Form.Subscribe>
    )
  },
)

Form.ResetButton = React.forwardRef<HTMLButtonElement, FormResetButtonProps>(
  ({ className, ...props }, ref) => {
    const { reset } = React.useContext(FormContext)
    return (
      <Form.Subscribe selector={(state) => state.submissionAttempts}>
        {(submissionAttempts) => (
          <Button
            className={cx('text-blue-500 dark:text-blue-500', className)}
            disabled={submissionAttempts === 0}
            onClick={() => reset()}
            variant="ghost"
            size="xs"
            ref={ref}
            {...props}
          />
        )}
      </Form.Subscribe>
    )
  },
)
```

The `<Form.ResetButton />` and `<Form.SubmitButton />` components uses a custom `<Button />` UI component to render the buttons with appropriate styles. They also implement the `<Form.Subscribe />` component diresctly to subscribe to the necessary form state and render the buttons accordingly. The `<Form.SubmitButton />` component is disabled when the form is not ready to submit and the `<Form.ResetButton />` component is disabled when the form has not been submitted. You don't have to create these components if you dont need them. You can just use the `<Button />` component directly in your form if you want that, but it can be useful if you need to use the same style of Submit and Reset buttons across multiple forms. You can also choose to not implement the `<Form.Subscribe />` component directly, and instead pass the state as a prop to a `<Form.Subscirbe.SubmitButton />` component to make the prop more reusable. There is always a balance of how much abstraction you want to have in your reusable form component, and how much you want to hardcode to make it easier to customise.

## A simple example
This is a simple example of how to use this reusable styled form component as it is made here. For a more complex example, that implements many features of TanStack Form, see in the codesandbox in the example section.

```tsx
<Form
  formOptions={{
    defaultValues: {
      likesCars: false,
      favouriteCarBrand: 'Porsche',
      comments: '',
    },
  }}>
  <Form.Field
    name="likesCars"
    children={(field) => (
      <Form.Field.Checkbox
        field={field}
        label="Do you like cars?"
      />
    )}
  />
  <Form.Field
    name="favouriteCarBrand"
    children={(field) => (
      <Form.Field.Select
        field={field}
        label="What is your favourite car brand?"
      >
        <option value="Porsche">Porsche</option>
        <option value="Ferrari">Ferrari</option>
        <option value="Lamborghini">Lamborghini</option>
      </Form.Field.Select>
    )}
  />
  <Form.Field
    name="comments"
    validators={{
      onSubmit: z
        .string()
        .min(10, "Must be at least 10 characters"),
        .max(100, "Must be at most 100 characters"),
        .refine((value)) => value.includes("car"), "Must contain the word car"),
      }}
    children={(field) => (
      <div className="relative">
        <Form.Field.Text
          field={field}
          hasErrorField
          label="Any comments?"
        />
        <Form.Field.Error field={field} />
      </div>
    )}
  />
  <Form.SubmitButton>Submit</Form.SubmitButton>
  <Form.ResetButton>Reset</Form.ResetButton>
  <Form.Subscribe selector={(state) => state.isValidating}>
    {(isValidating) => (
      <p className="text-sm text-gray-500 italic">
        {isValidating ? 'Currently validating the form' : "Not validating the form"}
      </p>
    )}
  </Form>
```
The pros with this reusable form component is that this form is not verbose at all and easy to reuse. You can also easily add new styled compound components to it and it is completely customizable. The cons is that it is more complex than just using TanStack Form directly and it is more difficult to understand how it works. It is also more difficult to debug if something goes wrong. 

## End Notes
Hope this guide was helpful and that you can use it as a reference to create your own reusable styled form component, or it helped you better understand the concepts of TanStack Form. It can be smart to take a llook at the example in the codesandbox to see how it works in a more real world example. 