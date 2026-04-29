import { expectTypeOf, it } from 'vitest'
import { useForm } from '../src/index'

type Country = { id: number; name: string }

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
            expectTypeOf(field.state.value).toEqualTypeOf<'test'>()
            return null
          }}
        />
        <form.Field
          name="age"
          children={(field) => {
            expectTypeOf(field.state.value).toEqualTypeOf<84>()
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
              expectTypeOf(value).toEqualTypeOf<'test'>()
              return null
            },
          }}
          children={() => null}
        />
        <form.Field
          name="age"
          validators={{
            onChange: ({ value }) => {
              expectTypeOf(value).toEqualTypeOf<84>()
              return null
            },
          }}
          children={() => null}
        />
      </>
    )
  }
})

it('should infer custom meta from form and field defaultMeta', () => {
  function Comp() {
    const form = useForm({
      defaultValues: {
        countryId: '',
      },
      defaultMeta: {
        disabled: false,
        order: 1,
        label: 'Country',
        formDataSource: [] as Country[],
      },
    })

    expectTypeOf(form.getFieldMeta('countryId')?.formDataSource).toEqualTypeOf<
      Country[] | undefined
    >()
    form.getFieldMeta('countryId')?.disabled
    form.state.fieldMeta.countryId?.disabled

    return (
      <form.Field
        name="countryId"
        defaultMeta={{
          dataSource: [] as Country[],
        }}
      >
        {(field) => {
          expectTypeOf(field.state.meta.disabled).toEqualTypeOf<boolean>()
          expectTypeOf(field.state.meta.order).toEqualTypeOf<number>()
          expectTypeOf(field.state.meta.label).toEqualTypeOf<string>()
          expectTypeOf(field.state.meta.formDataSource).toEqualTypeOf<
            Country[]
          >()
          expectTypeOf(field.state.meta.dataSource).toEqualTypeOf<Country[]>()
          expectTypeOf(field.getMeta().dataSource).toEqualTypeOf<Country[]>()

          field.setMeta((prev) => ({
            ...prev,
            disabled: true,
            dataSource: [{ id: 1, name: 'Yemen' }],
          }))

          return null
        }}
      </form.Field>
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
