import { devtools } from '../devtoolsBridge.lib'
import type {
  AnyFieldApiOptions,
  AnyInternalFieldApi,
  FieldOptionsScope,
} from './FieldApi.lib'
import type { InternalRootFieldApi } from './RootFieldApi.lib'
import type { AnyInternalFormApi } from '../FormApi/FormApi.lib'
import type { NameSegments } from '../utils.lib'

const stop = Symbol('stop field traversal')
type FieldTraversalStop = typeof stop

type FieldVisitor = (
  field: AnyInternalFieldApi,
  stop: FieldTraversalStop,
) => void | FieldTraversalStop

/**
 * @private
 * Get a field api at the specified location. If it doesn't exist,
 * it will create the necessary nodes to get it.
 *
 * @important This mutates the segments array.
 */
export function getOrCreateFieldApi(
  node: AnyInternalFieldApi | InternalRootFieldApi,
  segments: NameSegments,
  form: AnyInternalFormApi,
  options?: Omit<AnyFieldApiOptions, 'name'>,
  scope: FieldOptionsScope = 'field',
): AnyInternalFieldApi {
  const segment = segments.shift()
  if (segment === undefined) {
    // If trieNode is the root, we need to return a field node, not the root
    if (node._isRoot) {
      throw new Error('Root node cannot be a field API')
    }
    // Internal trie nodes defer their options until they are first requested as
    // a configured field. Adapter updates handle subsequent option changes.
    if (scope !== 'internal' && !node._fieldOptionsInitialized) {
      node._update(options ?? {}, scope)
    }
    return node
  }

  let childNode = node._getChild(segment)
  if (childNode) {
    return getOrCreateFieldApi(childNode, segments, form, options, scope)
  }

  childNode = new form._FieldApi(
    {
      segment,
      parent: node,
      form: form,
    },
    'internal',
  )

  node._setChild(childNode)
  if (segments.length === 0) {
    const field = getOrCreateFieldApi(childNode, segments, form, options, scope)
    devtools().fieldAdded?.(childNode)
    return field
  }

  devtools().fieldAdded?.(childNode)

  return getOrCreateFieldApi(childNode, segments, form, options, scope)
}

/**
 * @private
 *
 * @important This mutates the segments array.
 */
export function tryGetFieldApi(
  trieNode: AnyInternalFieldApi | InternalRootFieldApi,
  segments: NameSegments,
): AnyInternalFieldApi | null {
  const segment = segments.shift()
  if (segment === undefined) {
    // If trieNode is the root, we cannot return it as a field API
    if (!trieNode._isRoot) {
      return trieNode
    }
    return null
  }

  const childNode = trieNode._getChild(segment)
  if (childNode) {
    return tryGetFieldApi(childNode, segments)
  } else {
    return null
  }
}

/**
 * Visits a field node followed by each of its ancestors, stopping before the
 * synthetic root node. Return the visitor's `stop` argument to stop the
 * traversal.
 *
 * The next parent is captured before the visitor runs, so removing or
 * reparenting the current node does not change the ancestor chain being walked.
 */
export function visitFieldAndAncestors(
  field: AnyInternalFieldApi,
  visitor: FieldVisitor,
): void {
  let current: AnyInternalFieldApi | InternalRootFieldApi = field

  while (!current._isRoot) {
    const parent: AnyInternalFieldApi | InternalRootFieldApi = current._parent
    if (visitor(current, stop) === stop) return
    current = parent
  }
}

/**
 * Shared iterative trie walker for one or more starting field nodes. Starting
 * nodes and every child collection are visited in insertion order. Children
 * are pushed in reverse so the stack yields preorder without recursion.
 */
function visitFields(
  fields: ReadonlyArray<AnyInternalFieldApi>,
  visitor: FieldVisitor,
): void {
  const stack: Array<AnyInternalFieldApi> = []
  for (let index = fields.length - 1; index >= 0; index--) {
    stack.push(fields[index]!)
  }

  while (stack.length > 0) {
    const field = stack.pop()!
    if (visitor(field, stop) === stop) return

    const children = field._children
    for (let index = children.length - 1; index >= 0; index--) {
      stack.push(children[index]!)
    }
  }
}

/**
 * Visits a field node and its descendants in insertion-order preorder. The
 * starting field is included unless it is the synthetic root. Return the
 * visitor's `stop` argument to stop the entire traversal, not only the current
 * branch.
 *
 * A node's children are read after its visitor runs, so structural mutations
 * made by the visitor affect which descendants are visited.
 */
export function visitFieldSubtree(
  field: AnyInternalFieldApi | InternalRootFieldApi,
  visitor: FieldVisitor,
): void {
  if (field._isRoot) {
    visitFields(field._children, visitor)
  } else {
    visitFields([field], visitor)
  }
}

/**
 * Visits every field in a form trie in insertion-order preorder. The synthetic
 * root node is excluded; traversal starts at each of its field children. Return
 * the visitor's `stop` argument to stop the entire traversal.
 *
 * A node's children are read after its visitor runs, so structural mutations
 * made by the visitor affect which descendants are visited.
 */
export function visitAllFormFields(
  root: InternalRootFieldApi,
  visitor: FieldVisitor,
): void {
  visitFieldSubtree(root, visitor)
}

/**
 * Collects a field node and all of its descendants in insertion-order
 * preorder. Use this when an operation needs a stable array of node references
 * before it starts mutating the trie; use `visitFieldSubtree` when no snapshot
 * allocation is required.
 */
export function collectFieldSubtree(
  field: AnyInternalFieldApi,
): Array<AnyInternalFieldApi> {
  const fields: Array<AnyInternalFieldApi> = []
  visitFieldSubtree(field, (current) => {
    fields.push(current)
  })
  return fields
}
