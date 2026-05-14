import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { click, fillIn, render } from '@ember/test-helpers';
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
        <SampleForm as |form|>
          <Field
            @form={{form}}
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
    // The swap re-binds @validators; the new validator must run on the next
    // change. Trigger a change and check.
    await fillIn('#firstName', 'Joey');
    assert.dom('em.error').hasText('min 5', 'updated validator applied');

    await fillIn('#firstName', 'Joeyz');
    assert.dom('em.error').doesNotExist('clears once min 5 satisfied');
  });
});
