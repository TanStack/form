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
import type {
  AnyFieldApiOptions,
  AnyInternalFieldApi,
  InternalBaseFieldMeta,
  InternalFieldApi,
} from './FieldApi.lib'
import type {
  FieldApiOverrideOptions,
  InternalFieldUpdateOptions,
  PropagateOptions,
} from './types.lib'
import type { Atom, ReadonlyAtom } from '@tanstack/store'
import type { FormApi, FormOptions, FormState } from './FormApi.public'
import type { FieldUpdateOptions, Updater } from './types.public'
import type {
  FormValidateResult,
  FormValidationError,
  FormValidator,
  ValidationTrigger,
} from './validation.public'

export interface BaseFormMeta {
  /**
   * @private
   * Fields that have been touched.
   */
  touchedFields: Set<AnyInternalFieldApi>
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
  fieldErrors: Array<Set<AnyInternalFieldApi>>
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

export type AnyInternalFormApi = InternalFormApi<any, any>

export class InternalFormApi<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
> implements FormApi<TFormData, TFormValidators> {
  valuesAtom: Atom<TFormData>
  store: ReadonlyAtom<FormState<TFormData>>
  _formMetaAtom: Atom<BaseFormMeta>
  _fieldRootNode: InternalRootFieldApi
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

      this._notifyFieldChange(
        field,
        { ...options, doPropagate: true },
        'change',
      )
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
  ): void => {
    if (this._isInvalidArrayMethod('pushFieldValue', arrayFieldName)) {
      return
    }

    this.setFieldValue(
      arrayFieldName,
      (prev: Array<any>) => {
        return [...prev, value]
      },
      options,
    )
  }

  insertFieldValue = (
    arrayFieldName: string,
    index: number,
    value: any,
    options?: InternalFieldUpdateOptions,
  ): void => {
    if (
      this._isInvalidArrayMethod('insertFieldValue', arrayFieldName, {
        bounds: [index],
        allowEndIndex: true,
      })
    ) {
      return
    }

    batch(() => {
      this.setFieldValue(
        arrayFieldName,
        (prev: Array<any>) => {
          const array = prev.slice()
          array.splice(index, 0, value)
          return array
        },
        options,
      )

      const arrayField =
        options?.fieldApiOverride ??
        tryGetFieldApi(
          this._fieldRootNode,
          nameToFieldNodeSegments(arrayFieldName),
        )

      if (!arrayField) return

      // Shift existing children to the right of the insertion index
      for (const child of arrayField._children) {
        if (typeof child._segment === 'string') continue
        if (child._segment >= index) {
          child._moveTo(child._segment + 1)
        }
      }
    })
  }

  removeFieldValue = (
    arrayFieldName: string,
    index: number,
    options?: InternalFieldUpdateOptions,
  ): void => {
    if (
      this._isInvalidArrayMethod('removeFieldValue', arrayFieldName, {
        bounds: [index],
        allowEndIndex: false,
      })
    ) {
      return
    }

    batch(() => {
      this.setFieldValue(
        arrayFieldName,
        (prev: Array<any>) => {
          const array = prev.slice()
          array.splice(index, 1)
          return array
        },
        options,
      )

      const arrayField =
        options?.fieldApiOverride ??
        tryGetFieldApi(
          this._fieldRootNode,
          nameToFieldNodeSegments(arrayFieldName),
        )

      if (!arrayField) return

      const childToRemove = tryGetFieldApi(arrayField, [index])
      childToRemove?._kill()

      for (const child of arrayField._children) {
        if (typeof child._segment === 'string') continue
        if (child._segment > index) {
          child._moveTo(child._segment - 1)
        }
      }
    })
  }

  swapFieldValues = (
    arrayFieldName: string,
    indexA: number,
    indexB: number,
    options?: FieldApiOverrideOptions,
  ) => {
    if (
      this._isInvalidArrayMethod('swapFieldValues', arrayFieldName, {
        bounds: [indexA, indexB],
        allowEndIndex: false,
      })
    ) {
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

      const arrayField =
        options?.fieldApiOverride ??
        tryGetFieldApi(
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

  clearFieldValues = (
    arrayFieldName: string,
    options?: InternalFieldUpdateOptions,
  ) => {
    if (this._isInvalidArrayMethod('clearFieldValues', arrayFieldName)) {
      return
    }

    batch(() => {
      this.setFieldValue(arrayFieldName, () => [], options)

      const arrayField =
        options?.fieldApiOverride ??
        tryGetFieldApi(
          this._fieldRootNode,
          nameToFieldNodeSegments(arrayFieldName),
        )

      if (!arrayField) return

      arrayField._setMeta((prev) => ({
        ...prev,
        _arrayVersion: prev._arrayVersion + 1,
      }))

      // Kill all child fields since the array is now empty
      // _kill() will remove each child from the parent's children
      for (const child of [...arrayField._children]) {
        child._kill()
      }
    })
  }

  filterFieldValues = (
    arrayFieldName: string,
    predicate: (value: any, index: number, array: Array<any>) => boolean,
    options?: InternalFieldUpdateOptions & { thisArg?: any },
  ) => {
    if (this._isInvalidArrayMethod('filterFieldValues', arrayFieldName)) {
      return
    }

    const oldArray: Array<any> = this.getFieldValue(arrayFieldName)
    const arrayNode =
      options?.fieldApiOverride ?? this._tryGetFieldApi(arrayFieldName)

    let length = 0
    const thisArg = options?.thisArg
    const filtered = oldArray.filter((value, index, array) => {
      const keep = predicate.call(thisArg, value, index, array)
      if (!arrayNode) return keep

      const childAtIndex = arrayNode._getChild(index)
      if (keep) {
        childAtIndex?._moveTo(length)
        length++
      } else {
        childAtIndex?._kill()
      }
      return keep
    })

    if (oldArray.length === filtered.length) {
      // Setting filtered array would be a no-op, but either way the user
      // tried to set a value
      this._notifyFieldChange(
        arrayNode,
        { ...options, doPropagate: true },
        'change',
      )
    } else {
      this.setFieldValue(arrayFieldName, filtered, options)
    }
  }

  _notifyFieldChange = (
    field: AnyInternalFieldApi | null,
    options: FieldUpdateOptions & PropagateOptions,
    event: 'change' | 'blur' | 'submit',
  ) => {
    const { markAsDirty = true } = options
    if (
      event === 'change' &&
      markAsDirty &&
      !this._formMetaAtom.get().isDirty
    ) {
      this._formMetaAtom.set((prev) => ({ ...prev, isDirty: true }))
    }

    field?._notifyChange(options, event)
  }

  _isInvalidArrayMethod = (
    methodName: string,
    arrayFieldName: string,
    args: {
      bounds: Array<number>
      allowEndIndex: boolean
    } = { bounds: [], allowEndIndex: false },
  ): boolean => {
    const { bounds, allowEndIndex } = args

    const array = this.getFieldValue(arrayFieldName)
    if (!Array.isArray(array)) {
      console.warn(
        `<form>.${methodName}: This method can only be used on array fields, but '${arrayFieldName}' is: `,
        array,
      )
      return true
    }
    const maxIndex = allowEndIndex ? array.length : array.length - 1
    for (const index of bounds) {
      if (index < 0 || index > maxIndex) {
        console.warn(
          `<form>.${methodName}: ${index} is out of bounds for '${arrayFieldName}', expected 0 - ${maxIndex}.`,
        )
        return true
      }
    }
    return false
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
    options: Omit<AnyFieldApiOptions, 'form'>,
  ): InternalFieldApi<TFormData, TFormValidators> => {
    return getOrCreateFieldApi(
      this._fieldRootNode,
      nameToFieldNodeSegments(options.name),
      this,
      options,
    )
  }

  _clearFieldValidatorError = (
    field: AnyInternalFieldApi,
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
        const newFieldRefs = new Set<AnyInternalFieldApi>()
        const oldFieldRefs = fieldErrors[validatorIndex]

        // Set new field errors and build the new reference set
        for (const [fieldName, fieldError] of Object.entries(
          aggregateError.fieldErrors,
        )) {
          const field = this._getOrCreateFieldApi({ name: fieldName })
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
    signal: ValidationTrigger,
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
        triggerFieldApi: opts?.fieldApiOverride,
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
