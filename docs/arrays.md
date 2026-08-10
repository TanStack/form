---
id: arrays
title: Arrays
---

TanStack Form fields can hold arrays just like any other value. The important distinction is whether the array is the field value itself or whether you're rendering fields for the items inside it.

If one control reads and replaces the whole array, use a regular field. If you're rendering fields for individual items and need to add, remove, or reorder them, use an array field.

This guide covers both cases and how to choose between them.

## An array as the field value

Use a regular field when one control reads and replaces the complete array. A
multi-select, tag picker, or checkbox group can pass its next array to
`handleChange` like any other field value:

<!-- ::start:framework -->

# React

```tsx
<form.Field name="selectedRoleIds">
  {(field) => (
    <RolePicker
      value={field.value}
      onValueChange={(roleIds) => field.handleChange(roleIds)}
    />
  )}
</form.Field>
```

# Preact

```tsx
<form.Field name="selectedRoleIds">
  {(field) => (
    <RolePicker
      value={field.value}
      onValueChange={(roleIds) => field.handleChange(roleIds)}
    />
  )}
</form.Field>
```

# Solid

```tsx
<form.Field name="selectedRoleIds">
  {(field) => (
    <RolePicker
      value={field().value}
      onValueChange={(roleIds) => field().handleChange(roleIds)}
    />
  )}
</form.Field>
```

# Angular

```html
<ng-container [tanstackField]="form" name="selectedRoleIds" #field="field">
  <app-role-picker
    [value]="field.api.value"
    (valueChange)="field.api.handleChange($event)"
  />
</ng-container>
```

# Lit

```ts
this.form.field(
  { name: 'selectedRoleIds' },
  (field) => html`
    <role-picker
      .value=${field.value}
      @value-change=${(event: CustomEvent<Array<string>>) =>
        field.handleChange(event.detail)}
    ></role-picker>
  `,
)
```

# Svelte

```svelte
<form.Field name="selectedRoleIds">
  {#snippet children(field)}
    <RolePicker
      value={field.value}
      onValueChange={(roleIds) => field.handleChange(roleIds)}
    />
  {/snippet}
</form.Field>
```

# Vue

```vue
<form.Field name="selectedRoleIds" v-slot="{ field }">
  <RolePicker
    :model-value="field.value"
    @update:model-value="field.handleChange"
  />
</form.Field>
```

<!-- ::end:framework -->

## Rendering fields in an array

If you need to edit fields inside each array item, the previous approach has two problems.

- Editing any item's value would cause the whole array to rerender.
- Moving items within the array would not update fields, since it was only changing the array's value.

<!-- ::start:framework -->

# React

This is where `form.ArrayField` comes in. It ensures that each item in the array is rendered independently, while still subscribing to
item changes like swapping, removing or pushing new values.

```tsx
<form.ArrayField name="people">
  {(array) => (
    <ul>
      {array.value.map((person, index) => (
        <li key={person.id}>
          <form.Field name={`people[${index}].name`}>
            {(field) => <TextInput field={field} />}
          </form.Field>
        </li>
      ))}
    </ul>
  )}
</form.ArrayField>
```

# Preact

This is where `form.ArrayField` comes in. It ensures that each item in the array is rendered independently, while still subscribing to
item changes like swapping, removing or pushing new values.

```tsx
<form.ArrayField name="people">
  {(array) => (
    <ul>
      {array.value.map((person, index) => (
        <li key={person.id}>
          <form.Field name={`people[${index}].name`}>
            {(field) => <TextInput field={field} />}
          </form.Field>
        </li>
      ))}
    </ul>
  )}
</form.ArrayField>
```

# Solid

This is where `form.ArrayField` comes in. It ensures that each item in the array is rendered independently, while still subscribing to
item changes like swapping, removing or pushing new values.

```tsx
<form.ArrayField name="people">
  {(array) => (
    <ul>
      <For each={array().value}>
        {(_person, index) => (
          <li>
            <form.Field name={`people[${index()}].name`}>
              {(field) => <TextInput field={field} />}
            </form.Field>
          </li>
        )}
      </For>
    </ul>
  )}
</form.ArrayField>
```

# Angular

This is where `TanStackArrayField` comes in. It ensures that each item in the array is rendered independently, while still subscribing to
item changes like swapping, removing or pushing new values.

```ts
import { Component } from '@angular/core'
import {
  TanStackArrayField,
  TanStackField,
  injectForm,
} from '@tanstack/angular-form'

@Component({
  selector: 'app-people-form',
  standalone: true,
  imports: [TanStackArrayField, TanStackField],
  template: `
    <ng-container
      [tanstackArrayField]="form"
      name="people"
      #people="arrayField"
    >
      <ul>
        @for (person of people.api.value; track person.id; let index = $index) {
          <li>
            <ng-container
              [tanstackField]="form"
              [name]="personName(index)"
              #field="field"
            >
              <app-text-input [field]="field.api" />
            </ng-container>
          </li>
        }
      </ul>
    </ng-container>
  `,
})
export class PeopleFormComponent {
  form = injectForm({
    defaultValues: {
      people: [{ id: 'person-1', name: '' }],
    },
  })

  personName(index: number): `people[${number}].name` {
    return `people[${index}].name`
  }
}
```

# Lit

This is where `form.arrayField` comes in. It ensures that each item in the array is rendered independently, while still subscribing to
item changes like swapping, removing or pushing new values.

```ts
this.form.arrayField(
  { name: 'people' },
  (array) => html`
    <ul>
      ${repeat(
        array.value,
        (person) => person.id,
        (_person, index) => html`
          <li>
            ${this.form.field(
              { name: `people[${index}].name` },
              (field) => html`<text-input .field=${field}></text-input>`,
            )}
          </li>
        `,
      )}
    </ul>
  `,
)
```

# Svelte

This is where `form.ArrayField` comes in. It ensures that each item in the array is rendered independently, while still subscribing to
item changes like swapping, removing or pushing new values.

```svelte
<form.ArrayField name="people">
  {#snippet children(array)}
    <ul>
      {#each array.value as person, index (person.id)}
        <li>
          <form.Field name={`people[${index}].name`}>
            {#snippet children(field)}
              <TextInput field={field} />
            {/snippet}
          </form.Field>
        </li>
      {/each}
    </ul>
  {/snippet}
</form.ArrayField>
```

# Vue

This is where `form.ArrayField` comes in. It ensures that each item in the array is rendered independently, while still subscribing to
item changes like swapping, removing or pushing new values.

```vue
<form.ArrayField name="people" v-slot="{ field: array }">
  <ul>
    <li v-for="(person, index) in array.value" :key="person.id">
      <form.Field :name="`people[${index}].name`" v-slot="{ field }">
        <TextInput :field="field" />
      </form.Field>
    </li>
  </ul>
</form.ArrayField>
```

<!-- ::end:framework -->

### Keeping item identity for objects

While the nested fields use the index in their `name`, use your adapter's identity mechanism to keep each object tied
to the same rendered item.

<!-- ::start:framework -->

# React

```tsx
array.value.map((person) => <li key={person.id}>Item fields</li>)
```

# Preact

```tsx
array.value.map((person) => <li key={person.id}>Item fields</li>)
```

# Solid

```tsx
<For each={array().value}>{() => <li>Item fields</li>}</For>
```

# Angular

```html
@for (person of people.api.value; track person.id) {
<li>Item fields</li>
}
```

# Lit

```ts
repeat(
  array.value,
  (person) => person.id,
  () => html`<li>Item fields</li>`,
)
```

# Svelte

```svelte
{#each array.value as person (person.id)}
  <li>Item fields</li>
{/each}
```

# Vue

```vue
<li v-for="person in array.value" :key="person.id">Item fields</li>
```

<!-- ::end:framework -->

## Updating array values

Use the array field's mutation methods for structural changes. You can perform the same mutations from the form API by
passing the field name first.

<!-- ::start:tabs variant="files" -->

```ts file="Field methods"
// Append an item.
field.pushValue(value)

// Insert an item at an index.
field.insertValue(index, value)

// Remove the item at an index.
field.removeValue(index)

// Exchange two items.
field.swapValues(indexA, indexB)

// Move an item from one index to another.
field.moveValue(fromIndex, toIndex)

// Keep the items accepted by a predicate.
field.filterValues((value, i) => isEnabled(value)))

// Remove every item.
field.clearValues()
```

```ts file="Form methods"
// Append an item.
form.pushFieldValue('items', value)

// Insert an item at an index.
form.insertFieldValue('items', index, value)

// Remove the item at an index.
form.removeFieldValue('items', index)

// Exchange two items.
form.swapFieldValues('items', indexA, indexB)

// Move an item from one index to another.
form.moveFieldValue('items', fromIndex, toIndex)

// Keep the items accepted by a predicate.
form.filterFieldValues('items', (value, i) => isEnabled(value))

// Remove every item.
form.clearFieldValues('items')
```

<!-- ::end:tabs -->

You could make these changes yourself with `handleChange`, but these helpers also take care of the registered fields
for each item. When an item moves, its field state moves with it. When an item is removed, its field state is removed too.

A successful array mutation marks the array field as touched and dirty and causes validation by default.
