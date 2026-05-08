import Component from '@glimmer/component';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm, Subscribe } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

module('Integration | Subscribe', function (hooks) {
  setupRenderingTest(hooks);

  test('yields a selected slice that updates', async function (assert) {
    const pickValues = (state: { values: Sample }) => state.values;

    class TestForm extends Component {
      form = createForm(this, {
        defaultValues: { firstName: '', lastName: '' } as Sample,
        onSubmit: async () => {},
      });

      pickValues = pickValues;

      <template>
        <this.form.Field @name="firstName" as |field|>
          <input
            id="firstName"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
        </this.form.Field>
        <Subscribe @form={{this.form}} @selector={{this.pickValues}} as |values|>
          <output id="snapshot">{{values.firstName}}</output>
        </Subscribe>
      </template>
    }

    await render(<template><TestForm /></template>);
    assert.dom('#snapshot').hasText('');

    await fillIn('#firstName', 'Ada');
    assert.dom('#snapshot').hasText('Ada');
  });

  test('omitted selector yields the full form state', async function (assert) {
    class TestForm extends Component {
      form = createForm(this, {
        defaultValues: { firstName: 'Grace', lastName: '' } as Sample,
        onSubmit: async () => {},
      });

      <template>
        <Subscribe @form={{this.form}} as |state|>
          <output id="firstNameSnapshot">{{state.values.firstName}}</output>
        </Subscribe>
      </template>
    }

    await render(<template><TestForm /></template>);
    assert.dom('#firstNameSnapshot').hasText('Grace');
  });
});
