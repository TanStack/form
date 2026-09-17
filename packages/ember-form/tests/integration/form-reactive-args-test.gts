import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { click, fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import { handleInput, type Sample } from '../helpers.ts';

const SampleForm = createForm({
  defaultValues: { firstName: 'Linus', lastName: 'Pauling' } as Sample,
});

const submit = (form: { handleSubmit: () => unknown }) => () =>
  form.handleSubmit();

module('Integration | form reactive args', function (hooks) {
  setupRenderingTest(hooks);

  test('a changed @onSubmit replaces the previous one', async function (assert) {
    const calls: string[] = [];

    class TestForm extends Component {
      @tracked onSubmit = () => calls.push('first');

      swap = () => {
        this.onSubmit = () => calls.push('second');
      };

      <template>
        <SampleForm @onSubmit={{this.onSubmit}} as |tanstackForm|>
          <button id="go" type="button" {{on "click" (submit tanstackForm)}}>
            go
          </button>
        </SampleForm>

        <button id="swap" type="button" {{on "click" this.swap}}>swap</button>
      </template>
    }

    await render(<template><TestForm /></template>);

    await click('#go');
    await click('#swap');
    await click('#go');

    assert.deepEqual(calls, ['first', 'second']);
  });

  test('a changed @defaultValues updates an untouched field', async function (assert) {
    class TestForm extends Component {
      @tracked defaults: Sample = { firstName: 'Ada', lastName: '' };

      load = () => {
        this.defaults = { firstName: 'Grace', lastName: 'Hopper' };
      };

      <template>
        <SampleForm @defaultValues={{this.defaults}} as |tanstackForm|>
          <tanstackForm.Field @name="firstName" as |field|>
            <input id="firstName" value={{field.state.value}} />
          </tanstackForm.Field>
        </SampleForm>

        <button id="load" type="button" {{on "click" this.load}}>load</button>
      </template>
    }

    await render(<template><TestForm /></template>);

    assert.dom('#firstName').hasValue('Ada');

    await click('#load');

    assert.dom('#firstName').hasValue('Grace');
  });

  test('a changed @defaultValues keeps the input of the user', async function (assert) {
    class TestForm extends Component {
      @tracked defaults: Sample = { firstName: 'Ada', lastName: '' };

      load = () => {
        this.defaults = { firstName: 'Grace', lastName: 'Hopper' };
      };

      <template>
        <SampleForm @defaultValues={{this.defaults}} as |tanstackForm|>
          <tanstackForm.Field @name="firstName" as |field|>
            <input
              id="firstName"
              value={{field.state.value}}
              {{on "input" (fn handleInput field)}}
            />
          </tanstackForm.Field>
        </SampleForm>

        <button id="load" type="button" {{on "click" this.load}}>load</button>
      </template>
    }

    await render(<template><TestForm /></template>);
    await fillIn('#firstName', 'Hedy');
    await click('#load');

    assert.dom('#firstName').hasValue('Hedy');
  });
});
