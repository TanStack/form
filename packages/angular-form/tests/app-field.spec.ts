import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { render } from '@testing-library/angular'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import {
  TanStackAppField,
  TanStackField,
  injectField,
  injectForm,
} from '../src/index'

describe('TanStackAppField', () => {
  it('provides the v2 field API to a child component', async () => {
    @Component({
      selector: 'app-text-field',
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
        <label [for]="field.api.name">{{ label() }}</label>
        <input
          [id]="field.api.name"
          [name]="field.api.name"
          [value]="field.api.value"
          (blur)="field.api.handleBlur()"
          (input)="field.api.handleChange($any($event).target.value)"
        />
        <output data-testid="value">{{ field.api.value }}</output>
      `,
    })
    class AppTextField {
      label = input.required<string>()
      field = injectField<string>()
    }

    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [TanStackField, TanStackAppField, AppTextField],
      template: `
        <app-text-field
          label="Last name:"
          tanstack-app-field
          [tanstackField]="form"
          name="lastName"
        />
      `,
    })
    class AppComponent {
      form = injectForm({
        defaultValues: { firstName: '', lastName: 'Lovelace' },
      })
    }

    const screen = await render(AppComponent)
    const lastNameInput = screen.getByLabelText('Last name:')
    const user = userEvent.setup()
    expect(lastNameInput).toHaveValue('Lovelace')
    await user.clear(lastNameInput)
    await user.type(lastNameInput, 'Hopper')
    expect(screen.getByTestId('value')).toHaveTextContent('Hopper')
  })
})
