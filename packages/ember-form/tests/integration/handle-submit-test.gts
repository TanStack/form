import Component from '@glimmer/component';
import { click, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import type { Sample } from '../helpers.ts';

const SampleForm = createForm({
  defaultValues: { firstName: 'Linus', lastName: 'Pauling' } as Sample,
});

module('Integration | form.handleSubmit', function (hooks) {
  setupRenderingTest(hooks);

  test('invokes the @onSubmit arg with current values', async function (assert) {
    let submitted: Sample | undefined;

    class TestForm extends Component {
      onSubmit = async ({ value }: { value: Sample }) => {
        submitted = value;
      };

      <template>
        <SampleForm @onSubmit={{this.onSubmit}} as |form|>
          <button id="go" type="button" {{on "click" form.handleSubmit}}>
            Go
          </button>
        </SampleForm>
      </template>
    }

    await render(<template><TestForm /></template>);
    await click('#go');

    assert.deepEqual(submitted, { firstName: 'Linus', lastName: 'Pauling' });
  });
});
