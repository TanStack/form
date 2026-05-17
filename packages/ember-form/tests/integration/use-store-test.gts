import Component from '@glimmer/component';
import { fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

const SampleForm = createForm({
  defaultValues: { firstName: '', lastName: '' } as Sample,
});

const firstNameSelector = (state: { values: Sample }) => state.values.firstName;

interface SliceSignature {
  Args: { form: { useStore: <T>(s: (state: any) => T) => { current: T } } };
  Blocks: { default: [value: string] };
}

class FirstNameSlice extends Component<SliceSignature> {
  slice = this.args.form.useStore(firstNameSelector);
  <template>{{yield this.slice.current}}</template>
}

module('Integration | form.useStore', function (hooks) {
  setupRenderingTest(hooks);

  test('selector returns reactive slice that updates', async function (assert) {
    await render(<template>
      <SampleForm as |tanstackForm|>
        <tanstackForm.Field @name="firstName" as |field|>
          <input
            id="firstName"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
        </tanstackForm.Field>
        <FirstNameSlice @form={{tanstackForm}} as |value|>
          <output id="store">{{value}}</output>
        </FirstNameSlice>
      </SampleForm>
    </template>);
    assert.dom('#store').hasText('');

    await fillIn('#firstName', 'Grace');
    assert.dom('#store').hasText('Grace');
  });
});
