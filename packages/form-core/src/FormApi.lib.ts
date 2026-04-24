import { createAtom } from '@tanstack/store'
import {
  InternalFieldApi,
  getOrCreateFieldApi,
  nameToFieldNodeSegments,
} from './FieldApi.lib'
import type { Atom } from '@tanstack/store'
import type { FormApi, FormOptions, FormState } from './FormApi.public'
import type { FieldMeta } from './FieldApi.public'

// Typeland: users[${number}].foo
// '[15]'

/*
const value = 12;

<form.Field name={`users[${value}]`}/>
*/

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
  baseAtom: Atom<FormState<TData>>
  fieldMetaAtom: Atom<Partial<Record<string, FieldMeta>>>
  store: Atom<any>
  _fieldRootNode: InternalFieldApi<TData>
  declare state: FormState<TData>

  constructor(options: FormOptions<TData>) {
    this.baseAtom = createAtom({
      values: options.defaultValues,
    })

    this.fieldMetaAtom = createAtom({})
    this.store = createAtom({})
    this._fieldRootNode = new InternalFieldApi({
      segment: '',
      parent: null,
      form: this,
    })

    Object.defineProperty(this, 'state', {
      get: (): FormState<TData> => this.store.get(),
      enumerable: true,
    })
  }

  _requestField = (name: string): InternalFieldApi<TData> => {
    const segments = nameToFieldNodeSegments(name)
    const fieldNode = getOrCreateFieldApi(this._fieldRootNode, segments, this)

    return fieldNode
  }
}

/*
  function useField(name: string) {
    const fieldApi = useMemo(() => {
      return form._requestField(name)
    }, [form, name])

    useEffect(() => {
      const cleanup = fieldApi.mount()
      return cleanup
    }, [fieldApi])
  }

 */

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
