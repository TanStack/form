const fieldPathCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
})

export function compareFieldPaths(left: string, right: string): number {
  return fieldPathCollator.compare(left, right)
}
