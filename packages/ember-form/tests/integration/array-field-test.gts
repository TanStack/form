import { click, fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import { handleInput } from '../helpers.ts';

interface Hobbies {
  hobbies: string[];
}

interface People {
  people: Array<{ name: string }>;
}

const HobbiesForm = createForm({
  defaultValues: { hobbies: ['chess'] } as Hobbies,
});

const PairForm = createForm({
  defaultValues: { hobbies: ['chess', 'go'] } as Hobbies,
});

const PeopleForm = createForm({
  defaultValues: { people: [{ name: 'Ada' }, { name: 'Grace' }] } as People,
});

const push = (field: { pushValue: (value: string) => void }) => () =>
  field.pushValue('go');

const removeFirst = (field: { removeValue: (index: number) => void }) => () =>
  field.removeValue(0);

const swap =
  (field: { swapValues: (a: number, b: number) => void }) => () =>
    field.swapValues(0, 1);

const nameAt = (index: number) => `people[${index}].name` as const;

module('Integration | Field @mode="array"', function (hooks) {
  setupRenderingTest(hooks);

  test('the list follows pushValue and removeValue', async function (assert) {
    await render(
      <template>
        <HobbiesForm as |tanstackForm|>
          <tanstackForm.Field @name="hobbies" @mode="array" as |field|>
            <ul>
              {{#each field.state.value as |hobby|}}
                <li>{{hobby}}</li>
              {{/each}}
            </ul>

            <button id="push" type="button" {{on "click" (push field)}}>
              push
            </button>
            <button
              id="remove"
              type="button"
              {{on "click" (removeFirst field)}}
            >
              remove
            </button>
          </tanstackForm.Field>
        </HobbiesForm>
      </template>,
    );

    assert.dom('li').exists({ count: 1 });

    await click('#push');

    assert.dom('li').exists({ count: 2 });
    assert.dom('li:last-child').hasText('go');

    await click('#remove');

    assert.dom('li').exists({ count: 1 });
    assert.dom('li').hasText('go');
  });

  test('the list follows swapValues when the length stays the same', async function (assert) {
    await render(
      <template>
        <PairForm as |tanstackForm|>
          <tanstackForm.Field @name="hobbies" @mode="array" as |field|>
            <ul>
              {{#each field.state.value as |hobby|}}
                <li>{{hobby}}</li>
              {{/each}}
            </ul>

            <button id="swap" type="button" {{on "click" (swap field)}}>
              swap
            </button>
          </tanstackForm.Field>
        </PairForm>
      </template>,
    );

    assert.dom('li:first-child').hasText('chess');

    await click('#swap');

    assert.dom('li:first-child').hasText('go');
    assert.dom('li:last-child').hasText('chess');
  });

  test('a subfield reads and writes one item', async function (assert) {
    await render(
      <template>
        <PeopleForm as |tanstackForm|>
          <tanstackForm.Field @name="people" @mode="array" as |field|>
            {{#each field.state.value as |_person index|}}
              <tanstackForm.Field @name={{nameAt index}} as |nameField|>
                <input
                  class="name"
                  value={{nameField.state.value}}
                  {{on "input" (fn handleInput nameField)}}
                />
              </tanstackForm.Field>
            {{/each}}
          </tanstackForm.Field>

          <tanstackForm.Subscribe as |state|>
            <output id="values">
              {{#each state.values.people as |person|}}{{person.name}},{{/each}}
            </output>
          </tanstackForm.Subscribe>
        </PeopleForm>
      </template>,
    );

    assert.dom('.name').exists({ count: 2 });
    assert.dom('.name:nth-of-type(2)').hasValue('Grace');

    await fillIn('.name:nth-of-type(2)', 'Hedy');

    assert.dom('#values').hasText('Ada,Hedy,');
  });
});
