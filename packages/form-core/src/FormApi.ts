import { createAtom } from '@tanstack/store'
import { FieldApi, defaultFieldMeta } from './FieldApi'
import { TrieNode, getOrCreateTrieNode, nameToTrieSegments } from './fieldTrie'
import type { Atom } from '@tanstack/store'
import type { FieldId, FieldMeta } from './FieldApi.types'

interface FormOptions {
  defaultValues: any
}

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

export class FormApi {
  baseAtom: Atom<any>
  store: Atom<any>
  fieldsTrie: TrieNode
  declare state: any

  constructor(options: FormOptions) {
    this.baseAtom = createAtom({})

    this.store = createAtom({})
    this.fieldsTrie = new TrieNode({ segment: '', parent: null, fieldId: null })

    Object.defineProperty(this, 'state', {
      get: () => this.store.get(),
      enumerable: true,
    })
  }

  _requestField = (name: string): TrieNode => {
    const segments = nameToTrieSegments(name)
    return getOrCreateTrieNode(this.fieldsTrie, segments)

    // swapFieldValues(0, 1)
    // users[1] => users[0] // REFERENCE STAYS THE SAME
    // render cycle
    // component requests users[0]
    // -> reference stayed the same
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
