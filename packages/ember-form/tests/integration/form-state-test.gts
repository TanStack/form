import { click, fillIn, render, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm, FormApi, Subscribe } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

const SampleForm = createForm({
  defaultValues: { firstName: '', lastName: '' } as Sample,
});

const submit = (form: { handleSubmit: () => unknown }) => () =>
  form.handleSubmit();

module('Integration | form state', function (hooks) {
  setupRenderingTest(hooks);

  test('tanstackForm.state follows the store', async function (assert) {
    await render(
      <template>
        <SampleForm as |tanstackForm|>
          <tanstackForm.Field @name="firstName" as |field|>
            <input
              id="firstName"
              value={{field.state.value}}
              {{on "input" (fn handleInput field)}}
            />
          </tanstackForm.Field>

          <output id="values">{{tanstackForm.state.values.firstName}}</output>
          <output id="attempts">{{tanstackForm.state.submissionAttempts}}</output>

          <button id="go" type="button" {{on "click" (submit tanstackForm)}}>
            go
          </button>
        </SampleForm>
      </template>,
    );

    assert.dom('#values').hasText('');
    assert.dom('#attempts').hasText('0');

    await fillIn('#firstName', 'Ada');

    assert.dom('#values').hasText('Ada');

    await click('#go');

    assert.dom('#attempts').hasText('1');
  });

  test('a read of one key does not run again for another key', async function (assert) {
    const read = (label: string, value: unknown) => {
      assert.step(`${label}: ${String(value)}`);
    };

    await render(
      <template>
        <SampleForm as |tanstackForm|>
          {{read "attempts" tanstackForm.state.submissionAttempts}}

          <tanstackForm.Field @name="firstName" as |field|>
            <input
              id="firstName"
              value={{field.state.value}}
              {{on "input" (fn handleInput field)}}
            />
          </tanstackForm.Field>
        </SampleForm>
      </template>,
    );

    await fillIn('#firstName', 'Ada');

    assert.verifySteps(['attempts: 0']);
  });

  test('Subscribe follows a FormApi that createForm did not make', async function (assert) {
    const form = new FormApi({
      defaultValues: { firstName: 'Ada', lastName: '' } as Sample,
    });

    await render(
      <template>
        <Subscribe @form={{form}} as |state|>
          <output id="values">{{state.values.firstName}}</output>
        </Subscribe>
      </template>,
    );

    assert.dom('#values').hasText('Ada');

    form.setFieldValue('firstName', 'Grace');
    await settled();

    assert.dom('#values').hasText('Grace');
  });
});
