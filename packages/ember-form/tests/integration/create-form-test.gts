import Component from '@glimmer/component';
import { fn, hash } from '@ember/helper';
import { on } from '@ember/modifier';
import { fillIn, render, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm, Field, Subscribe } from '@tanstack/ember-form';

interface Sample {
  firstName: string;
  lastName: string;
}

const handleInput = (
  field: { handleChange: (value: string) => void },
  event: Event,
) => {
  field.handleChange((event.target as HTMLInputElement).value);
};

const tooShort = ({ value }: { value: string }) =>
  value.length < 3 ? 'Not long enough' : undefined;

module('Integration | createForm', function (hooks) {
  setupRenderingTest(hooks);

  test('renders default values via Field', async function (assert) {
    class TestForm extends Component {
      form = createForm(this, {
        defaultValues: { firstName: 'Christian', lastName: '' } as Sample,
        onSubmit: async () => {},
      });

      <template>
        <Field @form={{this.form}} @name="firstName" as |field|>
          <input
            id="firstName"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
        </Field>
        <Field @form={{this.form}} @name="lastName" as |field|>
          <input
            id="lastName"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
        </Field>
      </template>
    }

    await render(<template><TestForm /></template>);

    assert.dom('#firstName').hasValue('Christian');
    assert.dom('#lastName').hasValue('');
  });

  test('user input updates field state reactively', async function (assert) {
    class TestForm extends Component {
      form = createForm(this, {
        defaultValues: { firstName: '', lastName: '' } as Sample,
        onSubmit: async () => {},
      });

      <template>
        <Field @form={{this.form}} @name="firstName" as |field|>
          <input
            id="firstName"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
          <output id="value">{{field.state.value}}</output>
        </Field>
      </template>
    }

    await render(<template><TestForm /></template>);
    await fillIn('#firstName', 'Julian');

    assert.dom('#firstName').hasValue('Julian');
    assert.dom('#value').hasText('Julian');
  });

  test('field-level validation surfaces errors and clears them', async function (assert) {
    class TestForm extends Component {
      form = createForm(this, {
        defaultValues: { firstName: '', lastName: '' } as Sample,
        onSubmit: async () => {},
      });

      <template>
        <Field
          @form={{this.form}}
          @name="firstName"
          @validators={{hash onChange=tooShort}}
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
      </template>
    }

    await render(<template><TestForm /></template>);
    await fillIn('#firstName', 'Jo');

    assert.dom('em.error').hasText('Not long enough');

    await fillIn('#firstName', 'Joey');

    assert.dom('em.error').doesNotExist();
  });

  test('Subscribe yields a selected slice that updates', async function (assert) {
    const pickValues = (state: { values: Sample }) => state.values;

    class TestForm extends Component {
      form = createForm(this, {
        defaultValues: { firstName: '', lastName: '' } as Sample,
        onSubmit: async () => {},
      });

      pickValues = pickValues;

      <template>
        <Field @form={{this.form}} @name="firstName" as |field|>
          <input
            id="firstName"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
        </Field>
        <Subscribe @form={{this.form}} @selector={{this.pickValues}} as |values|>
          <output id="snapshot">{{values.firstName}}</output>
        </Subscribe>
      </template>
    }

    await render(<template><TestForm /></template>);
    assert.dom('#snapshot').hasText('');

    await fillIn('#firstName', 'Ada');
    assert.dom('#snapshot').hasText('Ada');
  });

  test('useStore selector returns reactive slice', async function (assert) {
    class TestForm extends Component {
      form = createForm(this, {
        defaultValues: { firstName: '', lastName: '' } as Sample,
        onSubmit: async () => {},
      });

      slice = this.form.useStore((state) => state.values.firstName);

      <template>
        <Field @form={{this.form}} @name="firstName" as |field|>
          <input
            id="firstName"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
        </Field>
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
});
