import React from 'react'
import { createFormHook, getFormHookHelpers } from '../../../src'
import type { AnyReactFormApi, ReactFormType } from '../../../src'

function Save({ label }: { form: AnyReactFormApi; label: string }) {
  return <button>{label}</button>
}

function Notice({ message }: { message: string }) {
  return <p>{message}</p>
}

function TextField({ label }: { label: string }) {
  return <input aria-label={label} />
}

function IncompatibleComponent(_props: { count: number }) {
  return null
}

const { formComponent } = getFormHookHelpers()
const SaveRegistration = formComponent.create({
  component: Save,
  replaceProperty: 'form',
})

createFormHook({
  fieldComponents: {},
  formComponents: {
    // @ts-expect-error form components cannot contain namespaces
    layout: { Notice },
  },
})

const { appFormOptions: requiredOptions } = createFormHook({
  fieldComponents: { inputs: { TextField } },
  formComponents: { Save: SaveRegistration, Notice },
})

function RequiresComponents({
  form,
}: {
  form: ReactFormType<typeof requiredOptions>
}) {
  return (
    <>
      <form.Save label="Save" />
      <form.Notice message="Notice" />
      <form.Field name="anything">
        {(field) => <field.inputs.TextField label="Name" />}
      </form.Field>
      {/* @ts-expect-error ReactFormType exposes bound components */}
      <form.Save form={form} label="Save" />
    </>
  )
}

const Consumer = formComponent.create({
  component: RequiresComponents,
  replaceProperty: 'form',
})
const MemoConsumer = React.memo(Consumer)
const LazyConsumer = React.lazy(() => Promise.resolve({ default: Consumer }))
const MemoLazyConsumer = React.memo(LazyConsumer)
const LazyMemoConsumer = React.lazy(() =>
  Promise.resolve({ default: MemoConsumer }),
)
const { appFormOptions, useAppForm } = createFormHook({
  fieldComponents: { inputs: { TextField } },
  formComponents: {
    Save: SaveRegistration,
    Notice,
    Consumer,
    MemoConsumer,
    LazyConsumer,
    MemoLazyConsumer,
    LazyMemoConsumer,
  },
})

createFormHook({
  fieldComponents: { inputs: { TextField } },
  formComponents: {
    // @ts-expect-error the required Save and Notice components are absent
    Consumer,
    // @ts-expect-error memo preserves the required form components
    MemoConsumer,
    // @ts-expect-error lazy preserves the required form components
    LazyConsumer,
    // @ts-expect-error nested memo and lazy preserve the required form components
    MemoLazyConsumer,
    // @ts-expect-error nested lazy and memo preserve the required form components
    LazyMemoConsumer,
  },
})

createFormHook({
  fieldComponents: { inputs: { TextField } },
  formComponents: {
    Save: IncompatibleComponent,
    Notice,
    // @ts-expect-error Save has incompatible props
    Consumer,
    // @ts-expect-error memo preserves checks for incompatible component props
    MemoConsumer,
  },
})

createFormHook({
  fieldComponents: {},
  formComponents: {
    Save: SaveRegistration,
    Notice,
    // @ts-expect-error the required registered field component is absent
    Consumer,
    // @ts-expect-error lazy preserves the required field components
    LazyConsumer,
  },
})

createFormHook({
  fieldComponents: { inputs: { TextField: IncompatibleComponent } },
  formComponents: {
    Save: SaveRegistration,
    Notice,
    // @ts-expect-error the required registered field component has incompatible props
    Consumer,
    // @ts-expect-error nested wrappers preserve field component compatibility
    MemoLazyConsumer,
  },
})

const profileOptions = appFormOptions({ defaultValues: { name: '' } })

function FromOptions({ form }: { form: ReactFormType<typeof profileOptions> }) {
  return <form.Consumer />
}

function RegisteredComponents() {
  const form = useAppForm(profileOptions)
  return (
    <>
      <form.Consumer />
      <form.MemoConsumer />
      <form.LazyConsumer />
      <form.MemoLazyConsumer />
      <form.LazyMemoConsumer />
      <form.Save label="Save" />
      <FromOptions form={form} />
    </>
  )
}

void RegisteredComponents
