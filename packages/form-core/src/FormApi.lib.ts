import { batch, createAtom, shallow } from '@tanstack/store'
import {
  InternalRootFieldApi,
  getOrCreateFieldApi,
  nameToFieldNodeSegments,
  tryGetFieldApi,
} from './FieldApi.lib'
import { evaluate, getBy, mapDelete, setBy } from './utils'
import type { InternalFieldApi } from './FieldApi.lib'
import type {
  FieldApiOverrideOptions,
  InternalFieldUpdateOptions,
} from './types.lib'
import type { Atom, ReadonlyAtom } from '@tanstack/store'
import type { FormApi, FormOptions, FormState } from './FormApi.public'
import type { BaseFieldMeta, FieldApi } from './FieldApi.public'
import type { Updater } from './types.public'

export interface BaseFormMeta {
  /**
   * Fields that have been touched.
   */
  touchedFields: Set<InternalFieldApi<any>>
}

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

export class InternalFormApi<TData> implements FormApi<TData> {
  valuesAtom: Atom<TData>
  store: ReadonlyAtom<FormState<TData>>
  fieldMetaAtom: Atom<ReadonlyMap<FieldApi<TData>, BaseFieldMeta>>
  _formMetaAtom: Atom<BaseFormMeta>
  _fieldRootNode: InternalRootFieldApi<TData>
  _options: FormOptions<TData>
  declare readonly state: FormState<TData>
  declare readonly options: FormOptions<TData>

  constructor(options: FormOptions<TData>) {
    this._options = options
    this.valuesAtom = createAtom(options.defaultValues)
    this.fieldMetaAtom = createAtom<
      ReadonlyMap<FieldApi<TData>, BaseFieldMeta>
    >(new Map())
    this._formMetaAtom = createAtom<BaseFormMeta>({
      touchedFields: new Set<InternalFieldApi<any>>(),
    })
    this._fieldRootNode = new InternalRootFieldApi(this)

    this.store = createAtom<FormState<TData>>(
      (prev) => {
        const values = this.valuesAtom.get()
        const baseFormMeta = this._formMetaAtom.get()
        const isTouched = baseFormMeta.touchedFields.size > 0

        if (!prev) {
          return { values, isTouched }
        }

        return {
          values,
          isTouched,
        }
      },
      { compare: shallow },
    )

    Object.defineProperty(this, 'state', {
      get: (): FormState<TData> => this.store.get(),
      enumerable: true,
    })

    Object.defineProperty(this, 'options', {
      get: (): FormOptions<TData> => this._options,
      enumerable: true,
    })
  }

  _update = (options: FormOptions<TData>) => {
    const oldOptions = this.options
    this._options = options

    if (evaluate(options.defaultValues, oldOptions.defaultValues)) {
    }
    // TODO plans
    // form.update(B) => A !== B -> Queue async update
    // v1: !form.isTouched -> Apply state
    // v2?: Apply state -> Traverse fieldsMap values, if fieldApi is not touched, setFieldValue of the field path
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

      field?._notifyChange({ ...options, doPropagate: true })
    })
  }

  deleteField(fieldName: string, opts?: FieldApiOverrideOptions) {
    const field = opts?.fieldApiOverride ?? this._tryGetFieldApi(fieldName)

    field?._kill()
  }

  pushFieldValue(
    arrayFieldName: string,
    value: any,
    options?: InternalFieldUpdateOptions,
  ) {
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

  swapFieldValues(
    arrayFieldName: string,
    indexA: number,
    indexB: number,
    options?: FieldApiOverrideOptions,
  ) {
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
  ): InternalFieldApi<TData> | null => {
    return tryGetFieldApi(
      this._fieldRootNode,
      nameToFieldNodeSegments(nameOrSegments),
    )
  }

  _getOrCreateFieldApi = (
    nameOrSegments: string | Array<string>,
  ): InternalFieldApi<TData> => {
    return getOrCreateFieldApi(
      this._fieldRootNode,
      nameToFieldNodeSegments(nameOrSegments),
      this,
    )
  }

  _deleteMeta = (fieldNode: InternalFieldApi<TData>) => {
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
