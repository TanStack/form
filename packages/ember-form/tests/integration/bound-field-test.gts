import Component from '@glimmer/component';
import { fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

module('Integration | this.form.Field (closure-bound)', function (hooks) {
  setupRenderingTest(hooks);

  test('renders with the form already bound', async function (assert) {
    class TestForm extends Component {
      form = createForm(this, {
        defaultValues: { firstName: 'Ada', lastName: '' } as Sample,
        onSubmit: async () => {},
      });

      <template>
        <this.form.Field @name="firstName" as |field|>
          <input
            id="firstName"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
          <output id="value">{{field.state.value}}</output>
        </this.form.Field>
      </template>
    }

    await render(<template><TestForm /></template>);
    assert.dom('#firstName').hasValue('Ada');

    await fillIn('#firstName', 'Grace');
    assert.dom('#value').hasText('Grace');
  });
});
