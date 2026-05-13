import Component from '@glimmer/component';
import { render, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import type { Sample } from '../helpers.ts';

module('Integration | form.handleSubmit', function (hooks) {
  setupRenderingTest(hooks);

  test('invokes onSubmit with current values', async function (assert) {
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
});
