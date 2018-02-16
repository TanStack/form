import Utils from '../utils'

const defaultNode = () => ({
  api: {
    preValidate: Utils.noop,
    validate: Utils.noop,
    asyncValidate: Utils.noop
  },
  children: {},
  getProps: () => ({})
})

export function makeNode (node = {}) {
  return {
    ...defaultNode(),
    ...node
  }
}

class Tree {
  constructor (rootNode) {
    this.root = makeNode(rootNode)
  }

  addNode (node) {
    let parent = this.root
    // Step 1: Break the nodes field into parts
    const path = Utils.makePathArray(node.fullField)
    // Step 2: Go down the tree
    while (path.length > 1) {
      // Ensure a linkage node is preset
      if (!parent.children[path[0]]) {
        parent.children[path[0]] = makeNode({
          nested: true,
          field: path[0],
          fullField: Utils.makePathArray([parent.fullField, path[0]]),
          parent
        })
      }

      // Child grows up, becomes the new parent
      parent = parent.children[path[0]]
      path.shift()
    }

    // Create the last node in the chain
    const newNode = makeNode({
      ...node,
      field: path[0],
      parent
    })
    parent.children[path[0]] = newNode
  }

  removeNode (node) {
    let parent = this.root
    // Step 1: Break the nodes field into parts
    const path = Utils.makePathArray(node.fullField)
    // Step 2: Go down the tree
    while (path.length > 1) {
      // Bail out if the child field doesn't exist
      if (!parent.children[path[0]]) {
        return
      }
      // Child grows up, becomes the new parent
      parent = parent.children[path[0]]
      path.shift()
    }

    // Create the last node in the chain
    delete parent.children[path[0]]
  }

  getNodeByField (field, { closest } = {}) {
    // Initialize the parent to the target
    let parent = this.root
    // Step 1: Break the nodes field into parts
    const path = Utils.makePathArray(field)
    // Step 2: Go down the tree
    while (path.length) {
      if (parent.children && parent.children[path[0]]) {
        parent = parent.children[path[0]]
      } else {
        return closest ? parent : null
      }
      path.shift()
    }
    return parent
  }
}

export default Tree
