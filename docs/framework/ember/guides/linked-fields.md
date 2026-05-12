---
id: linked-fields
title: Link Two Form Fields Together
---

You may find yourself needing to link two fields together; when one is validated as another field's value has changed. One such usage is when you have both a `password` and `confirm_password` field, where you want `confirm_password` to error out when `password`'s value does not match — regardless of which field triggered the value change.

Imagine the following userflow:

- User updates the confirm-password field.
- User updates the non-confirm password field.

In this example, the form will still have errors present, as the "confirm password" field validation has not been re-run to mark as accepted.

To solve this, we need to make sure that the "confirm password" validation is re-run when the password field is updated. To do this, you can add an `onChangeListenTo` property to the `confirm_password` field's `@validators`.

```gjs
import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import { createForm } from '@tanstack/ember-form';

const handleChange = (field, event) => field.handleChange(event.target.value);
const onChangeListenTo = ['password'];

export default class PasswordForm extends Component {
  form = createForm(this, {
    defaultValues: {
      password: '',
      confirm_password: '',
    },
    // ...
  });

  validateConfirm = ({ value, fieldApi }) => {
    if (value !== fieldApi.form.getFieldValue('password')) {
      return 'Passwords do not match';
    }
    return undefined;
  };

  <template>
    <div>
      <this.form.Field @name="password" as |field|>
        <label>
          <div>Password</div>
          <input
            value={{field.state.value}}
            {{on "change" (fn handleChange field)}}
          />
        </label>
      </this.form.Field>
      <this.form.Field
        @name="confirm_password"
        @validators={{hash
          onChangeListenTo=onChangeListenTo
          onChange=this.validateConfirm
        }}
        as |field|
      >
        <div>
          <label>
            <div>Confirm Password</div>
            <input
              value={{field.state.value}}
              {{on "change" (fn handleChange field)}}
            />
          </label>
          {{#each field.state.meta.errors as |err|}}
            <div>{{err}}</div>
          {{/each}}
        </div>
      </this.form.Field>
    </div>
  </template>
}
```

This similarly works with `onBlurListenTo`, which will re-run the validation when the listened-to field is blurred.

> The `onChangeListenTo` array is declared at module scope so that the same array reference is passed to `@validators` on every render. If you build it inline (e.g. via the `array` helper) it would be a fresh reference each render, which can cause unnecessary churn. A `@cached` getter on the component works equally well if you need the list to depend on component state.
