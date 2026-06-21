import { useMemo, useRef } from 'react'
import { useFieldArray, useForm, useFormState, useWatch } from 'react-hook-form'
import { VALID_VALUE, fieldName, targetIndex } from '../scenario-contracts'
import {
  INSERTED_ITEM,
  createFieldValues,
  createItems,
} from './react-scenario-runner'
import type {
  Control,
  FieldError,
  FieldErrors,
  UseFormRegister,
} from 'react-hook-form'
import type { ArrayOperation, ScenarioCounters } from './react-scenario-runner'

type TextFormValues = Record<string, string>

interface ArrayFormValues {
  items: Array<{ id: string; name: string }>
}

interface GroupFormValues {
  group: Record<string, string>
}

export function ManyFieldsForm({
  count,
  counters,
}: {
  count: number
  counters: ScenarioCounters
}) {
  const defaultValues = useMemo(() => createFieldValues(count), [count])
  const { register } = useForm<TextFormValues>({ defaultValues })

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <TextInput
          counters={counters}
          index={index}
          key={index}
          register={register}
        />
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
  const targetName = fieldName(target)
  const defaultValues = useMemo(
    () => ({
      ...createFieldValues(count),
      [targetName]: VALID_VALUE,
    }),
    [count, targetName],
  )
  const { control, register } = useForm<TextFormValues>({
    criteriaMode: 'all',
    defaultValues,
    mode: 'onChange',
  })

  return (
    <>
      {Array.from({ length: count }, (_, index) =>
        index === target ? (
          <ValidatedTextInput
            control={control}
            counters={counters}
            index={index}
            key={index}
            register={register}
          />
        ) : (
          <TextInput
            counters={counters}
            index={index}
            key={index}
            register={register}
          />
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
  const { control, register } = useForm<TextFormValues>({ defaultValues })

  return (
    <>
      <DependentFieldListener control={control} counters={counters} />
      {Array.from({ length: count }, (_, index) => (
        <TextInput
          counters={counters}
          index={index}
          key={index}
          register={register}
        />
      ))}
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
  const { control, register } = useForm<ArrayFormValues>({ defaultValues })
  const { fields, insert, move, remove, swap } = useFieldArray({
    control,
    name: 'items',
  })

  counters.arrayRenders++

  return (
    <>
      <output data-testid="array-length">{fields.length}</output>
      {operation === 'swap' ? (
        <button
          data-testid="array-swap"
          type="button"
          onClick={() => swap(0, fields.length - 1)}
        >
          Swap
        </button>
      ) : null}
      {operation === 'move' ? (
        <button
          data-testid="array-move"
          type="button"
          onClick={() => move(0, fields.length - 1)}
        >
          Move
        </button>
      ) : null}
      {operation === 'insert-remove' ? (
        <>
          <button
            data-testid="array-insert"
            type="button"
            onClick={() => insert(1, INSERTED_ITEM)}
          >
            Insert
          </button>
          <button
            data-testid="array-remove-inserted"
            type="button"
            onClick={() => remove(1)}
          >
            Remove inserted
          </button>
        </>
      ) : null}
      {fields.map((field, index) => (
        <ArrayInput
          counters={counters}
          index={index}
          key={field.id}
          register={register}
        />
      ))}
    </>
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
  const { control, register } = useForm<GroupFormValues>({
    defaultValues,
    mode: 'onChange',
  })

  return (
    <>
      <GroupValidationOutputs control={control} counters={counters} />
      {Array.from({ length: count }, (_, index) => (
        <GroupInput
          counters={counters}
          index={index}
          key={index}
          register={register}
        />
      ))}
    </>
  )
}

function TextInput({
  counters,
  index,
  register,
}: {
  counters: ScenarioCounters
  index: number
  register: UseFormRegister<TextFormValues>
}) {
  counters.fieldRenders++
  const name = fieldName(index)

  return (
    <input data-bench-field="text" data-index={index} {...register(name)} />
  )
}

function ValidatedTextInput({
  control,
  counters,
  index,
  register,
}: {
  control: Control<TextFormValues>
  counters: ScenarioCounters
  index: number
  register: UseFormRegister<TextFormValues>
}) {
  counters.fieldRenders++
  const name = fieldName(index)

  return (
    <>
      <input
        data-bench-field="text"
        data-index={index}
        {...register(name, {
          validate: {
            excludesX: (value) => {
              counters.validatorRuns++
              return !value.includes('x') || 'Value cannot include x'
            },
            minLength: (value) => {
              counters.validatorRuns++
              return value.length >= 3 || 'Value is too short'
            },
          },
        })}
      />
      <TargetErrorCount control={control} name={name} />
    </>
  )
}

function TargetErrorCount({
  control,
  name,
}: {
  control: Control<TextFormValues>
  name: string
}) {
  const { errors } = useFormState({ control, name })

  return (
    <output data-testid="target-error-count">
      {getErrorCount(errors[name])}
    </output>
  )
}

function DependentFieldListener({
  control,
  counters,
}: {
  control: Control<TextFormValues>
  counters: ScenarioCounters
}) {
  const value = useWatch({ control, name: fieldName(0) })
  const previousValue = useRef(value)

  if (previousValue.current !== value) {
    previousValue.current = value
    counters.listenerRuns++
  }

  return null
}

function ArrayInput({
  counters,
  index,
  register,
}: {
  counters: ScenarioCounters
  index: number
  register: UseFormRegister<ArrayFormValues>
}) {
  counters.fieldRenders++

  return (
    <input
      data-bench-field="array-item"
      data-index={index}
      {...register(`items.${index}.name`)}
    />
  )
}

function GroupInput({
  counters,
  index,
  register,
}: {
  counters: ScenarioCounters
  index: number
  register: UseFormRegister<GroupFormValues>
}) {
  counters.fieldRenders++
  const name = `group.${fieldName(index)}` as const

  return (
    <input
      data-bench-field="group-text"
      data-index={index}
      {...register(
        name,
        index === 0
          ? {
              validate: (value) => {
                counters.formGroupValidatorRuns++
                return value.length >= 3 || 'Group field is too short'
              },
            }
          : undefined,
      )}
    />
  )
}

function GroupValidationOutputs({
  control,
  counters,
}: {
  control: Control<GroupFormValues>
  counters: ScenarioCounters
}) {
  const { errors } = useFormState({ control, name: 'group.field0' })
  const error = getGroupFieldError(errors)
  counters.groupSubscribeRenders++

  return (
    <>
      <output data-testid="group-is-valid">{String(!error)}</output>
      <output data-testid="group-field-name">group.field0</output>
      <output data-testid="group-error-count">{getErrorCount(error)}</output>
    </>
  )
}

function getErrorCount(error: FieldError | undefined): number {
  if (!error) {
    return 0
  }

  return error.types ? Object.keys(error.types).length : 1
}

function getGroupFieldError(
  errors: FieldErrors<GroupFormValues>,
): FieldError | undefined {
  return errors.group?.field0
}
