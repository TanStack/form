import { render } from '@testing-library/angular'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { describe, expect, it } from 'vitest'
import { formOptions } from '@tanstack/form-core'
import {
  TanStackField,
  TanStackWithForm,
  injectForm,
  injectWithForm,
} from '../src/index'

describe('TanStackWithForm', () => {
  it('should provide a form via injection to a child component with inferred types', async () => {
    const personFormOpts = formOptions({
      defaultValues: {
        firstName: '',
        lastName: 'Doe',
      },
    })

    @Component({
      selector: 'app-child-form',
      changeDetection: ChangeDetectionStrategy.OnPush,
      standalone: true,
      imports: [TanStackField],
      template: `
        <ng-container
          [tanstackField]="withForm.form"
          name="lastName"
          #field="field"
        >
          <label [for]="field.api.name">Last name:</label>
          <input
            [id]="field.api.name"
            [name]="field.api.name"
            [value]="field.api.state.value"
            (blur)="field.api.handleBlur()"
            (input)="field.api.handleChange($any($event).target.value)"
          />
        </ng-container>
      `,
    })
    class ChildForm {
      // Types of `withForm.form` are inferred from the form options passed in.
      withForm = injectWithForm({ ...personFormOpts })
    }

    @Component({
      selector: 'app-root',
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [TanStackWithForm, ChildForm],
      template: `
        <form (submit)="handleSubmit($event)">
          <app-child-form tanstack-with-form [form]="form" />
        </form>
      `,
    })
    class AppComponent {
      form = injectForm({ ...personFormOpts })

      handleSubmit(event: SubmitEvent) {
        event.preventDefault()
        event.stopPropagation()
        this.form.handleSubmit()
      }
    }

    const { getByLabelText } = await render(AppComponent)

    const ourInput = getByLabelText('Last name:')
    expect(ourInput).toBeInTheDocument()
    expect(ourInput).toHaveValue('Doe')
  })
})
