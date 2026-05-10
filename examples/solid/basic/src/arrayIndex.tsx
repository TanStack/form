import { createForm } from '@tanstack/solid-form'
import { Index, Show } from 'solid-js'
import z from 'zod'

const ARRAY = [...new Array(10_000).keys()]
const values = ARRAY.map((i) => ({ id: i, message: 'Field ' + i }))

export function ArrayIndexExample() {
  const form = createForm(() => ({
    defaultValues: { fields: values },
    validators: [
      {
        run: z.object({
          fields: z.array(
            z.object({ id: z.number(), message: z.string().min(3) }),
          ),
        }),
        triggers: [
          {
            trigger: 'change' as const,
            when: ({ triggerFieldApi }) => triggerFieldApi !== undefined,
          },
        ],
        triggerDebounceMs: 500,
      },
    ],
  }))

  return (
    <>
      <button
        type="button"
        onClick={() => form.swapFieldValues('fields', 0, 1)}
      >
        Swap 0 and 1 (will be stale)
      </button>
      &nbsp;
      <button
        type="button"
        onClick={() =>
          form.pushFieldValue('fields', {
            id: form.state.values.fields.length,
            message: 'New Field',
          })
        }
      >
        Push
      </button>
      <br />
      <form.ArrayField name="fields">
        {(field) => (
          <>
            <h2>Values amount: {field().value.length.toLocaleString()}</h2>
            <Index each={field().value}>
              {(_, i) => (
                <form.Field name={`fields[${i}].message`}>
                  {(field) => (
                    <span style={{ position: 'relative' }}>
                      <input
                        value={field().value}
                        onInput={(e) =>
                          field().handleChange(e.currentTarget.value)
                        }
                      />
                      <span>{field().meta.isValid ? '✅' : '❌'}</span>
                      <Show when={field().meta.isInvalid}>
                        <span
                          style={{
                            position: 'absolute',
                            'background-color': 'black',
                            left: 0,
                            top: '100%',
                            'z-index': 1,
                            color: 'white',
                          }}
                        >
                          {field().meta.errors[0].message}
                        </span>
                      </Show>
                    </span>
                  )}
                </form.Field>
              )}
            </Index>
          </>
        )}
      </form.ArrayField>
    </>
  )
}
