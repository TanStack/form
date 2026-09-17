import { fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

const SampleForm = createForm({
  defaultValues: { firstName: '', lastName: '' } as Sample,
});

const pickFirstName = (state: { values: Sample }) => state.values.firstName;

module('Integration | tanstackForm.Subscribe', function (hooks) {
  setupRenderingTest(hooks);

  test('yields a selection without @form', async function (assert) {
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

          <tanstackForm.Subscribe @selector={{pickFirstName}} as |firstName|>
            <output id="selected">{{firstName}}</output>
          </tanstackForm.Subscribe>
        </SampleForm>
      </template>,
    );

    assert.dom('#selected').hasText('');

    await fillIn('#firstName', 'Ada');

    assert.dom('#selected').hasText('Ada');
  });
});
