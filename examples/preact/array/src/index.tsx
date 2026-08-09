import { useForm } from '@tanstack/preact-form'
import { render } from 'preact'
import './index.css'
import { useMemo, useRef, useState } from 'preact/hooks'

function ArrayForm({ items }: { items: Array<string> }) {
  const form = useForm({
    defaultValues: {
      items,
    },
    onSubmit: ({ value }) => {
      // Do something with form data
      console.log(value)
      alert(`Submitted ${value.items.length} items.`)
    },
  })

  return (
    <>
      <form.Subscribe selector={(state) => state.values.items.length}>
        {(amount) => <h2>Item amount: {amount.toLocaleString()}</h2>}
      </form.Subscribe>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <button type="submit">Submit</button>
        <button
          type="button"
          onClick={() => form.pushFieldValue('items', 'New Field')}
        >
          Create item
        </button>
        {/**
         * Usually, this array would rerender whenever an item was changed.
         * To reduce rerenders, use the ArrayField component!
         */}
        <form.ArrayField name="items">
          {(array) => (
            <ul>
              {array.value.map((_, i) => (
                <form.Field name={`items[${i}]`}>
                  {(field) => (
                    <li>
                      <label>
                        <span>Field {i}</span>

                        <input
                          name={field.name}
                          value={field.value}
                          onBlur={field.handleBlur}
                          onInput={(e) =>
                            field.handleChange(e.currentTarget.value)
                          }
                        />
                      </label>
                    </li>
                  )}
                </form.Field>
              ))}
            </ul>
          )}
        </form.ArrayField>
      </form>
    </>
  )
}

function App() {
  const [itemAmount, setItemAmount] = useState(50)
  const inputRef = useRef<HTMLInputElement>(null)

  const items = useMemo(
    () => Array.from({ length: itemAmount }, () => ''),
    [itemAmount],
  )

  function updateItems() {
    if (inputRef.current && !Number.isNaN(inputRef.current.valueAsNumber)) {
      setItemAmount(
        Math.min(10_000, Math.max(0, inputRef.current.valueAsNumber)),
      )
    }
  }
  return (
    <div>
      <h1>Arrays in Form Example</h1>
      <label htmlFor="itemsAmount">
        Enter the amount of items to render with the form.
        <br />
        Note that it will reset the state.
      </label>
      <br />
      <input
        id="itemsAmount"
        ref={inputRef}
        type="number"
        defaultValue={50}
        min={1}
        step={1}
        max={10_000}
      />
      <button type="button" onClick={updateItems}>
        Update
      </button>

      <br />

      <ArrayForm key={itemAmount} items={items} />
    </div>
  )
}

render(<App />, document.getElementById('root')!)
