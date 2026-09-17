import Component from '@glimmer/component';
import { fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

import type { EmberFormApi, FormState } from '@tanstack/ember-form';

const SampleForm = createForm({
  defaultValues: { firstName: '', lastName: '' } as Sample,
});

type SampleState = FormState<
  Sample,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined
>;

const firstName = (state: SampleState) => state.values.firstName;

interface FirstNameSignature {
  Args: {
    form: Pick<
      EmberFormApi<
        Sample,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        never
      >,
      'useSelector'
    >;
  };
  Blocks: { default: [value: string] };
}

class FirstName extends Component<FirstNameSignature> {
  selected = this.args.form.useSelector(firstName);

  <template>{{yield this.selected.current}}</template>
}

module('Integration | form.useSelector', function (hooks) {
  setupRenderingTest(hooks);

  test('current follows the store', async function (assert) {
    await render(
      <template>
        <SampleForm as |tanstackForm|>
          <tanstackForm.Field @name="firstName" as |field|>
            <input
              id="firstName"
              value={{field.state.value}}
              {{on "input" (fn handleInput field)}}
            />
          </tanstackForm.Field>

          <FirstName @form={{tanstackForm}} as |value|>
            <output id="store">{{value}}</output>
          </FirstName>
        </SampleForm>
      </template>,
    );

    assert.dom('#store').hasText('');

    await fillIn('#firstName', 'Grace');

    assert.dom('#store').hasText('Grace');
  });
});
