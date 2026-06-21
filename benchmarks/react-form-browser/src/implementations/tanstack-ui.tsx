import { useMemo } from 'react'
import { useForm } from '@tanstack/react-form'
import { VALID_VALUE, fieldName, targetIndex } from '../scenario-contracts'
import {
  INSERTED_ITEM,
  createFieldValues,
  createItems,
} from './react-scenario-runner'
import type { ArrayOperation, ScenarioCounters } from './react-scenario-runner'

export function ManyFieldsForm({
  count,
  counters,
}: {
  count: number
  counters: ScenarioCounters
}) {
  const defaultValues = useMemo(() => createFieldValues(count), [count])
  const form = useForm({ defaultValues })

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <form.Field key={index} name={fieldName(index)}>
          {(field) => {
            counters.fieldRenders++
            return (
              <input
                data-bench-field="text"
                data-index={index}
                name={field.name}
                value={field.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            )
          }}
        </form.Field>
      ))}
    </>
  )
}

export function ValidationForm({
  count,
  counters,
}: {
  count: number
  counters: ScenarioCounters
}) {
  const target = targetIndex(count)
  const defaultValues = useMemo(
    () => ({
      ...createFieldValues(count),
      [fieldName(target)]: VALID_VALUE,
    }),
    [count, target],
  )
  const validators = useMemo(
    () => [
      {
        triggers: ['change' as const],
        run: ({ value }: { value: string }) => {
          counters.validatorRuns++
          return value.length < 3 ? 'Value is too short' : undefined
        },
      },
      {
        triggers: ['change' as const],
        run: ({ value }: { value: string }) => {
          counters.validatorRuns++
          return value.includes('x') ? 'Value cannot include x' : undefined
        },
      },
    ],
    [counters],
  )
  const form = useForm({ defaultValues })

  return (
    <>
      {Array.from({ length: count }, (_, index) =>
        index === target ? (
          <form.Field
            key={index}
            name={fieldName(index)}
            validators={validators}
          >
            {(field) => {
              counters.fieldRenders++
              return (
                <>
                  <input
                    data-bench-field="text"
                    data-index={index}
                    name={field.name}
                    value={field.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  <output data-testid="target-error-count">
                    {field.errors.length}
                  </output>
                </>
              )
            }}
          </form.Field>
        ) : (
          <form.Field key={index} name={fieldName(index)}>
            {(field) => {
              counters.fieldRenders++
              return (
                <input
                  data-bench-field="text"
                  data-index={index}
                  name={field.name}
                  value={field.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              )
            }}
          </form.Field>
        ),
      )}
    </>
  )
}

export function DependentFieldsForm({
  count,
  counters,
}: {
  count: number
  counters: ScenarioCounters
}) {
  const defaultValues = useMemo(() => createFieldValues(count), [count])
  const listeners = useMemo(
    () => [
      {
        triggers: ['change' as const],
        watchFields: [fieldName(0)],
        run: () => {
          counters.listenerRuns++
        },
      },
    ],
    [counters],
  )
  const form = useForm({ defaultValues })

  return (
    <>
      {Array.from({ length: count }, (_, index) =>
        index === 1 ? (
          <form.Field key={index} name={fieldName(index)} listeners={listeners}>
            {(field) => {
              counters.fieldRenders++
              return (
                <input
                  data-bench-field="text"
                  data-index={index}
                  name={field.name}
                  value={field.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              )
            }}
          </form.Field>
        ) : (
          <form.Field key={index} name={fieldName(index)}>
            {(field) => {
              counters.fieldRenders++
              return (
                <input
                  data-bench-field="text"
                  data-index={index}
                  name={field.name}
                  value={field.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              )
            }}
          </form.Field>
        ),
      )}
      <output data-testid="listener-runs">{counters.listenerRuns}</output>
    </>
  )
}

export function ArrayScenario({
  count,
  counters,
  operation,
}: {
  count: number
  counters: ScenarioCounters
  operation: ArrayOperation
}) {
  const defaultValues = useMemo(
    () => ({
      items: createItems(count),
    }),
    [count],
  )
  const form = useForm({ defaultValues })

  return (
    <form.ArrayField name="items">
      {(array) => {
        counters.arrayRenders++
        return (
          <>
            <output data-testid="array-length">{array.value.length}</output>
            {operation === 'swap' ? (
              <button
                data-testid="array-swap"
                type="button"
                onClick={() => array.swapValues(0, array.value.length - 1)}
              >
                Swap
              </button>
            ) : null}
            {operation === 'move' ? (
              <button
                data-testid="array-move"
                type="button"
                onClick={() => array.moveValue(0, array.value.length - 1)}
              >
                Move
              </button>
            ) : null}
            {operation === 'insert-remove' ? (
              <>
                <button
                  data-testid="array-insert"
                  type="button"
                  onClick={() => array.insertValue(1, INSERTED_ITEM)}
                >
                  Insert
                </button>
                <button
                  data-testid="array-remove-inserted"
                  type="button"
                  onClick={() => array.removeValue(1)}
                >
                  Remove inserted
                </button>
              </>
            ) : null}
            {array.value.map((item, index) => (
              <form.Field key={item.id} name={`items[${index}].name`}>
                {(field) => {
                  counters.fieldRenders++
                  return (
                    <input
                      data-bench-field="array-item"
                      data-index={index}
                      name={field.name}
                      value={field.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                  )
                }}
              </form.Field>
            ))}
          </>
        )
      }}
    </form.ArrayField>
  )
}

export function FormGroupScenario({
  count,
  counters,
}: {
  count: number
  counters: ScenarioCounters
}) {
  const defaultValues = useMemo(() => {
    const group = createFieldValues(count)
    group.field0 = VALID_VALUE
    return { group }
  }, [count])
  const validators = useMemo(
    () => [
      {
        triggers: ['change' as const],
        run: ({ value }: { value: Record<string, string> }) => {
          counters.formGroupValidatorRuns++
          return (value.field0 ?? '').length < 3
            ? {
                fields: {
                  field0: 'Group field is too short',
                },
              }
            : undefined
        },
      },
    ],
    [counters],
  )
  const form = useForm({ defaultValues })

  return (
    <form.FormGroup name="group" validators={validators}>
      {(group) => (
        <>
          <group.Subscribe selector={(state) => state.isValid}>
            {(isValid) => {
              counters.groupSubscribeRenders++
              return (
                <output data-testid="group-is-valid">{String(isValid)}</output>
              )
            }}
          </group.Subscribe>
          {Array.from({ length: count }, (_, index) => (
            <group.Field key={index} name={fieldName(index)}>
              {(field) => {
                counters.fieldRenders++
                return (
                  <>
                    <input
                      data-bench-field="group-text"
                      data-index={index}
                      name={field.name}
                      value={field.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                    {index === 0 ? (
                      <>
                        <output data-testid="group-field-name">
                          {field.name}
                        </output>
                        <output data-testid="group-error-count">
                          {field.errors.length}
                        </output>
                      </>
                    ) : null}
                  </>
                )
              }}
            </group.Field>
          ))}
        </>
      )}
    </form.FormGroup>
  )
}
