import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import { fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm, Field } from '@tanstack/ember-form';
import { handleInput, tooShort, type Sample } from '../helpers.ts';

module('Integration | Field', function (hooks) {
  setupRenderingTest(hooks);

  test('renders default values', async function (assert) {
    class TestForm extends Component {
      form = createForm(this, {
        defaultValues: { firstName: 'Christian', lastName: '' } as Sample,
        onSubmit: async () => {},
      });

      <template>
        <Field @form={{this.form}} @name="firstName" as |field|>
          <input
            id="firstName"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
        </Field>
        <Field @form={{this.form}} @name="lastName" as |field|>
          <input
            id="lastName"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
        </Field>
      </template>
    }

    await render(<template><TestForm /></template>);

    assert.dom('#firstName').hasValue('Christian');
    assert.dom('#lastName').hasValue('');
  });

  test('user input updates field state reactively', async function (assert) {
    class TestForm extends Component {
      form = createForm(this, {
        defaultValues: { firstName: '', lastName: '' } as Sample,
        onSubmit: async () => {},
      });

      <template>
        <Field @form={{this.form}} @name="firstName" as |field|>
          <input
            id="firstName"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
          <output id="value">{{field.state.value}}</output>
        </Field>
      </template>
    }

    await render(<template><TestForm /></template>);
    await fillIn('#firstName', 'Julian');

    assert.dom('#firstName').hasValue('Julian');
    assert.dom('#value').hasText('Julian');
  });

  test('field-level validation surfaces errors and clears them', async function (assert) {
    class TestForm extends Component {
      form = createForm(this, {
        defaultValues: { firstName: '', lastName: '' } as Sample,
        onSubmit: async () => {},
      });

      <template>
        <Field
          @form={{this.form}}
          @name="firstName"
          @validators={{hash onChange=tooShort}}
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
        </Field>
      </template>
    }

    await render(<template><TestForm /></template>);
    await fillIn('#firstName', 'Jo');

    assert.dom('em.error').hasText('Not long enough');

    await fillIn('#firstName', 'Joey');

    assert.dom('em.error').doesNotExist();
  });
});
