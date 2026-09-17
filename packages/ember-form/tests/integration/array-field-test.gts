import { click, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';

interface Hobbies {
  hobbies: string[];
}

const HobbiesForm = createForm({
  defaultValues: { hobbies: ['chess'] } as Hobbies,
});

const push = (field: { pushValue: (value: string) => void }) => () =>
  field.pushValue('go');

const removeFirst = (field: { removeValue: (index: number) => void }) => () =>
  field.removeValue(0);

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
});
