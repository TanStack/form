import { render } from '@testing-library/angular'
import { Component } from '@angular/core'
import { describe, expect, it } from 'vitest'
import { injectForm } from '../inject-form'
import { TanStackField } from '../tanstack-field.directive'

describe('TanStackFieldDirective', () => {
  it('should allow to set default value', async () => {
    @Component({
      selector: 'test-component',
      standalone: true,
      template: `
        <ng-template [tanstackField]="form" name="firstName" let-field>
          <input
            data-testid="fieldinput"
            [value]="field.state.value"
            (blur)="field.handleBlur()"
            (input)="field.handleChange($any($event).target.value)"
          />
        </ng-template>
      `,
      imports: [TanStackField],
    })
    class TestComponent {
      form = injectForm({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        },
      })
    }

    const { getByTestId } = await render(TestComponent)

    const input = getByTestId('fieldinput')
    expect(input).toHaveValue('FirstName')
  })

  it('should use field default value first', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    @Component({
      selector: 'test-component',
      standalone: true,
      template: `
        <ng-template
          [tanstackField]="form"
          name="firstName"
          defaultValue="otherName"
          let-field
        >
          <input
            data-testid="fieldinput"
            [value]="field.state.value"
            (blur)="field.handleBlur()"
            (input)="field.handleChange($any($event).target.value)"
          />
        </ng-template>
      `,
      imports: [TanStackField],
    })
    class TestComponent {
      form = injectForm<Person>({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        },
      })
    }

    const { getByTestId } = await render(TestComponent)

    const input = getByTestId('fieldinput')
    expect(input).toHaveValue('otherName')
  })
})
