---
id: arrays
title: Arrays
---

TanStack Form supports arrays as values in a form, including sub-object values inside of an array.

## Basic Usage

To use an array, you can iterate over `field.state.value` with [`{{#each}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each):

```gjs
import Component from '@glimmer/component';
import { createForm } from '@tanstack/ember-form';

export default class PeopleForm extends Component {
  form = createForm(this, {
    defaultValues: {
      people: [],
    },
  });

  <template>
    <this.form.Field @name="people" @mode="array" as |field|>
      {{#each field.state.value as |person|}}
        {{!-- ... --}}
      {{/each}}
    </this.form.Field>
  </template>
}
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
<this.form.Field @name={{nameAt i}} as |subField|>
  <input
    value={{subField.state.value}}
    {{on "input" (fn handleInput subField)}}
  />
</this.form.Field>
```

## Full Example

```gjs
import Component from '@glimmer/component';
import { createForm } from '@tanstack/ember-form';

const handleInput = (field, event) => field.handleChange(event.target.value);
const nameAt = (i) => `people[${i}].name`;
const addPerson = (field) => field.pushValue({ name: '', age: 0 });

export default class PeopleForm extends Component {
  form = createForm(this, {
    defaultValues: {
      people: [] as Array<{ age: number; name: string }>,
    },
    onSubmit: ({ value }) => alert(JSON.stringify(value)),
  });

  submit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.form.handleSubmit();
  };

  <template>
    <form id="form" {{on "submit" this.submit}}>
      <this.form.Field @name="people" as |field|>
        <div>
          {{#each field.state.value as |person i|}}
            <this.form.Field @name={{nameAt i}} as |subField|>
              <div>
                <label>
                  <div>Name for person {{i}}</div>
                  <input
                    value={{person.name}}
                    {{on "input" (fn handleInput subField)}}
                  />
                </label>
              </div>
            </this.form.Field>
          {{/each}}

          <button {{on "click" (fn addPerson field)}} type="button">
            Add person
          </button>
        </div>
      </this.form.Field>

      <button type="submit">Submit</button>
    </form>
  </template>
}
```

> Note: in strict-mode templates you can't put complex expressions like `` `people[${i}].name` `` directly into an attribute or argument value. The `nameAt` helper above is a small module-level function that does the templating in JavaScript and is then invoked as `{{nameAt i}}`.
