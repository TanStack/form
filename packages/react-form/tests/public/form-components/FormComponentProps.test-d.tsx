import React from 'react'
import { expectTypeOf } from 'vitest'
import { createFormHook, formOptions, getFormHookHelpers } from '../../../src'
import type {
  AnyFormApi,
  AnyReactFormApi,
  DefaultReactFormComponentMap,
  FormApi,
  ReactFormApi,
  ReactFormComponents,
  ReactFormType,
  ScopedErrorTypes,
} from '../../../src'

function CoreForm({
  label,
}: {
  owner: AnyFormApi
  label: string
  disabled?: boolean
}) {
  return label
}

function ReactForm(_props: { form: AnyReactFormApi }) {
  return null
}

function OptionalForm(_props: { form?: AnyFormApi }) {
  return null
}

function NullableForm(_props: { form: AnyReactFormApi | null }) {
  return null
}

function BroadErrors(_props: { form: FormApi<any, ScopedErrorTypes> }) {
  return null
}

function TwoFormProps(_props: { owner: AnyFormApi; other: AnyReactFormApi }) {
  return null
}

function AnyProps(_props: any) {
  return null
}

function OrdinaryFormProps(_props: { form: string; owner?: string }) {
  return null
}

function OrdinarySymbolProps(
  _props: Record<symbol, FormApi<{ name: string }, any>>,
) {
  return null
}

function Notice<T>({
  value,
  onSelect,
}: {
  value: T
  onSelect: (value: T) => void
}) {
  onSelect(value)
  return null
}

const { formComponent } = getFormHookHelpers()
// @ts-expect-error non-form props are excluded from the helper's key constraint
const InvalidFormPropKey = formComponent.create<typeof CoreForm, 'label'>
void InvalidFormPropKey

const Registration = formComponent.create(CoreForm, 'owner')
const registry = {
  CoreForm: Registration,
  Notice,
  AnyProps,
  WrappedAnyProps: formComponent.create(AnyProps, 'anyKey'),
  OrdinaryFormProps,
  OrdinarySymbolProps,
  ReactForm: formComponent.create(ReactForm, 'form'),
  OptionalForm: formComponent.create(OptionalForm, 'form'),
  NullableForm: formComponent.create(NullableForm, 'form'),
  BroadErrors: formComponent.create(BroadErrors, 'form'),
  SelectOwner: formComponent.create(TwoFormProps, 'owner'),
  SelectOther: formComponent.create(TwoFormProps, 'other'),
  MemoForm: formComponent.create(React.memo(ReactForm), 'form'),
  MemoPrepared: React.memo(formComponent.create(CoreForm, 'owner')),
  LazyForm: formComponent.create(
    React.lazy(() => Promise.resolve({ default: ReactForm })),
    'form',
  ),
  LazyPrepared: React.lazy(() => Promise.resolve({ default: Registration })),
  MemoLazyPrepared: React.memo(
    React.lazy(() => Promise.resolve({ default: Registration })),
  ),
  LazyMemoPrepared: React.lazy(() =>
    Promise.resolve({ default: React.memo(Registration) }),
  ),
} satisfies ReactFormComponents

const hooks = createFormHook({ fieldComponents: {}, formComponents: registry })
const specificOptions = formOptions({ defaultValues: { name: '' } })

function SpecificCore(_props: { form: FormApi<{ name: string }, any> }) {
  return null
}

function SpecificReact(_props: {
  form: ReactFormApi<{ name: string }, any, DefaultReactFormComponentMap>
}) {
  return null
}

function SpecificOptions(_props: {
  form: ReactFormType<typeof specificOptions>
}) {
  return null
}

function SpecificErrors(_props: {
  form: FormApi<
    any,
    ScopedErrorTypes<{ message: string; code: 'specific' }, never>
  >
}) {
  return null
}

function NonForm(_props: {
  value: { state: { values: any } }
  any: any
  unknown: unknown
  label: string
}) {
  return null
}

// @ts-expect-error concrete core form values cannot be required
formComponent.create(SpecificCore, 'form')
// @ts-expect-error concrete React form values cannot be required
formComponent.create(SpecificReact, 'form')
// @ts-expect-error options objects describe a concrete form
formComponent.create(SpecificOptions, 'form')
// @ts-expect-error specific validation errors cannot be required
formComponent.create(SpecificErrors, 'form')
// @ts-expect-error a state property alone does not establish a form API
formComponent.create(NonForm, 'value')
// @ts-expect-error plain any provides no evidence of a form API
formComponent.create(NonForm, 'any')
// @ts-expect-error inline memo inference must still reject a plain any prop
formComponent.create(React.memo(NonForm), 'any')
// @ts-expect-error unknown provides no evidence of a form API
formComponent.create(NonForm, 'unknown')
// @ts-expect-error a non-form prop cannot receive a form API
formComponent.create(NonForm, 'label')
// @ts-expect-error the selected prop must exist
formComponent.create(CoreForm, 'missing')
// @ts-expect-error the prop key is required
formComponent.create(CoreForm)
// @ts-expect-error the component and prop key are required
formComponent.create()
const preparedComponent = <Registration label="Save" />
void preparedComponent

function FormComponentProps() {
  const form = hooks.useAppForm({ defaultValues: { name: '' } })
  const other = hooks.useAppForm({ defaultValues: { count: 1 } })

  expectTypeOf(form.state.values).toEqualTypeOf<{ name: string }>()
  expectTypeOf<React.ComponentProps<typeof form.CoreForm>>().toEqualTypeOf<{
    label: string
    disabled?: boolean
  }>()
  expectTypeOf<React.ComponentProps<typeof form.MemoPrepared>>().toEqualTypeOf<{
    label: string
    disabled?: boolean
  }>()
  expectTypeOf<React.ComponentProps<typeof form.LazyPrepared>>().toEqualTypeOf<{
    label: string
    disabled?: boolean
  }>()

  return (
    <>
      <form.CoreForm label="Save" />
      <other.CoreForm label="Save other shape" disabled />
      <form.ReactForm />
      <form.OptionalForm />
      <form.NullableForm />
      <form.BroadErrors />
      <form.SelectOwner other={form} />
      <form.SelectOther owner={form} />
      {/* @ts-expect-error other form props remain required */}
      <form.SelectOwner />
      {/* @ts-expect-error only the selected form prop is omitted */}
      <form.SelectOther />
      <form.MemoForm />
      <form.LazyForm />
      <form.MemoPrepared label="Memo" disabled />
      <form.LazyPrepared label="Lazy" />
      <form.MemoLazyPrepared label="Memo lazy" />
      <form.LazyMemoPrepared label="Lazy memo" />
      <form.AnyProps anything="Ordinary any props" />
      <form.WrappedAnyProps anything="Wrapped any props" />
      <form.OrdinaryFormProps form="Caller form" owner="Caller owner" />
      <form.OrdinarySymbolProps />
      {/* @ts-expect-error ordinary form props remain required */}
      <form.OrdinaryFormProps />
      <form.Notice
        value={1}
        onSelect={(value) => expectTypeOf(value).toEqualTypeOf<number>()}
      />
      {/* @ts-expect-error remaining required props stay required */}
      <form.CoreForm />
      {/* @ts-expect-error memo outside preparation preserves required props */}
      <form.MemoPrepared />
      {/* @ts-expect-error lazy outside preparation preserves required props */}
      <form.LazyPrepared />
      {/* @ts-expect-error memo outside preparation omits the selected form prop */}
      <form.MemoPrepared label="Save" owner={form} />
      {/* @ts-expect-error lazy outside preparation omits the selected form prop */}
      <form.LazyPrepared label="Save" owner={form} />
      {/* @ts-expect-error the injected prop is omitted from consumer props */}
      <form.CoreForm owner={form} label="Save" />
      {/* @ts-expect-error optional injected props are omitted too */}
      <form.OptionalForm form={form} />
      {/* @ts-expect-error nullable injected props are omitted too */}
      <form.NullableForm form={null} />
    </>
  )
}

void FormComponentProps
