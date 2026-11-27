import { tracked } from '@glimmer/tracking';
import { fillIn, render, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import { sourceOf } from '#src/-private/tracked-api.ts';
import { handleInput, tooShort, type Sample } from '../helpers.ts';

import type { AnyFieldApi } from '@tanstack/form-core';

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

  module('update', function () {
    /**
     * form-core binds `update` to its own object,
     * so the spy must be on that object and not on the yielded field.
     */
    const watch = (assert: { step: (name: string) => void }) => (field: object) => {
      const api = sourceOf(field as AnyFieldApi);
      const update = api.update;

      api.update = (options) => {
        assert.step('update');
        update(options);
      };
    };

    class State {
      @tracked validators = { onChange: tooShort };
      @tracked defaultValue = 'Ada';
    }

    test('a changed value does not call it', async function (assert) {
      const spy = watch(assert);

      await render(
        <template>
          <SampleForm as |tanstackForm|>
            <tanstackForm.Field @name="firstName" as |field|>
              {{spy field}}
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

    test('a changed @validators does not call it', async function (assert) {
      const spy = watch(assert);
      const local = new State();

      await render(
        <template>
          <SampleForm as |tanstackForm|>
            <tanstackForm.Field
              @name="firstName"
              @validators={{local.validators}}
              as |field|
            >
              {{spy field}}
              <input
                id="firstName"
                value={{field.state.value}}
                {{on "input" (fn handleInput field)}}
              />
              {{#each field.state.meta.errors as |error|}}
                <em>{{error}}</em>
              {{/each}}
            </tanstackForm.Field>
          </SampleForm>
        </template>,
      );

      local.validators = { onChange: () => 'never valid' };
      await settled();
      await fillIn('#firstName', 'Grace');

      assert.dom('em').hasText('never valid');
      assert.verifySteps([]);
    });

    test('a changed @defaultValue calls it one time', async function (assert) {
      const spy = watch(assert);
      const local = new State();

      await render(
        <template>
          <SampleForm as |tanstackForm|>
            <tanstackForm.Field
              @name="firstName"
              @defaultValue={{local.defaultValue}}
              as |field|
            >
              {{spy field}}
              <input id="firstName" value={{field.state.value}} />
            </tanstackForm.Field>
          </SampleForm>
        </template>,
      );

      local.defaultValue = 'Grace';
      await settled();

      assert.dom('#firstName').hasValue('Grace');
      assert.verifySteps(['update']);
    });
  });
});
