import { useMemo, useRef } from 'react'
import { FastField, FieldArray, Formik, getIn, useFormikContext } from 'formik'
import { VALID_VALUE, fieldName, targetIndex } from '../scenario-contracts'
import {
  INSERTED_ITEM,
  createFieldValues,
  createItems,
} from './react-scenario-runner'
import type { FieldArrayRenderProps, FieldProps, FormikErrors } from 'formik'
import type { ReactNode } from 'react'
import type { ArrayOperation, ScenarioCounters } from './react-scenario-runner'

type TextFormValues = Record<string, string>

interface ArrayItem {
  id: string
  name: string
}

interface ArrayFormValues {
  items: Array<ArrayItem>
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
  const initialValues = useMemo(() => createFieldValues(count), [count])

  return (
    <BenchmarkFormik initialValues={initialValues}>
      {Array.from({ length: count }, (_, index) => (
        <TextInput counters={counters} index={index} key={index} />
      ))}
    </BenchmarkFormik>
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
  const initialValues = useMemo(
    () => ({
      ...createFieldValues(count),
      [targetName]: VALID_VALUE,
    }),
    [count, targetName],
  )

  return (
    <BenchmarkFormik initialValues={initialValues} validateOnChange>
      {Array.from({ length: count }, (_, index) =>
        index === target ? (
          <ValidatedTextInput counters={counters} index={index} key={index} />
        ) : (
          <TextInput counters={counters} index={index} key={index} />
        ),
      )}
    </BenchmarkFormik>
  )
}

export function DependentFieldsForm({
  count,
  counters,
}: {
  count: number
  counters: ScenarioCounters
}) {
  const initialValues = useMemo(() => createFieldValues(count), [count])

  return (
    <BenchmarkFormik initialValues={initialValues}>
      <DependentFieldListener counters={counters} />
      {Array.from({ length: count }, (_, index) => (
        <TextInput counters={counters} index={index} key={index} />
      ))}
      <output data-testid="listener-runs">{counters.listenerRuns}</output>
    </BenchmarkFormik>
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
  const initialValues = useMemo(
    () => ({
      items: createItems(count),
    }),
    [count],
  )

  return (
    <BenchmarkFormik initialValues={initialValues}>
      <FieldArray name="items" validateOnChange={false}>
        {(array) => (
          <ArrayFields
            array={array}
            counters={counters}
            operation={operation}
          />
        )}
      </FieldArray>
    </BenchmarkFormik>
  )
}

export function FormGroupScenario({
  count,
  counters,
}: {
  count: number
  counters: ScenarioCounters
}) {
  const initialValues = useMemo(() => {
    const group = createFieldValues(count)
    group.field0 = VALID_VALUE
    return { group }
  }, [count])

  return (
    <BenchmarkFormik initialValues={initialValues} validateOnChange>
      <GroupValidationOutputs counters={counters} />
      {Array.from({ length: count }, (_, index) => (
        <GroupInput counters={counters} index={index} key={index} />
      ))}
    </BenchmarkFormik>
  )
}

function BenchmarkFormik<TValues extends object>({
  children,
  initialValues,
  validateOnChange = false,
}: {
  children: ReactNode
  initialValues: TValues
  validateOnChange?: boolean
}) {
  return (
    <Formik<TValues>
      initialValues={initialValues}
      onSubmit={() => {}}
      validateOnBlur={false}
      validateOnChange={validateOnChange}
    >
      {() => <>{children}</>}
    </Formik>
  )
}

function TextInput({
  counters,
  index,
}: {
  counters: ScenarioCounters
  index: number
}) {
  const name = fieldName(index)

  return (
    <FastField name={name}>
      {({ field }: FieldProps<string, TextFormValues>) => {
        counters.fieldRenders++
        return <input data-bench-field="text" data-index={index} {...field} />
      }}
    </FastField>
  )
}

function ValidatedTextInput({
  counters,
  index,
}: {
  counters: ScenarioCounters
  index: number
}) {
  const name = fieldName(index)

  return (
    <>
      <FastField name={name} validate={validateTextField(counters)}>
        {({ field }: FieldProps<string, TextFormValues>) => {
          counters.fieldRenders++
          return <input data-bench-field="text" data-index={index} {...field} />
        }}
      </FastField>
      <TargetErrorCount name={name} />
    </>
  )
}

function TargetErrorCount({ name }: { name: string }) {
  const { errors } = useFormikContext<TextFormValues>()

  return (
    <output data-testid="target-error-count">
      {getErrorCount(getIn(errors, name))}
    </output>
  )
}

function DependentFieldListener({ counters }: { counters: ScenarioCounters }) {
  const { values } = useFormikContext<TextFormValues>()
  const value = values[fieldName(0)]
  const previousValue = useRef(value)

  if (previousValue.current !== value) {
    previousValue.current = value
    counters.listenerRuns++
  }

  return null
}

function ArrayFields({
  array,
  counters,
  operation,
}: {
  array: FieldArrayRenderProps
  counters: ScenarioCounters
  operation: ArrayOperation
}) {
  const items = (array.form.values as ArrayFormValues).items
  counters.arrayRenders++

  return (
    <>
      <output data-testid="array-length">{items.length}</output>
      {operation === 'swap' ? (
        <button
          data-testid="array-swap"
          type="button"
          onClick={() => array.swap(0, items.length - 1)}
        >
          Swap
        </button>
      ) : null}
      {operation === 'move' ? (
        <button
          data-testid="array-move"
          type="button"
          onClick={() => array.move(0, items.length - 1)}
        >
          Move
        </button>
      ) : null}
      {operation === 'insert-remove' ? (
        <>
          <button
            data-testid="array-insert"
            type="button"
            onClick={() => array.insert(1, INSERTED_ITEM)}
          >
            Insert
          </button>
          <button
            data-testid="array-remove-inserted"
            type="button"
            onClick={() => array.remove(1)}
          >
            Remove inserted
          </button>
        </>
      ) : null}
      {items.map((item, index) => (
        <ArrayInput counters={counters} index={index} key={item.id} />
      ))}
    </>
  )
}

function ArrayInput({
  counters,
  index,
}: {
  counters: ScenarioCounters
  index: number
}) {
  return (
    <FastField name={`items[${index}].name`}>
      {({ field }: FieldProps<string, ArrayFormValues>) => {
        counters.fieldRenders++
        return (
          <input data-bench-field="array-item" data-index={index} {...field} />
        )
      }}
    </FastField>
  )
}

function GroupInput({
  counters,
  index,
}: {
  counters: ScenarioCounters
  index: number
}) {
  const name = `group.${fieldName(index)}`

  return (
    <FastField
      name={name}
      validate={index === 0 ? validateGroupField(counters) : undefined}
    >
      {({ field }: FieldProps<string, GroupFormValues>) => {
        counters.fieldRenders++
        return (
          <input data-bench-field="group-text" data-index={index} {...field} />
        )
      }}
    </FastField>
  )
}

function GroupValidationOutputs({ counters }: { counters: ScenarioCounters }) {
  const { errors } = useFormikContext<GroupFormValues>()
  const error = getIn(errors, 'group.field0')
  counters.groupSubscribeRenders++

  return (
    <>
      <output data-testid="group-is-valid">{String(!error)}</output>
      <output data-testid="group-field-name">group.field0</output>
      <output data-testid="group-error-count">{getErrorCount(error)}</output>
    </>
  )
}

function validateTextField(counters: ScenarioCounters) {
  return (value: string) => {
    const errors: Array<string> = []

    counters.validatorRuns++
    if (value.length < 3) {
      errors.push('Value is too short')
    }

    counters.validatorRuns++
    if (value.includes('x')) {
      errors.push('Value cannot include x')
    }

    return errors.length > 0 ? errors.join('\n') : undefined
  }
}

function validateGroupField(counters: ScenarioCounters) {
  return (value: string) => {
    counters.formGroupValidatorRuns++
    return value.length >= 3 ? undefined : 'Group field is too short'
  }
}

function getErrorCount(error: FormikErrors<unknown> | string | undefined) {
  if (!error) {
    return 0
  }

  if (typeof error === 'string') {
    return error.split('\n').length
  }

  return Object.keys(error).length
}
