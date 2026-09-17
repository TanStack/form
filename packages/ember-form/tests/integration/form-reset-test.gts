import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { click, fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

const SampleForm = createForm({
  defaultValues: { firstName: 'Ada', lastName: '' } as Sample,
});

const reset = (form: { reset: () => void }) => () => form.reset();

module('Integration | form.reset', function (hooks) {
  setupRenderingTest(hooks);

  test('the input returns to the default value', async function (assert) {
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

          <button id="reset" type="button" {{on "click" (reset tanstackForm)}}>
            reset
          </button>
        </SampleForm>
      </template>,
    );

    await fillIn('#firstName', 'Grace');

    assert.dom('#firstName').hasValue('Grace');

    await click('#reset');

    assert.dom('#firstName').hasValue('Ada');
  });
});
