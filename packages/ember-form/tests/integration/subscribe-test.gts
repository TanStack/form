import { fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm, Subscribe } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

const SampleForm = createForm({
  defaultValues: { firstName: '', lastName: '' } as Sample,
});

const GraceForm = createForm({
  defaultValues: { firstName: 'Grace', lastName: '' } as Sample,
});

const pickValues = (state: { values: Sample }) => state.values;

module('Integration | Subscribe', function (hooks) {
  setupRenderingTest(hooks);

  test('yields a selected slice that updates', async function (assert) {
    await render(<template>
      <SampleForm as |tanstackForm|>
        <tanstackForm.Field @name="firstName" as |field|>
          <input
            id="firstName"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
        </tanstackForm.Field>
        <Subscribe @form={{tanstackForm}} @selector={{pickValues}} as |values|>
          <output id="snapshot">{{values.firstName}}</output>
        </Subscribe>
      </SampleForm>
    </template>);
    assert.dom('#snapshot').hasText('');

    await fillIn('#firstName', 'Ada');
    assert.dom('#snapshot').hasText('Ada');
  });

  test('omitted selector yields the full form state', async function (assert) {
    await render(<template>
      <GraceForm as |tanstackForm|>
        <Subscribe @form={{tanstackForm}} as |state|>
          <output id="firstNameSnapshot">{{state.values.firstName}}</output>
        </Subscribe>
      </GraceForm>
    </template>);
    assert.dom('#firstNameSnapshot').hasText('Grace');
  });
});
