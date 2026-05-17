import { fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

const SampleForm = createForm({
  defaultValues: { firstName: 'Ada', lastName: '' } as Sample,
});

module('Integration | tanstackForm.Field (closure-bound)', function (hooks) {
  setupRenderingTest(hooks);

  test('renders with the form already bound', async function (assert) {
    await render(<template>
      <SampleForm as |tanstackForm|>
        <tanstackForm.Field @name="firstName" as |field|>
          <input
            id="firstName"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
          <output id="value">{{field.state.value}}</output>
        </tanstackForm.Field>
      </SampleForm>
    </template>);
    assert.dom('#firstName').hasValue('Ada');

    await fillIn('#firstName', 'Grace');
    assert.dom('#value').hasText('Grace');
  });
});
