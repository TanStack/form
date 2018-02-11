import Node from './Node'
import Utils from '../utils'

class Tree {

  constructor (root) {
    this.root = new Node(root)
  }

  add (target, node) {
    // Initialize the parent to the target
    let parent = target
    // Step 1: Break the nodes field into parts
    const path = Utils.makePathArray(node.field)
    // Step 2: Go down the tree
    while (path.length) {
      let cur = parent.children[path[0]]
      if (!cur) {
        // Currnet doesn't exist so we need to create one
        // Note, if path is equal to one we need to add the node passed
        cur = path.length === 1 ? new Node({ parent, ...node }) : new Node({ parent, field: path })
        // Add cur to the parents children
        parent.children[path[0]] = cur
        // Update parent to current
        parent = cur
      }
      path.shift()
    }
  }

  delete (target, node) {
    delete target.children[node.field]
  }

}

export default Tree
