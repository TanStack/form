---
id: arrays
title: Arrays
---

TanStack Form supports arrays as values in a form, including sub-object values inside of an array.

## Basic Usage

To use an array, you can iterate over `field.state.value` with [`{{#each}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each):

```gjs
import { createForm } from '@tanstack/ember-form';

const PeopleForm = createForm({
  defaultValues: {
    people: [],
  },
});

<template>
  <PeopleForm as |tanstackForm|>
    <tanstackForm.Field @name="people" @mode="array" as |field|>
      {{#each field.state.value as |person|}}
        {{!-- ... --}}
      {{/each}}
    </tanstackForm.Field>
  </PeopleForm>
</template>
```

This will regenerate the list every time you run `pushValue` on `field`:

```gjs
const addPerson = (field) => field.pushValue({ name: '', age: 0 });

{{!-- inside a template --}}
<button {{on "click" (fn addPerson field)}} type="button">
  Add person
</button>
```

Finally, you can use a subfield like so:

```gjs
const handleInput = (field, event) => field.handleChange(event.target.value);
const nameAt = (i) => `people[${i}].name`;

{{!-- inside a template --}}
<tanstackForm.Field @name={{nameAt i}} as |subField|>
  <input
    value={{subField.state.value}}
    {{on "input" (fn handleInput subField)}}
  />
</tanstackForm.Field>
```

## Full Example

```gjs
import { createForm } from '@tanstack/ember-form';

const handleInput = (field, event) => field.handleChange(event.target.value);
const nameAt = (i) => `people[${i}].name`;
const addPerson = (field) => field.pushValue({ name: '', age: 0 });

const onSubmitFor = (form) => (event) => {
  event.preventDefault();
  event.stopPropagation();
  form.handleSubmit();
};

const handleSubmit = ({ value }) => alert(JSON.stringify(value));

const PeopleForm = createForm({
  defaultValues: {
    people: [] as Array<{ age: number; name: string }>,
  },
});

<template>
  <PeopleForm @onSubmit={{handleSubmit}} as |f|>
    <form id="form" {{on "submit" (onSubmitFor f)}}>
      <f.Field @name="people" as |field|>
        <div>
          {{#each field.state.value as |person i|}}
            <f.Field @name={{nameAt i}} as |subField|>
              <div>
                <label>
                  <div>Name for person {{i}}</div>
                  <input
                    value={{person.name}}
                    {{on "input" (fn handleInput subField)}}
                  />
                </label>
              </div>
            </f.Field>
          {{/each}}

          <button {{on "click" (fn addPerson field)}} type="button">
            Add person
          </button>
        </div>
      </f.Field>

      <button type="submit">Submit</button>
    </form>
  </PeopleForm>
</template>
```

> Note: in strict-mode templates you can't put complex expressions like `` `people[${i}].name` `` directly into an attribute or argument value. The `nameAt` helper above is a small module-level function that does the templating in JavaScript and is then invoked as `{{nameAt i}}`.
