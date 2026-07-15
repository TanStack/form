import type { AnyInternalFieldApi } from './FieldApi.lib'
import type { InternalRootFieldApi } from './RootFieldApi.lib'

type FieldVisitor = (field: AnyInternalFieldApi) => void | false

/**
 * Visits a field node followed by each of its ancestors, stopping before the
 * synthetic root node. Return `false` from the visitor to stop the traversal.
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
    if (visitor(current) === false) return
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
    if (visitor(field) === false) return

    const children = field._children
    for (let index = children.length - 1; index >= 0; index--) {
      stack.push(children[index]!)
    }
  }
}

/**
 * Visits a field node and its descendants in insertion-order preorder. The
 * starting field is included. Return `false` from the visitor to stop the
 * entire traversal, not only the current branch.
 *
 * A node's children are read after its visitor runs, so structural mutations
 * made by the visitor affect which descendants are visited.
 */
export function visitFieldSubtree(
  field: AnyInternalFieldApi,
  visitor: FieldVisitor,
): void {
  visitFields([field], visitor)
}

/**
 * Visits every field in a form trie in insertion-order preorder. The synthetic
 * root node is excluded; traversal starts at each of its field children. Return
 * `false` from the visitor to stop the entire traversal.
 *
 * A node's children are read after its visitor runs, so structural mutations
 * made by the visitor affect which descendants are visited.
 */
export function visitAllFormFields(
  root: InternalRootFieldApi,
  visitor: FieldVisitor,
): void {
  visitFields(root._children, visitor)
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
