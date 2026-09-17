import { fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { createForm } from '@tanstack/ember-form';
import { handleInput } from '../helpers.ts';

import type { AnyFieldApi } from '@tanstack/ember-form';

interface Passwords {
  password: string;
  confirm: string;
}

const PasswordForm = createForm({
  defaultValues: { password: '', confirm: '' } as Passwords,
});

const matchesPassword = ({
  value,
  fieldApi,
}: {
  value: string;
  fieldApi: AnyFieldApi;
}) =>
  value === fieldApi.form.getFieldValue('password')
    ? undefined
    : 'Passwords do not match';

module('Integration | linked fields', function (hooks) {
  setupRenderingTest(hooks);

  test('onChangeListenTo runs the validator when the other field changes', async function (assert) {
    await render(
      <template>
        <PasswordForm as |tanstackForm|>
          <tanstackForm.Field @name="password" as |field|>
            <input
              id="password"
              value={{field.state.value}}
              {{on "input" (fn handleInput field)}}
            />
          </tanstackForm.Field>

          <tanstackForm.Field
            @name="confirm"
            @validators={{hash
              onChangeListenTo=(array "password")
              onChange=matchesPassword
            }}
            as |field|
          >
            <input
              id="confirm"
              value={{field.state.value}}
              {{on "input" (fn handleInput field)}}
            />
            {{#each field.state.meta.errors as |error|}}
              <em class="error">{{error}}</em>
            {{/each}}
          </tanstackForm.Field>
        </PasswordForm>
      </template>,
    );

    await fillIn('#password', 'secret');
    await fillIn('#confirm', 'secret');

    assert.dom('em.error').doesNotExist();

    await fillIn('#password', 'changed');

    assert.dom('em.error').hasText('Passwords do not match');
  });
});
