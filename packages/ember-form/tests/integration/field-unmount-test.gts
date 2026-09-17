import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { click, fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

const SampleForm = createForm({
  defaultValues: { firstName: '', lastName: '' } as Sample,
});

module('Integration | Field unmount', function (hooks) {
  setupRenderingTest(hooks);

  test('a removed field calls its onUnmount listener', async function (assert) {
    const calls: string[] = [];
    const listeners = { onUnmount: () => calls.push('unmount') };

    class TestForm extends Component {
      @tracked isShown = true;

      hide = () => {
        this.isShown = false;
      };

      <template>
        <SampleForm as |tanstackForm|>
          {{#if this.isShown}}
            <tanstackForm.Field
              @name="firstName"
              @listeners={{listeners}}
              as |field|
            >
              <input id="firstName" value={{field.state.value}} />
            </tanstackForm.Field>
          {{/if}}
        </SampleForm>

        <button id="hide" type="button" {{on "click" this.hide}}>hide</button>
      </template>
    }

    await render(<template><TestForm /></template>);

    assert.deepEqual(calls, []);

    await click('#hide');

    assert.dom('#firstName').doesNotExist();
    assert.deepEqual(calls, ['unmount']);
  });

  test('the form still works after a field is removed', async function (assert) {
    class TestForm extends Component {
      @tracked isShown = true;

      hide = () => {
        this.isShown = false;
      };

      <template>
        <SampleForm as |tanstackForm|>
          {{#if this.isShown}}
            <tanstackForm.Field @name="firstName" as |field|>
              <input id="firstName" value={{field.state.value}} />
            </tanstackForm.Field>
          {{/if}}

          <tanstackForm.Field @name="lastName" as |field|>
            <input
              id="lastName"
              value={{field.state.value}}
              {{on "input" (fn handleInput field)}}
            />
            <output id="value">{{field.state.value}}</output>
          </tanstackForm.Field>
        </SampleForm>

        <button id="hide" type="button" {{on "click" this.hide}}>hide</button>
      </template>
    }

    await render(<template><TestForm /></template>);
    await click('#hide');
    await fillIn('#lastName', 'Hopper');

    assert.dom('#value').hasText('Hopper');
  });
});
