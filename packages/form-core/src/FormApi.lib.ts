import { batch, createAtom, shallow } from '@tanstack/store'
import {
  getOrCreateFieldApi,
  nameToFieldNodeSegments,
  tryGetFieldApi,
} from './FieldApi.lib'
import { evaluate, getBy, normalizeToArray, setBy } from './utils'
import { InternalRootFieldApi } from './RootFieldApi.lib'
import {
  createValidatorPipelineCache,
  isAggregateError,
  isErrorResult,
  runFormValidatorPipeline,
} from './validation.lib'

import type { PipelineResult, ValidatorPipelineCache } from './validation.lib'
import type { InternalBaseFieldMeta, InternalFieldApi } from './FieldApi.lib'
import type {
  FieldApiOverrideOptions,
  InternalFieldUpdateOptions,
} from './types.lib'
import type { Atom, ReadonlyAtom } from '@tanstack/store'
import type { FormApi, FormOptions, FormState } from './FormApi.public'
import type { Updater } from './types.public'
import type {
  FieldValidator,
  FormValidateResult,
  FormValidationError,
  FormValidator,
  ValidationEvent,
} from './validation.public'

export interface BaseFormMeta {
  /**
   * @private
   * Fields that have been touched.
   */
  touchedFields: Set<InternalFieldApi<any, any>>
  /**
   * @private
   * A field has notified the root to be dirty
   */
  isDirty: boolean
  /**
   * @private
   * Dense 2-dimensional array of form-level errors where index corresponds to validatorIndex.
   * Each validator index contains an array of errors (normalized).
   */
  errors: Array<Array<FormValidationError>>
  /**
   * @private
   * Dense array of field references per validator index that have errors.
   * Used to clear stale field errors when a validator no longer reports them.
   */
  fieldErrors: Array<Set<InternalFieldApi<any, any>>>
}

// StandardSchema<Input, Output>
// defaultValues === Input

// <unknown, Output>
//      z.infer ^

// z.enum(['A', 'B']) = <'A' | 'B', 'A' | 'B'>
// defaultValues: { choice: null }
// -> defaultValues should implement the schema, but not be the same as its input

// z.enum(['A', 'B']).nullable().transform(v => v !== null)
// defaultValues: { choice: null }
// -> defaultValues and schema are inferred and then compared (v1)
// -> schema type should dictate it all -> defaultValues === z.input<typeof mySchema>

// Proposal:
//   - onSubmit should have access to the schema results
//   - validation pipeline: see RFC

// Async defaultValues =>
// initial: A === { name: '', foo: null }
// async: B === { name: 'Foo', foo: { bar: 'bar' } }

// form.update(B) => A !== B -> Queue async update
// v1: !form.isTouched -> Apply state
// v2?: Apply state -> Traverse fieldsMap values, if fieldApi is not touched, setFieldValue of the field path

// form.isTouched: if fieldApi is being touched, make check. If isTouched on form is false, set it to true
// form.isPristine: same process
// form.isValidating: if fieldApi or formApi is validating, increment counter. Boolean is counter > 0
// form.isDefaultValue: ??? --> probably keep old system, but benchmark it

/**
    form state:

    isFieldsTouched <> isTouched  ---- is there a **mounted** field that is touched?
    isFieldsValidating            ---- is there a mounted field that is validating?
    isDirty                       ---- NOT is there a moutned field that is dirty -> field state for value is derived from form
                                  ---- has a field handled a change since last reset?
    isFieldsValid                 ---- is there a field with errors (depends on our errorMap implementation)



    field-level errors

    axiom: field meta travels with the field, such as swapValues etc. etc.

    from a UX perspective, field-level errors are set as a name -> 'foo[0]' is wrong

    (BUT if you swap the field, the 'false value' probably moved with it)


    fieldMetaAtom: Map<FieldApi, Meta> -> fieldMetaAtom.values().some(v => )

    rootNodeInfo:

    -> Should errors move with the field, or should they remain at the name
 */

export class InternalFormApi<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
> implements FormApi<TFormData, TFormValidators> {
  valuesAtom: Atom<TFormData>
  store: ReadonlyAtom<FormState<TFormData>>
  _formMetaAtom: Atom<BaseFormMeta>
  _fieldRootNode: InternalRootFieldApi<TFormData>
  _options: FormOptions<TFormData, TFormValidators>
  _validatorPipelineCache: ValidatorPipelineCache
  declare readonly state: FormState<TFormData>
  declare readonly options: FormOptions<TFormData, TFormValidators>

  constructor(options: FormOptions<TFormData, TFormValidators>) {
    this._options = options
    this.valuesAtom = createAtom(options.defaultValues)
    this._validatorPipelineCache = createValidatorPipelineCache()
    const validatorCount = this._options.validators?.length ?? 0
    this._formMetaAtom = createAtom({
      touchedFields: new Set(),
      isDirty: false,
      errors: Array.from({ length: validatorCount }, () => []),
      fieldErrors: Array.from({ length: validatorCount }, () => new Set()),
    } satisfies BaseFormMeta as BaseFormMeta)
    this._fieldRootNode = new InternalRootFieldApi(this)

    this.store = createAtom(
      () => {
        const values = this.valuesAtom.get()
        const baseFormMeta = this._formMetaAtom.get()

        const isDirty = baseFormMeta.isDirty
        const isPristine = !isDirty
        const isTouched = baseFormMeta.touchedFields.size > 0
        const formErrors = baseFormMeta.errors.flat()

        return {
          values,
          isTouched,
          isDirty,
          isPristine,
          formErrors,
        } satisfies FormState<TFormData>
      },
      { compare: shallow },
    )

    Object.defineProperty(this, 'state', {
      get: (): FormState<TFormData> => this.store.get(),
      enumerable: true,
    })

    Object.defineProperty(this, 'options', {
      get: (): FormOptions<TFormData, TFormValidators> => this._options,
      enumerable: true,
    })
  }

  _update = (options: FormOptions<TFormData, TFormValidators>) => {
    const oldOptions = this.options
    this._options = options

    if (
      (options.validators?.length ?? 0) !== (oldOptions.validators?.length ?? 0)
    ) {
      console.warn(
        'TanStack Form: The length of the validator array should not change after initialization',
      )
    }

    if (!evaluate(options.defaultValues, oldOptions.defaultValues)) {
      if (!this.state.isTouched) {
        this.valuesAtom.set(options.defaultValues)
      }
    }

    // TODO plans
    // form.update(B) => A !== B -> Queue async update
    // v1: !form.isTouched -> Apply state
    // v2?: Apply state -> Traverse fieldsMap values, if fieldApi is not touched, setFieldValue of the field path
    //     Note: Probably should be a shallow check rather than deep, otherwise we'd have to traverse the entire defaultValues
  }

  getFieldValue = (fieldName: string): any => {
    return getBy(this.state.values, fieldName)
  }

  setFieldValue = (
    fieldName: string,
    updater: Updater<any>,
    options?: InternalFieldUpdateOptions,
  ) => {
    const field = options?.fieldApiOverride ?? this._tryGetFieldApi(fieldName)

    batch(() => {
      this.valuesAtom.set((prev) => setBy(prev, fieldName, updater))
      const markAsDirty = options?.markAsDirty ?? true

      if (markAsDirty && !this._formMetaAtom.get().isDirty) {
        this._formMetaAtom.set((prev) => ({ ...prev, isDirty: true }))
      }
      field?._notifyChange({ ...options, doPropagate: true })
    })
  }

  // TODO type safety: DeepKeys that extend undefined?
  deleteField = (fieldName: string, opts?: FieldApiOverrideOptions) => {
    const field = opts?.fieldApiOverride ?? this._tryGetFieldApi(fieldName)

    field?._kill()
  }

  pushFieldValue = (
    arrayFieldName: string,
    value: any,
    options?: InternalFieldUpdateOptions,
  ) => {
    const field =
      options?.fieldApiOverride ?? this._tryGetFieldApi(arrayFieldName)
    if (!field) return

    if (!Array.isArray(field.value)) {
      console.warn(
        '<form>.pushFieldValue: This method can only be used on array fields',
      )
      return
    }

    field._createChild(field.value.length)

    this.setFieldValue(
      arrayFieldName,
      (prev: Array<any>) => {
        return [...prev, value]
      },
      options,
    )
  }

  swapFieldValues = (
    arrayFieldName: string,
    indexA: number,
    indexB: number,
    options?: FieldApiOverrideOptions,
  ) => {
    const fieldValue = this.getFieldValue(arrayFieldName)
    if (!Array.isArray(fieldValue)) {
      console.warn(
        '<form>.swapFieldValues: This method can only be used on array fields',
      )
      return
    }

    if (indexA === indexB) {
      return
    }

    batch(() => {
      this.setFieldValue(
        arrayFieldName,
        (prev: Array<any>) => {
          const a = prev[indexA]
          const b = prev[indexB]
          const array = prev.slice()
          array[indexA] = b
          array[indexB] = a
          return array
        },
        options,
      )

      const arrayField = tryGetFieldApi(
        this._fieldRootNode,
        nameToFieldNodeSegments(arrayFieldName),
      )

      if (!arrayField) return

      // Since the length wasn't changed, we need to notify manually
      arrayField._setMeta((prev) => ({
        ...prev,
        _arrayVersion: prev._arrayVersion + 1,
      }))

      const fieldA = tryGetFieldApi(arrayField, [indexA])

      const fieldB = tryGetFieldApi(arrayField, [indexB])

      // Fields aren't necessarily mounted, so we should assume
      // that the indeces will represent actual values in the array.
      // If not, then the user will most likely not iterate over them
      // during rendering, so we don't need to worry about them.
      fieldA?._moveTo(indexB)
      fieldB?._moveTo(indexA)
    })
  }

  _tryGetFieldApi = (
    nameOrSegments: string | Array<string>,
  ): InternalFieldApi<TFormData, TFormValidators> | null => {
    return tryGetFieldApi(
      this._fieldRootNode,
      nameToFieldNodeSegments(nameOrSegments),
    )
  }

  _getOrCreateFieldApi = (
    nameOrSegments: string | Array<string>,
    validators: Array<FieldValidator<any, any>> | undefined,
  ): InternalFieldApi<TFormData, TFormValidators> => {
    return getOrCreateFieldApi(
      this._fieldRootNode,
      nameToFieldNodeSegments(nameOrSegments),
      this,
      validators,
    )
  }

  _clearFieldValidatorError = (
    field: InternalFieldApi<any, any>,
    validatorIndex: number,
  ) => {
    field._setMeta((prev) => {
      const formValidatorErrors = [...prev._formValidatorErrors]
      if (formValidatorErrors.length > validatorIndex) {
        const prevError = formValidatorErrors[validatorIndex]
        if (evaluate(prevError, [])) {
          return prev
        }
        formValidatorErrors[validatorIndex] = []
      }
      return {
        ...prev,
        _formValidatorErrors: formValidatorErrors,
      }
    })
  }

  _processValidationResult = (result: PipelineResult<FormValidateResult>) => {
    const aggregateError = isAggregateError(result.result)

    if (aggregateError) {
      this._processAggregateError(aggregateError, result.validatorIndex)
      return
    }

    batch(() => {
      this._formMetaAtom.set((prev) => {
        const errors = [...prev.errors]

        if (isErrorResult(result.result)) {
          const errorArray = normalizeToArray(result.result)
          errors[result.validatorIndex] = errorArray
        } else {
          errors[result.validatorIndex] = []
        }

        return { ...prev, errors }
      })

      // Clear field-level errors from potential previous { fields: {} } errors
      this._formMetaAtom.set((prev) => {
        const fieldErrors = [...prev.fieldErrors]
        const oldFieldRefs = fieldErrors[result.validatorIndex]

        if (oldFieldRefs) {
          for (const field of oldFieldRefs) {
            this._clearFieldValidatorError(field, result.validatorIndex)
          }
          fieldErrors[result.validatorIndex] = new Set()
        }

        return { ...prev, fieldErrors }
      })
    })
  }

  /**
   * Process a ValidationAggregateError by setting form-level and field-level errors.
   */
  _processAggregateError = (
    aggregateError: {
      formError: FormValidationError | null
      fieldErrors: Record<string, FormValidationError>
    },
    validatorIndex: number,
  ) => {
    batch(() => {
      // Handle form-level errors
      this._formMetaAtom.set((prev) => {
        const errors = [...prev.errors]
        if (aggregateError.formError) {
          errors[validatorIndex] = normalizeToArray(aggregateError.formError)
        } else {
          errors[validatorIndex] = []
        }
        return { ...prev, errors }
      })

      // Handle field-level errors
      this._formMetaAtom.set((prev) => {
        const fieldErrors = [...prev.fieldErrors]
        const newFieldRefs = new Set<InternalFieldApi<any, any>>()
        const oldFieldRefs = fieldErrors[validatorIndex]

        // Set new field errors and build the new reference set
        for (const [fieldName, fieldError] of Object.entries(
          aggregateError.fieldErrors,
        )) {
          const field = this._getOrCreateFieldApi(fieldName, undefined)
          field._setMeta((prev) => {
            const formErrors = [...prev._formValidatorErrors]
            // Ensure array is large enough for this validator index.
            // We can't eagerly assign them on field creation because the field meta
            // is lazily created. Therefore, the default is always an empty array.
            while (formErrors.length <= validatorIndex) {
              formErrors.push([])
            }
            const newError = normalizeToArray(fieldError)
            const prevError = formErrors[validatorIndex] ?? []
            // TODO does this tank performance for standard schemas?
            if (evaluate(prevError, newError as never)) {
              return prev
            }
            formErrors[validatorIndex] = newError as never
            return {
              ...prev,
              _formValidatorErrors: formErrors,
            } satisfies InternalBaseFieldMeta
          })
          newFieldRefs.add(field)
        }

        // Clear errors for fields that are no longer in the new result
        if (oldFieldRefs) {
          for (const field of oldFieldRefs) {
            if (!newFieldRefs.has(field)) {
              this._clearFieldValidatorError(field, validatorIndex)
            }
          }
        }

        fieldErrors[validatorIndex] = newFieldRefs

        return { ...prev, fieldErrors }
      })
    })
  }

  validate = async (
    signal: ValidationEvent,
    opts?: FieldApiOverrideOptions,
  ) => {
    const pipeline = this.options.validators
    if (!pipeline) return []
    if (pipeline.length === 0) return []

    const pipelineResults = await runFormValidatorPipeline({
      context: {
        event: signal,
        // TypeScript doesn't instantly complain, but instead decides to wait a while.
        // Just leave it as never.
        formApi: this as never,
        fieldApi: opts?.fieldApiOverride ?? null,
      },
      pipeline,
      onResult: (result) => this._processValidationResult(result),
    })

    return pipelineResults.map(({ result }) => result).filter(isErrorResult)
  }

  handleSubmit = () => this.validate('submit')
}

/*
  // TODO: Talk about user-land listeners moving after a shift or other array operation

  // CURRENT
  <form.Field name={`name[${idx}]`} validators={{
      onChangeListenTo: [`foo[${idx - 1}]`]
  }}/>

  <form.Field name="foo.bar.foobar" validators={{
    onChangeListenTo: ['foo'] // What if 'foo.bar' updates?
  }}

  // UPDATE LISTENERS DURING:
  // - TrieMoveOperation (swapValue, et al)
  // - on*ListenTo value changes

  class TrieNode {
    listenNodes: Set<TrieNode>;
  }

  class FormApi {
    onTrieMoveOperation() {
      // onListenToChanges will auto-run if the user is intentionally listening to the moved value
      //  because of the reactivity mechanism of the framework
      //  so we don't need to traverse the whole tree, only the moved operations
    }

    onListenToChanges(listenTrieNode, prevName, newName) {
      const prevTrieNode = this.getTrie(prevName);
      cost newTrieNode = this.getTrie(newName);
      // Node was moved but is referentially the same, no changes in internal listeners needed
      if (prevTrieNode === newTrieNode) return;
      listenTrieNode.listenNodes.remove(prevTrie);
      listenTrieNode.listenNodes.add(newTrieNode);
    }

    triggerNodeListeners(changedTrieNode) {
      // Traverse upwards from current trie node to inform
      changedTrieNode.traverseUp((currNode) => {
        if (currNode.contains(changedTrieNode)) {
          return; // Prevent accidental dependencies on itself/parents
        }
        currNode.listenNodes.triggerChange();
      })
    }
  }

  // TrieMoveOperation:
  // - Nodes that are being changed
  //    -> Child nodes might have stale

  // 'summary' -> 'users[1]' node
  // REFERENTIALLY

  // TrieMoveOperation
  // moved 'users[1]' -> 'users[0]'



  // on node change:
  // 1. Am I in the list?
  // 2. If so, send updates to each node
*/

//      node
//      /   \
//    nodeA  nodeB
//     /  \
//   nodeC nodeD
