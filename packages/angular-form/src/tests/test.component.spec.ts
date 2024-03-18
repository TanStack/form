import { render } from '@testing-library/angular'
import { Component } from '@angular/core'
import { describe, expect, it } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { injectForm } from '../inject-form'
import { TanStackField } from '../tanstack-field.directive'
import type { FieldValidateFn } from '@tanstack/form-core'

const user = userEvent.setup()

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

  it('should not validate on change if isTouched is false', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const error = 'Please enter a different value'

    @Component({
      selector: 'test-component',
      standalone: true,
      template: `
        <ng-template
          [tanstackField]="form"
          name="firstName"
          [validators]="{ onChange: otherValidator }"
          let-field
        >
          <input
            data-testid="fieldinput"
            [value]="field.state.value"
            (blur)="field.handleBlur()"
            (input)="field.setValue($any($event).target.value)"
          />
          @for (error of field.getMeta().errors; track error) {
            <p>{{ error }}</p>
          }
        </ng-template>
      `,
      imports: [TanStackField],
    })
    class TestComponent {
      otherValidator: FieldValidateFn<Person, 'firstName'> = ({ value }) =>
        value === 'other' ? error : undefined

      form = injectForm<Person>({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        },
      })
    }

    const { getByTestId, queryByText } = await render(TestComponent)
    const input = getByTestId('fieldinput')
    await user.type(input, 'other')
    expect(queryByText(error)).not.toBeInTheDocument()
  })

  it('should validate on change if isTouched is true', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const error = 'Please enter a different value'

    @Component({
      selector: 'test-component',
      standalone: true,
      template: `
        <ng-template
          [tanstackField]="form"
          name="firstName"
          [defaultMeta]="{ isTouched: true }"
          [validators]="{ onChange: otherValidator }"
          let-field
        >
          <input
            data-testid="fieldinput"
            [value]="field.state.value"
            (blur)="field.handleBlur()"
            (input)="field.handleChange($any($event).target.value)"
          />
          <p>{{ field.getMeta().errorMap?.onChange }}</p>
        </ng-template>
      `,
      imports: [TanStackField],
    })
    class TestComponent {
      otherValidator: FieldValidateFn<Person, 'firstName'> = ({ value }) =>
        value === 'other' ? error : undefined

      form = injectForm<Person>({
        defaultValues: {
          firstName: '',
          lastName: '',
        },
      })
    }

    const { getByTestId, queryByText, getByText } = await render(TestComponent)

    const input = getByTestId('fieldinput')
    expect(queryByText(error)).not.toBeInTheDocument()
    await user.type(input, 'other')
    expect(getByText(error)).toBeInTheDocument()
  })
})
