import React, { useState } from 'react'
import { Subscribe, useForm } from '../../../src'

export function ArrayMetaSubscription(props: { subscribeToMeta?: boolean }) {
  const form = useForm({
    defaultValues: { items: [{ label: 'Initial' }] },
  })

  return (
    <form.ArrayField name="items" {...props}>
      {(field) => (
        <>
          <output aria-label="Array blurred">
            {String(field.meta.isBlurred)}
          </output>
          <output aria-label="Array dirty">{String(field.meta.isDirty)}</output>
          <output aria-label="Array default">
            {String(field.meta.isDefaultValue)}
          </output>
          <output aria-label="Subfields dirty">
            {String(field.meta.subfields.isSomeDirty)}
          </output>
          <output aria-label="Array value">
            {field.value.map((item) => item.label).join(', ')}
          </output>
          <Subscribe
            source={field.atom}
            selector={(state) => state.meta.isBlurred}
          >
            {(isBlurred) => (
              <output aria-label="Backing array blurred">
                {String(isBlurred)}
              </output>
            )}
          </Subscribe>
          <Subscribe
            source={field.atom}
            selector={(state) => state.value[0]?.label}
          >
            {(label) => (
              <output aria-label="Backing first item">{label}</output>
            )}
          </Subscribe>
          {field.value.map((_, index) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key
            <form.Field key={index} name={`items[${index}].label`}>
              {(item) => (
                <label>
                  Item {index + 1}
                  <input
                    value={item.value}
                    onChange={(event) => item.handleChange(event.target.value)}
                  />
                </label>
              )}
            </form.Field>
          ))}
          <button onClick={field.handleBlur}>Blur array</button>
          <button onClick={() => form.resetField('items')}>Reset array</button>
          <button onClick={() => field.pushValue({ label: 'Added' })}>
            Add item
          </button>
          <button
            onClick={() => field.replaceValue(0, { label: 'Replacement' })}
          >
            Replace first item
          </button>
          <button onClick={() => field.removeValue(field.value.length - 1)}>
            Remove last item
          </button>
          <button onClick={() => field.clearValues()}>Clear items</button>
        </>
      )}
    </form.ArrayField>
  )
}

export function DynamicArrayMetaSubscription() {
  const [subscribeToMeta, setSubscribeToMeta] = useState(false)

  return (
    <>
      <button onClick={() => setSubscribeToMeta((enabled) => !enabled)}>
        Toggle meta subscription
      </button>
      <ArrayMetaSubscription subscribeToMeta={subscribeToMeta} />
    </>
  )
}
