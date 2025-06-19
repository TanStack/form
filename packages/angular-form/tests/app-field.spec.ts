import { render } from '@testing-library/angular'
import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { describe, expect, it } from 'vitest'
import {
  TanStackAppField,
  TanStackField,
  injectField,
  injectForm,
} from '../src/index'

describe('TanStackAppField', () => {
  it('should render a field with the correct label and default value', async () => {
    @Component({
      selector: 'app-text-field',
      changeDetection: ChangeDetectionStrategy.OnPush,
      standalone: true,
      template: `
        <label [for]="field.api.name">{{ label() }}</label>
        <input
          [id]="field.api.name"
          [name]="field.api.name"
          [value]="field.api.state.value"
          (blur)="field.api.handleBlur()"
          (input)="field.api.handleChange($any($event).target.value)"
        />
      `,
    })
    class AppTextField {
      label = input.required<string>()
      field = injectField<string>()
    }

    @Component({
      selector: 'app-root',
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [TanStackField, TanStackAppField, AppTextField],
      template: `
        <form (submit)="handleSubmit($event)">
          <app-text-field
            label="Last name:"
            tanstack-app-field
            [tanstackField]="form"
            name="lastName"
          />
        </form>
      `,
    })
    class AppComponent {
      form = injectForm({
        defaultValues: {
          firstName: '',
          lastName: 'Doe',
        },
        onSubmit({ value }) {
          console.log(value)
        },
      })

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
