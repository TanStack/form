import { useFormStateArray } from '../contexts/eventClientContext'

export default function Content() {
  const formStateArray = useFormStateArray()

  return (
    <div>
      <div>form devtools</div>

      {formStateArray().map((form) => (
        <div>{JSON.stringify(form)}</div>
      ))}
    </div>
  )
}
