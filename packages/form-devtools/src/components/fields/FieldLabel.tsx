interface FieldLabelProps {
  path: string
  leaf?: string
}
export function FieldLabel(props: FieldLabelProps) {
  if (props.leaf === undefined) return props.path
  return (
    <>
      <span class="text-muted-foreground">
        {props.path.slice(0, -1 * props.leaf.length)}
      </span>
      {props.leaf}
    </>
  )
}
