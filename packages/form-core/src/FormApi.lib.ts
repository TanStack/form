import { batch, createAtom, shallow } from '@tanstack/store'
import {
  getOrCreateFieldApi,
  nameToFieldNodeSegments,
  tryGetFieldApi,
} from './FieldApi.lib'
import { evaluate, getBy, mapDelete, setBy } from './utils'
import { InternalRootFieldApi } from './RootFieldApi.lib'
import { createValidatorPipelineCache } from './validation.lib'
import type { ValidatorPipelineCache } from './validation.lib'
import type { InternalFieldApi } from './FieldApi.lib'
import type {
  FieldApiOverrideOptions,
  InternalFieldUpdateOptions,
} from './types.lib'
import type { Atom, ReadonlyAtom } from '@tanstack/store'
import type { FormApi, FormOptions, FormState } from './FormApi.public'
import type { BaseFieldMeta, FieldApi } from './FieldApi.public'
import type { Updater } from './types.public'
import type { FormValidator } from './validation.public'

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
  fieldMetaAtom: Atom<
    ReadonlyMap<FieldApi<TFormData, TFormValidators>, BaseFieldMeta>
  >
  _formMetaAtom: Atom<BaseFormMeta>
  _fieldRootNode: InternalRootFieldApi<TFormData>
  _options: FormOptions<TFormData, TFormValidators>
  _validatorPipelineCache: ValidatorPipelineCache
  declare readonly state: FormState<TFormData>
  declare readonly options: FormOptions<TFormData, TFormValidators>

  constructor(options: FormOptions<TFormData, TFormValidators>) {
    this._options = options
    this.valuesAtom = createAtom(options.defaultValues)
    this.fieldMetaAtom = createAtom<
      ReadonlyMap<FieldApi<TFormData, TFormValidators>, BaseFieldMeta>
    >(new Map())
    this._validatorPipelineCache = createValidatorPipelineCache()
    this._formMetaAtom = createAtom({
      touchedFields: new Set(),
      isDirty: false,
      // Autocomplete seems to misbehave unless we do it like this
    } satisfies BaseFormMeta as BaseFormMeta)
    this._fieldRootNode = new InternalRootFieldApi(this)

    this.store = createAtom(
      () => {
        const values = this.valuesAtom.get()
        const baseFormMeta = this._formMetaAtom.get()

        const isDirty = baseFormMeta.isDirty
        const isPristine = !isDirty
        const isTouched = baseFormMeta.touchedFields.size > 0

        return {
          values,
          isTouched,
          isDirty,
          isPristine,
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
        '<form>.pushValue: This method can only be used on array fields',
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

    const fieldA = tryGetFieldApi(
      this._fieldRootNode,
      nameToFieldNodeSegments(`${arrayFieldName}[${indexA}]`),
    )

    const fieldB = tryGetFieldApi(
      this._fieldRootNode,
      nameToFieldNodeSegments(`${arrayFieldName}[${indexB}]`),
    )

    // Fields aren't necessarily mounted, so we should assume
    // that the indeces will represent actual values in the array.
    // If not, then the user will most likely not iterate over them
    // during rendering, so we don't need to worry about them.

    if (fieldA) {
      fieldA._segment = indexB
    }

    if (fieldB) {
      fieldB._segment = indexA
    }
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
  ): InternalFieldApi<TFormData, TFormValidators> => {
    return getOrCreateFieldApi(
      this._fieldRootNode,
      nameToFieldNodeSegments(nameOrSegments),
      this,
    )
  }

  _deleteMeta = (
    fieldNode: InternalFieldApi<TFormData, TFormValidators>,
  ): void => {
    this.fieldMetaAtom.set(mapDelete(fieldNode))
  }
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
