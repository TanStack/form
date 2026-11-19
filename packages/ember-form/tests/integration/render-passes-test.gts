import { fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

const SampleForm = createForm({
  defaultValues: { firstName: 'Ada', lastName: 'Lovelace' } as Sample,
});

const firstName = (state: { values: Sample }) => state.values.firstName;

module('Integration | render passes', function (hooks) {
  setupRenderingTest(hooks);

  test('the first render reads each value one time', async function (assert) {
    const read = (label: string, value: unknown) => {
      assert.step(`${label}: ${String(value)}`);
    };

    await render(
      <template>
        <SampleForm as |tanstackForm|>
          <tanstackForm.Subscribe @selector={{firstName}} as |value|>
            {{read "before" value}}
          </tanstackForm.Subscribe>

          <tanstackForm.Field @name="firstName" as |field|>
            {{read "field" field.state.value}}
            {{read "touched" field.state.meta.isTouched}}
          </tanstackForm.Field>

          <tanstackForm.Subscribe @selector={{firstName}} as |value|>
            {{read "after" value}}
          </tanstackForm.Subscribe>
        </SampleForm>
      </template>,
    );

    assert.verifySteps([
      'before: Ada',
      'field: Ada',
      'touched: false',
      'after: Ada',
    ]);
  });

  test('a change in one field does not render the other field again', async function (assert) {
    const read = (label: string, value: unknown) => {
      assert.step(`${label}: ${String(value)}`);
    };

    await render(
      <template>
        <SampleForm as |tanstackForm|>
          <tanstackForm.Field @name="firstName" as |field|>
            <input
              id="firstName"
              value={{field.state.value}}
              {{on "input" (fn handleInput field)}}
            />
            {{read "firstName" field.state.value}}
          </tanstackForm.Field>

          <tanstackForm.Field @name="lastName" as |field|>
            {{read "lastName" field.state.value}}
          </tanstackForm.Field>
        </SampleForm>
      </template>,
    );

    assert.verifySteps(['firstName: Ada', 'lastName: Lovelace']);

    await fillIn('#firstName', 'Grace');

    assert.verifySteps(['firstName: Grace']);
  });

  test('a change in the value does not apply the field options again', async function (assert) {
    const watch = (field: { update: (...args: never[]) => void }) => {
      const update = field.update;

      field.update = (...args) => {
        assert.step('update');
        update(...args);
      };
    };

    await render(
      <template>
        <SampleForm as |tanstackForm|>
          <tanstackForm.Field @name="firstName" as |field|>
            {{watch field}}
            <input
              id="firstName"
              value={{field.state.value}}
              {{on "input" (fn handleInput field)}}
            />
          </tanstackForm.Field>
        </SampleForm>
      </template>,
    );

    await fillIn('#firstName', 'Grace');

    assert.verifySteps([]);
  });
});
