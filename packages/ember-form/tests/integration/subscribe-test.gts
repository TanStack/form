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
      <SampleForm as |form|>
        <form.Field @name="firstName" as |field|>
          <input
            id="firstName"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
        </form.Field>
        <Subscribe @form={{form}} @selector={{pickValues}} as |values|>
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
      <GraceForm as |form|>
        <Subscribe @form={{form}} as |state|>
          <output id="firstNameSnapshot">{{state.values.firstName}}</output>
        </Subscribe>
      </GraceForm>
    </template>);
    assert.dom('#firstNameSnapshot').hasText('Grace');
  });
});
