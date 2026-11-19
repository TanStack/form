import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { clearRender, click, fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm, Field } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

const minThree = ({ value }: { value: string }) =>
  value.length < 3 ? 'min 3' : undefined;
const minFive = ({ value }: { value: string }) =>
  value.length < 5 ? 'min 5' : undefined;

const SampleForm = createForm({
  defaultValues: { firstName: '', lastName: '' } as Sample,
});

module('Integration | Field reactive args', function (hooks) {
  setupRenderingTest(hooks);

  test('changing @validators re-applies via api.update()', async function (assert) {
    class State {
      @tracked validator: ({ value }: { value: string }) => string | undefined =
        minThree;
    }

    const local = new State();

    class TestApp extends Component {
      get validator() {
        return local.validator;
      }

      swap = () => {
        local.validator = minFive;
      };

      <template>
        <SampleForm as |tanstackForm|>
          <Field
            @form={{tanstackForm}}
            @name="firstName"
            @validators={{hash onChange=this.validator}}
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
          <button id="swap" type="button" {{on "click" this.swap}}>swap</button>
        </SampleForm>
      </template>
    }

    await render(<template><TestApp /></template>);

    // initial validator (min 3): "Jo" should fail
    await fillIn('#firstName', 'Jo');
    assert.dom('em.error').hasText('min 3', 'initial validator runs');

    // 4 chars passes min-3 but should fail min-5 after swap
    await fillIn('#firstName', 'Joey');
    assert.dom('em.error').doesNotExist('clears after meeting min 3');

    await click('#swap');
    await fillIn('#firstName', 'Joey');
    assert.dom('em.error').hasText('min 5', 'updated validator applied');

    await fillIn('#firstName', 'Joeyz');
    assert.dom('em.error').doesNotExist('clears once min 5 satisfied');
  });

  test('a changed @name moves the field to the new name', async function (assert) {
    class State {
      @tracked name: keyof Sample = 'firstName';
    }

    const local = new State();
    const values: Sample = { firstName: '', lastName: '' };

    const NamesForm = createForm({
      defaultValues: { firstName: 'Ada', lastName: 'Lovelace' } as Sample,
      onSubmit: ({ value }) => Object.assign(values, value),
    });

    const listeners = {
      onMount: ({ fieldApi }: { fieldApi: { name: string } }) =>
        assert.step(`mount ${fieldApi.name}`),
      onUnmount: ({ fieldApi }: { fieldApi: { name: string } }) =>
        assert.step(`unmount ${fieldApi.name}`),
    };

    const swap = () => {
      local.name = 'lastName';
    };

    const submit = (form: { handleSubmit: () => unknown }) => () =>
      form.handleSubmit();

    await render(
      <template>
        <NamesForm as |tanstackForm|>
          <tanstackForm.Field
            @name={{local.name}}
            @listeners={{listeners}}
            as |field|
          >
            <input
              id="name"
              value={{field.state.value}}
              {{on "input" (fn handleInput field)}}
            />
          </tanstackForm.Field>

          <button id="swap" type="button" {{on "click" swap}}>swap</button>
          <button id="go" type="button" {{on "click" (submit tanstackForm)}}>
            go
          </button>
        </NamesForm>
      </template>,
    );

    assert.dom('#name').hasValue('Ada');
    assert.verifySteps(['mount firstName']);

    await click('#swap');

    assert.dom('#name').hasValue('Lovelace');
    assert.verifySteps(['mount lastName', 'unmount firstName']);

    await fillIn('#name', 'Byron');
    await click('#go');

    assert.deepEqual(values, { firstName: 'Ada', lastName: 'Byron' });

    await clearRender();

    assert.verifySteps(['unmount lastName']);
  });
});
