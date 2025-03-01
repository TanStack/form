import { assertType, it } from 'vitest'
import { useForm } from '../src/index'

it('should type state.value properly', () => {
  function Comp() {
    const form = useForm({
      defaultValues: {
        firstName: 'test',
        age: 84,
      },
    } as const)

    return (
      <>
        <form.Field
          name="firstName"
          children={(field) => {
            assertType<'test'>(field.state.value)
            return null
          }}
        />
        <form.Field
          name="age"
          children={(field) => {
            assertType<84>(field.state.value)
            return null
          }}
        />
      </>
    )
  }
})

it('should type onChange properly', () => {
  function Comp() {
    const form = useForm({
      defaultValues: {
        firstName: 'test',
        age: 84,
      },
    } as const)

    return (
      <>
        <form.Field
          name="firstName"
          validators={{
            onChange: ({ value }) => {
              assertType<'test'>(value)
              return null
            },
          }}
          children={() => null}
        />
        <form.Field
          name="age"
          validators={{
            onChange: ({ value }) => {
              assertType<84>(value)
              return null
            },
          }}
          children={() => null}
        />
      </>
    )
  }
})

it('should type array subfields', () => {
  type FormDefinition = {
    nested: {
      people: {
        name: string
        age: number
      }[]
    }
  }

  function App() {
    const form = useForm({
      defaultValues: {
        nested: {
          people: [],
        },
      } as FormDefinition,
      onSubmit({ value }) {
        alert(JSON.stringify(value))
      },
    })

    return (
      <form.Field name="nested.people" mode="array">
        {(field) =>
          field.state.value.map((_, i) => (
            <form.Field key={i} name={`nested.people[${i}].name`}>
              {(subField) => (
                <input
                  value={subField.state.value}
                  onChange={(e) => subField.handleChange(e.target.value)}
                />
              )}
            </form.Field>
          ))
        }
      </form.Field>
    )
  }
})
