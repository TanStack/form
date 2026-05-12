import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import { pageTitle } from 'ember-page-title';
import { createForm, Subscribe } from '@tanstack/ember-form';

interface Person {
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

export default class ApplicationTemplate extends Component {
  form = createForm(this, {
    defaultValues: { firstName: 'Christian', lastName: '' } as Person,
    onSubmit: async ({ value }) => {
      // eslint-disable-next-line no-console
      console.log('submitted', value);
    },
  });

  handleSubmit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    this.form.handleSubmit();
  };

  reset = () => this.form.reset();

  pickSubmitState = (state: {
    canSubmit: boolean;
    isSubmitting: boolean;
  }) => ({
    cantSubmit: !state.canSubmit,
    isSubmitting: state.isSubmitting,
  });

  <template>
    {{pageTitle "Demo App"}}

    <h1>TanStack Form &mdash; Ember Demo</h1>

    <form {{on "submit" this.handleSubmit}}>
      <this.form.Field
        @name="firstName"
        @validators={{hash onChange=tooShort}}
        as |field|
      >
        <div>
          <label for="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            placeholder="First Name"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
        </div>
      </this.form.Field>

      <this.form.Field
        @name="lastName"
        @validators={{hash onChange=tooShort}}
        as |field|
      >
        <div>
          <label for="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            placeholder="Last Name"
            value={{field.state.value}}
            {{on "input" (fn handleInput field)}}
          />
          {{#each field.state.meta.errors as |err|}}
            <em>{{err}}</em>
          {{/each}}
        </div>
      </this.form.Field>

      <Subscribe
        @form={{this.form}}
        @selector={{this.pickSubmitState}}
        as |slice|
      >
        <button type="submit" disabled={{slice.cantSubmit}}>
          {{if slice.isSubmitting "Submitting" "Submit"}}
        </button>
      </Subscribe>
      <button type="button" {{on "click" this.reset}}>Reset</button>
    </form>
  </template>
}
