import Component from '@glimmer/component';
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

const pickSubmitState = (state: {
  canSubmit: boolean;
  isSubmitting: boolean;
}) => ({
  cantSubmit: !state.canSubmit,
  isSubmitting: state.isSubmitting,
});

const PersonForm = createForm({
  defaultValues: { firstName: 'Christian', lastName: '' } as Person,
});

const onSubmitFor =
  (form: { handleSubmit: () => void }) => (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    form.handleSubmit();
  };

export default class ApplicationTemplate extends Component {
  onSubmit = async ({ value }: { value: Person }) => {
    // eslint-disable-next-line no-console
    console.log('submitted', value);
  };

  <template>
    {{pageTitle "Demo App"}}

    <h1>TanStack Form &mdash; Ember Demo</h1>

    <PersonForm @onSubmit={{this.onSubmit}} as |Form|>
      <form {{on "submit" (onSubmitFor Form)}}>
        <Form.Field
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
        </Form.Field>

        <Form.Field
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
        </Form.Field>

        <Subscribe @form={{Form}} @selector={{pickSubmitState}} as |slice|>
          <button type="submit" disabled={{slice.cantSubmit}}>
            {{if slice.isSubmitting "Submitting" "Submit"}}
          </button>
        </Subscribe>
        <button type="button" {{on "click" Form.reset}}>Reset</button>
      </form>
    </PersonForm>
  </template>
}
