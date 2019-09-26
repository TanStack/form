# Field Scoping

Field scoping is useful for building form inputs that don't require knowledge of the parent field name. Imagine a field component for managing some notes on a form:

```js
function NotesField({ field }) {
  const fieldInstance = useField(field)

  // ...
}
```

This approach would required us to define the nested `field` when we use the component:

```js
function MyForm() {
  const { Form } = useForm()

  return (
    <Form>
      <NotesField field="notes" />
    </Form>
  )
}
```

This isn't a problem for shallow forms, but if we are in a deeply nested part of a form UI, it get's more verbose:

```js
function MyForm() {
  const { Form } = useForm()

  return (
    <Form>
      <ConfigField field="config" />
    </Form>
  )
}

function ConfigField({ field: parentField }) {
  return (
    <>
      <NotesField field={`${parentField}.notes`} />
      <OtherField field={`${parentField}.other`} />
      <FooField field={`${parentField}.foo`} />
    </>
  )
}
```

Instead of requiring that all deep fields be composed with their parent strings, you can use the `FieldScope` component returned by the `useField` hook to create a new field scope for any `useField` instances rendered inside of it:

```js
function MyForm() {
  const { Form } = useForm()

  return (
    <Form>
      <ConfigField field="config" />
    </Form>
  )
}

function ConfigField({ field: parentField }) {
  const { FieldScope } = useField('config')
  return (
    <FieldScope>
      <NotesField field="notes" />
      <OtherField field="other" />
      <FooField field="foo" />
    </FieldScope>
  )
}
```
