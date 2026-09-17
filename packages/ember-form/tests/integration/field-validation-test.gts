import { blur, fillIn, focus, render, waitFor } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

const SampleForm = createForm({
  defaultValues: { firstName: '', lastName: '' } as Sample,
});

const rejectOther = ({ value }: { value: string }) =>
  value === 'other' ? 'Enter a different value' : undefined;

const required = ({ value }: { value: string }) =>
  value ? undefined : 'Required';

const setWithoutMeta = (
  field: {
    setValue: (value: string, options: { dontUpdateMeta: boolean }) => void;
  },
  event: Event,
) => {
  field.setValue((event.target as HTMLInputElement).value, {
    dontUpdateMeta: true,
  });
};

module('Integration | Field validation', function (hooks) {
  setupRenderingTest(hooks);

  test('onChange does not run while the field is untouched', async function (assert) {
    await render(
      <template>
        <SampleForm as |tanstackForm|>
          <tanstackForm.Field
            @name="firstName"
            @validators={{hash onChange=rejectOther}}
            as |field|
          >
            <input
              id="firstName"
              value={{field.state.value}}
              {{on "input" (fn setWithoutMeta field)}}
            />
            {{#each field.state.meta.errors as |error|}}
              <em class="error">{{error}}</em>
            {{/each}}
          </tanstackForm.Field>
        </SampleForm>
      </template>,
    );

    await fillIn('#firstName', 'other');

    assert.dom('em.error').doesNotExist();
  });

  test('onBlur runs when the input loses focus', async function (assert) {
    await render(
      <template>
        <SampleForm as |tanstackForm|>
          <tanstackForm.Field
            @name="firstName"
            @validators={{hash onBlur=required}}
            as |field|
          >
            <input
              id="firstName"
              value={{field.state.value}}
              {{on "blur" field.handleBlur}}
              {{on "input" (fn handleInput field)}}
            />
            <output id="touched">{{field.state.meta.isTouched}}</output>
            <output id="blurred">{{field.state.meta.isBlurred}}</output>
            {{#each field.state.meta.errors as |error|}}
              <em class="error">{{error}}</em>
            {{/each}}
          </tanstackForm.Field>
        </SampleForm>
      </template>,
    );

    assert.dom('#touched').hasText('false');
    assert.dom('em.error').doesNotExist();

    await focus('#firstName');
    await blur('#firstName');

    assert.dom('#blurred').hasText('true');
    assert.dom('em.error').hasText('Required');

    await fillIn('#firstName', 'Ada');
    await blur('#firstName');

    assert.dom('#touched').hasText('true');
    assert.dom('em.error').doesNotExist();
  });

  test('onChangeAsync shows its error', async function (assert) {
    const rejectAsync = async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));

      return 'Taken';
    };

    await render(
      <template>
        <SampleForm as |tanstackForm|>
          <tanstackForm.Field
            @name="firstName"
            @validators={{hash onChangeAsync=rejectAsync}}
            as |field|
          >
            <input
              id="firstName"
              value={{field.state.value}}
              {{on "input" (fn handleInput field)}}
            />
            {{#each field.state.meta.errors as |error|}}
              <em class="error">{{error}}</em>
            {{/each}}
          </tanstackForm.Field>
        </SampleForm>
      </template>,
    );

    await fillIn('#firstName', 'Ada');
    await waitFor('em.error');

    assert.dom('em.error').hasText('Taken');
  });

  test('onChangeAsyncDebounceMs runs the validator one time for fast input', async function (assert) {
    let calls = 0;

    const rejectAsync = async () => {
      calls++;

      return 'Taken';
    };

    await render(
      <template>
        <SampleForm as |tanstackForm|>
          <tanstackForm.Field
            @name="firstName"
            @validators={{hash
              onChangeAsync=rejectAsync
              onChangeAsyncDebounceMs=50
            }}
            as |field|
          >
            <input
              id="firstName"
              value={{field.state.value}}
              {{on "input" (fn handleInput field)}}
            />
            {{#each field.state.meta.errors as |error|}}
              <em class="error">{{error}}</em>
            {{/each}}
          </tanstackForm.Field>
        </SampleForm>
      </template>,
    );

    await fillIn('#firstName', 'A');
    await fillIn('#firstName', 'Ad');
    await fillIn('#firstName', 'Ada');

    assert.strictEqual(calls, 0, 'the debounce holds the validator back');

    await waitFor('em.error');

    assert.strictEqual(calls, 1);
    assert.dom('em.error').hasText('Taken');
  });
});
