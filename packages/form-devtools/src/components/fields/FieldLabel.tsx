interface FieldLabelProps {
  path: string
  leaf?: string
}
export function FieldLabel(props: FieldLabelProps) {
  if (props.leaf === undefined)
    return <span class="font-mono">{props.path}</span>
  return (
    <>
      <span class="font-mono text-muted-foreground">
        {props.path.slice(0, -1 * props.leaf.length)}
      </span>
      <span class="font-mono font-bold">{props.leaf}</span>
    </>
  )
}
