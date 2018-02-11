class Node {

  constructor ({ api = {}, children = {}, field = null, parent = null, fullField = null }={}) {
    this.api = api
    this.children = children
    this.field = field
    this.parent = parent
    this.fullField = fullField
  }

}

export default Node
