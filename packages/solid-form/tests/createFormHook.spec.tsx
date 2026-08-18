import { render } from 'solid-js/web'
import { describe, expect, it, vi } from 'vitest'
import { createFormHook } from '../src'
import type { JSX } from 'solid-js'

function mount(Component: () => JSX.Element) {
  const container = document.createElement('div')
  document.body.append(container)
  const disposeRoot = render(Component, container)
  return {
    dispose: () => {
      disposeRoot()
      container.remove()
    },
  }
}

describe('createFormHook defaults', () => {
  it('applies form, field, and form group defaults through public components', async () => {
    const formCalls: Array<string> = []
    const fieldCalls: Array<string> = []
    const onSubmitInvalid = vi.fn()
    let changeDirect!: () => void
    let changeDirectArray!: () => void
    let changeGrouped!: () => void
    let changeGroupedArray!: () => void
    let submitGroup!: () => Promise<unknown>
    const { useAppForm } = createFormHook({
      fieldComponents: {},
      formComponents: {},
      defaultFormOptions: {
        listenersMerge: 'append',
        listeners: [
          {
            triggers: ['change'],
            run: () => formCalls.push('default'),
          },
        ],
      },
      defaultFieldOptions: {
        listenersMerge: 'prepend',
        listeners: [
          {
            triggers: ['change'],
            run: ({ fieldApi }) =>
              fieldCalls.push(`default:${String(fieldApi.name)}`),
          },
        ],
      },
      defaultFormGroupOptions: {
        onSubmitInvalid,
      },
    })

    function Component() {
      const form = useAppForm(() => ({
        defaultValues: {
          direct: '',
          directArray: ['one'],
          group: {
            field: '',
            array: ['one'],
          },
        },
        listeners: [
          {
            triggers: ['change'],
            run: () => formCalls.push('local'),
          },
        ],
      }))

      return (
        <>
          <form.Field
            name="direct"
            listeners={[
              {
                triggers: ['change'],
                run: ({ fieldApi }) =>
                  fieldCalls.push(`local:${String(fieldApi.name)}`),
              },
            ]}
          >
            {(field) => {
              changeDirect = () => field().handleChange('changed')
              return null
            }}
          </form.Field>
          <form.ArrayField name="directArray">
            {(field) => {
              changeDirectArray = () =>
                field().handleChange([...field().value, 'two'])
              return null
            }}
          </form.ArrayField>
          <form.FormGroup
            name="group"
            validators={[
              {
                triggers: [],
                run: () => 'Invalid group',
              },
            ]}
          >
            {(group) => {
              submitGroup = () => group().handleSubmit()
              return (
                <>
                  <group.Field name="field">
                    {(field) => {
                      changeGrouped = () => field().handleChange('changed')
                      return null
                    }}
                  </group.Field>
                  <group.ArrayField name="array">
                    {(field) => {
                      changeGroupedArray = () =>
                        field().handleChange([...field().value, 'two'])
                      return null
                    }}
                  </group.ArrayField>
                </>
              )
            }}
          </form.FormGroup>
        </>
      )
    }

    const view = mount(() => <Component />)

    changeDirect()
    changeDirectArray()
    changeGrouped()
    changeGroupedArray()

    expect(formCalls).toEqual([
      'default',
      'local',
      'default',
      'local',
      'default',
      'local',
      'default',
      'local',
    ])
    expect(fieldCalls).toEqual([
      'local:direct',
      'default:direct',
      'default:directArray',
      'default:group.field',
      'default:group.array',
    ])

    await submitGroup()
    expect(onSubmitInvalid).toHaveBeenCalledOnce()

    view.dispose()
  })
})
