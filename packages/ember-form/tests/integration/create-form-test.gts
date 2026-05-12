import Component from '@glimmer/component';
import { fillIn, render, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

module('Integration | createForm', function (hooks) {
  setupRenderingTest(hooks);

  test('handleSubmit invokes onSubmit with current values', async function (assert) {
    let submitted: Sample | undefined;

    class TestForm extends Component {
      form = createForm(this, {
        defaultValues: { firstName: 'Linus', lastName: 'Pauling' } as Sample,
        onSubmit: async ({ value }) => {
          submitted = value;
        },
      });

      submit = (event: Event) => {
        event.preventDefault();
        this.form.handleSubmit();
      };

      <template>
        <form id="f" {{on "submit" this.submit}}>
          <button id="go" type="submit">Go</button>
        </form>
      </template>
    }

    await render(<template><TestForm /></template>);
    document.getElementById('go')?.click();
    await settled();

    assert.deepEqual(submitted, { firstName: 'Linus', lastName: 'Pauling' });
  });

  test('useStore selector returns reactive slice', async function (assert) {
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

  test('this.form.Field works as closure-bound shorthand', async function (assert) {
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
