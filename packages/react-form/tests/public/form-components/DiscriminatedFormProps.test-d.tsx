import React from 'react'
import { createFormHook, getFormHookHelpers } from '../../../src'
import type { AnyReactFormApi } from '../../../src'

type SummaryProps =
  | { owner: AnyReactFormApi; variant: 'label'; label: string }
  | { owner: AnyReactFormApi; variant: 'icon'; icon: string }

function Summary(props: SummaryProps) {
  return props.variant === 'label' ? props.label : props.icon
}

const { formComponent } = getFormHookHelpers()
const PreparedSummary = formComponent.create({
  component: Summary,
  replaceProperty: 'owner',
})

function PreparedSummaries() {
  return (
    <>
      <PreparedSummary variant="label" label="Save" />
      <PreparedSummary variant="icon" icon="save" />
      {/* @ts-expect-error preparation preserves the required label */}
      <PreparedSummary variant="label" />
      {/* @ts-expect-error preparation preserves the required icon */}
      <PreparedSummary variant="icon" />
      {/* @ts-expect-error the label variant does not accept icon props */}
      <PreparedSummary variant="label" icon="save" />
    </>
  )
}

const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: { Summary: PreparedSummary, PreparedSummaries },
})

function DiscriminatedFormProps() {
  const form = useAppForm({ defaultValues: { name: '' } })

  return (
    <>
      <form.PreparedSummaries />
      <form.Summary variant="label" label="Save" />
      <form.Summary variant="icon" icon="save" />
      {/* @ts-expect-error binding preserves the required label */}
      <form.Summary variant="label" />
      {/* @ts-expect-error binding preserves the required icon */}
      <form.Summary variant="icon" />
      {/* @ts-expect-error the icon variant does not accept label props */}
      <form.Summary variant="icon" label="Save" />
      {/* @ts-expect-error the injected form prop is removed */}
      <form.Summary variant="label" label="Save" owner={form} />
    </>
  )
}

void DiscriminatedFormProps
