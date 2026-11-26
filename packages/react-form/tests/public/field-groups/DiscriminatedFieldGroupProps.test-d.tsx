import React from 'react'
import { defineFieldGroup, useForm } from '../../../src'

const nameGroup = defineFieldGroup(({ strict }) => ({
  name: strict<string>(),
}))

type SummaryProps =
  | { fields: typeof nameGroup.fields; variant: 'label'; label: string }
  | { fields: typeof nameGroup.fields; variant: 'icon'; icon: string }

function Summary(props: SummaryProps) {
  return props.variant === 'label' ? props.label : props.icon
}

const GroupSummary = nameGroup.bindComponent(Summary, 'fields')

function DiscriminatedFieldGroupProps() {
  const form = useForm({ defaultValues: { name: '' } })
  const nestedForm = useForm({ defaultValues: { profile: { name: '' } } })

  return (
    <>
      <GroupSummary form={form} variant="label" label="Name" />
      <GroupSummary form={form} variant="icon" icon="person" />
      {/* @ts-expect-error binding preserves the required label */}
      <GroupSummary form={form} variant="label" />
      {/* @ts-expect-error binding preserves the required icon */}
      <GroupSummary form={form} variant="icon" />
      {/* @ts-expect-error the label variant does not accept icon props */}
      <GroupSummary form={form} variant="label" icon="person" />
      <GroupSummary
        form={nestedForm}
        fields={{ name: 'profile.name' }}
        variant="label"
        label="Name"
      />
      <GroupSummary
        form={nestedForm}
        fields={{ name: 'profile.name' }}
        variant="icon"
        icon="person"
      />
      {/* @ts-expect-error explicit bindings preserve the required label */}
      <GroupSummary
        form={nestedForm}
        fields={{ name: 'profile.name' }}
        variant="label"
      />
      {/* @ts-expect-error explicit bindings preserve the required icon */}
      <GroupSummary
        form={nestedForm}
        fields={{ name: 'profile.name' }}
        variant="icon"
      />
      <GroupSummary
        form={nestedForm}
        fields={{ name: 'profile.name' }}
        variant="icon"
        // @ts-expect-error the icon variant does not accept label props
        label="Name"
      />
    </>
  )
}

void DiscriminatedFieldGroupProps
