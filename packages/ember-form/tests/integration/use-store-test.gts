import Component from '@glimmer/component';
import { fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

module('Integration | form.useStore', function (hooks) {
  setupRenderingTest(hooks);

  test('selector returns reactive slice that updates', async function (assert) {
    class TestForm extends Component {
      form = createForm(this, {
        defaultValues: { firstName: '', lastName: '' } as Sample,
        onSubmit: async () => {},
      });

      slice = this.form.useStore((state) => state.values.firstName);

      <template>
        <this.form.Field @name="firstName" as |field|>
          <input
            id="firstName"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
        </this.form.Field>
        <output id="store">{{this.slice.current}}</output>
      </template>
    }

    await render(<template><TestForm /></template>);
    assert.dom('#store').hasText('');

    await fillIn('#firstName', 'Grace');
    assert.dom('#store').hasText('Grace');
  });
});
