---
id: reusable-styled-form-component
title: Reusable Styled Form Component
---

# Creating your own Reusable Styled Form Component
This guide will walk you through the process of creating a reusable styled form component. A reusable styled form component is a component that encapsulates the logic and styling of a form, allowing you to reuse it across your application. It is highly opinionated and meant to be customised for your specific project. The concepts in this guide are applicable to any ui-library and it is meant as a reference for you to create your own reusable styled form component. 

You can think of a reusable styled form component as a wrapper around TanStack Form that encapsulates the logic and styling of a form for a higher level of abstraction. It can be thought of as a giant UI component for forms that implements simpler UI components like `Input`, `Select`, `Button`, etc.

## When to Create a Reusable Styled Form Component
Creating a reusable styled form component is a great way to reduce boilerplate and enforce consistency across your application. It is especially useful if you have a lot of forms in your application, but in many cases it is overkill. If you only have a few forms in your application, it is probably better to use TanStack Form directly. 

## Prerequisites
This example uses [Tailwind CSS](https://tailwindcss.com/) for styling and [Class Variance Authority](https://beta.cva.style/) for UI component variants. You can use any styling solution of your choice, just replace the custom components with your own and provide the appropriate props. It also uses `Zod` for validation, but you can use any validation library of your choice.

## Composition
The reusable form component is composed of compound components to make it easier to customise. The `<Form />` component is the main component. While `<Form.Field />` and `<Form.Subscribe />` renders the appropriate components from TanStack Form. The rest of the compound components are examples of components that you can add to your own reusable form component. For example, `<Form.Field.Text />` is a compound component that renders a text field. You can add as many compound components as you want to your reusable form component and some of the examples in this guide are just that, examples. You may not need a `<Form.ResetButton />` component, but it is included here.

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

