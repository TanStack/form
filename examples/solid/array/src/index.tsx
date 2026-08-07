import { For, Index, createMemo, createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { createForm } from '@tanstack/solid-form'
import './index.css'

function ArrayForm(props: { items: Array<string> }) {
  const form = createForm(() => ({
    defaultValues: {
      items: props.items,
    },
    onSubmit: ({ value }) => {
      console.log(value)
      alert(`Submitted ${value.items.length} items.`)
    },
  }))

  return (
    <>
      <form.Subscribe selector={(state) => state.values.items.length}>
        {(amount) => <h2>Item amount: {amount().toLocaleString()}</h2>}
      </form.Subscribe>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
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
        <form.ArrayField name="items">
          {(array) => (
            <ul>
              <Index each={array().value}>
                {(_, index) => (
                  <form.Field name={`items[${index}]`}>
                    {(field) => (
                      <li>
                        <label>
                          <span>Field {index}</span>
                          <input
                            name={field().name}
                            value={field().value}
                            onBlur={field().handleBlur}
                            onInput={(event) =>
                              field().handleChange(event.currentTarget.value)
                            }
                          />
                        </label>
                      </li>
                    )}
                  </form.Field>
                )}
              </Index>
            </ul>
          )}
        </form.ArrayField>
      </form>
    </>
  )
}

function App() {
  const [itemAmount, setItemAmount] = createSignal(50)
  const [requestedAmount, setRequestedAmount] = createSignal(50)
  const items = createMemo(() => Array.from({ length: itemAmount() }, () => ''))

  function updateItems() {
    if (!Number.isNaN(requestedAmount())) {
      setItemAmount(Math.min(10_000, Math.max(0, requestedAmount())))
    }
  }

  return (
    <div>
      <h1>Arrays in Form Example</h1>
      <label for="itemsAmount">
        Enter the amount of items to render with the form.
        <br />
        Note that it will reset the state.
      </label>
      <br />
      <input
        id="itemsAmount"
        type="number"
        value={requestedAmount()}
        min={1}
        step={1}
        max={10_000}
        onInput={(event) =>
          setRequestedAmount(event.currentTarget.valueAsNumber)
        }
      />
      <button type="button" onClick={updateItems}>
        Update
      </button>
      <br />
      <For each={[itemAmount()]}>{() => <ArrayForm items={items()} />}</For>
    </div>
  )
}

render(() => <App />, document.getElementById('root')!)
