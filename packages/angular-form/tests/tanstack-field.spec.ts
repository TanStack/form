import { ChangeDetectionStrategy, Component } from '@angular/core'
import { render } from 'vitest-browser-angular'
import { userEvent } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import {
  TanStackArrayField,
  TanStackField,
  injectForm,
  injectSelector,
} from '../src/index'
import { sleep } from './utils'
import type { FieldValidatorFn } from '@tanstack/form-core'

describe('TanStackField', () => {
  it('reads and updates a form-level default value', async () => {
    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [TanStackField],
      template: `
        <ng-container [tanstackField]="form" name="firstName" #field="field">
          <input
            aria-label="First name"
            [value]="field.api.value"
            (blur)="field.api.handleBlur()"
            (input)="field.api.handleChange($any($event).target.value)"
          />
          <output data-testid="value">{{ field.api.value }}</output>
        </ng-container>
        <button
          type="button"
          (click)="form.reset({ firstName: 'Katherine', lastName: 'Johnson' })"
        >
          Reset
        </button>
      `,
    })
    class TestComponent {
      form = injectForm({
        defaultValues: { firstName: 'Ada', lastName: 'Lovelace' },
      })
    }

    const screen = await render(TestComponent)
    const input = screen.getByLabelText('First name')

    expect(input).toHaveValue('Ada')
    await input.clear()
    await userEvent.type(input, 'Grace')
    expect(screen.getByTestId('value')).toHaveTextContent('Grace')
    await screen.getByRole('button', { name: 'Reset' }).click()
    expect(input).toHaveValue('Katherine')
  })

  it('supports ordered change and blur validators with v2 issues', async () => {
    type Person = { firstName: string }
    const changeMessage = 'Name is too short'
    const blurMessage = 'Name must not be Ada'

    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [TanStackField],
      template: `
        <ng-container
          [tanstackField]="form"
          name="firstName"
          [validators]="validators"
          [errorVisibility]="showErrors"
          #field="field"
        >
          <input
            aria-label="First name"
            [value]="field.api.value"
            (blur)="field.api.handleBlur()"
            (input)="field.api.handleChange($any($event).target.value)"
          />
          @for (error of field.api.errors; track error) {
            <p role="alert">{{ error.message }}</p>
          }
        </ng-container>
        <button type="button">Next</button>
      `,
    })
    class TestComponent {
      showErrors = () => true
      validators = [
        {
          triggers: ['change'] as const,
          run: (({ value }) =>
            value.length < 3
              ? { message: changeMessage }
              : undefined) satisfies FieldValidatorFn<
            Person,
            'firstName',
            string
          >,
        },
        {
          triggers: ['blur'] as const,
          run: (({ value }) =>
            value === 'Ada'
              ? { message: blurMessage }
              : undefined) satisfies FieldValidatorFn<
            Person,
            'firstName',
            string
          >,
        },
      ]
      form = injectForm({ defaultValues: { firstName: 'Ada' } as Person })
    }

    const screen = await render(TestComponent)
    const input = screen.getByLabelText('First name')

    await input.click()
    await userEvent.tab()
    await expect.element(screen.getByText(blurMessage)).toBeInTheDocument()
    await input.click()
    await input.clear()
    await userEvent.type(input, 'A')
    expect(screen.getByText(changeMessage)).toBeInTheDocument()
  })

  it('supports async validators and triggerDebounceMs', async () => {
    @Component({
      standalone: true,
      imports: [TanStackField],
      template: `
        <ng-container
          [tanstackField]="form"
          name="name"
          [validators]="validators"
          [errorVisibility]="showErrors"
          #field="field"
        >
          <input
            aria-label="Name"
            [value]="field.api.value"
            (input)="field.api.handleChange($any($event).target.value)"
          />
          @for (error of field.api.errors; track error) {
            <p role="alert">{{ error.message }}</p>
          }
        </ng-container>
      `,
    })
    class TestComponent {
      showErrors = () => true
      validators = [
        {
          triggers: ['change'] as const,
          triggerDebounceMs: 1,
          run: async () => {
            await sleep(5)
            return { message: 'Async issue' }
          },
        },
      ]
      form = injectForm({ defaultValues: { name: '' } })
    }

    const screen = await render(TestComponent)
    await userEvent.type(screen.getByLabelText('Name'), 'x')
    await expect
      .element(screen.getByRole('alert'))
      .toHaveTextContent('Async issue')
  })

  it('supports ordered v2 field listeners', async () => {
    const listener = vi.fn()

    @Component({
      standalone: true,
      imports: [TanStackField],
      template: `
        <ng-container
          [tanstackField]="form"
          name="name"
          [listeners]="listeners"
          #field="field"
        >
          <input
            aria-label="Name"
            [value]="field.api.value"
            (input)="field.api.handleChange($any($event).target.value)"
          />
        </ng-container>
      `,
    })
    class TestComponent {
      listeners = [{ triggers: ['change'] as const, run: listener }]
      form = injectForm({ defaultValues: { name: '' } })
    }

    const screen = await render(TestComponent)
    await userEvent.type(screen.getByLabelText('Name'), 'A')
    expect(listener).toHaveBeenCalled()
  })
})

describe('TanStackArrayField', () => {
  it('rerenders for structural array changes', async () => {
    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [TanStackArrayField],
      template: `
        <ng-container
          [tanstackArrayField]="form"
          name="items"
          #field="arrayField"
        >
          <output data-testid="items">{{ field.api.value.join(',') }}</output>
          <button type="button" (click)="form.swapFieldValues('items', 0, 1)">
            Swap
          </button>
        </ng-container>
      `,
    })
    class TestComponent {
      form = injectForm({ defaultValues: { items: ['one', 'two'] } })
    }

    const screen = await render(TestComponent)
    expect(screen.getByTestId('items')).toHaveTextContent('one,two')
    await screen.getByRole('button', { name: 'Swap' }).click()
    expect(screen.getByTestId('items')).toHaveTextContent('two,one')
  })
})

describe('injectSelector', () => {
  it('exposes selected form state as an Angular signal', async () => {
    @Component({
      standalone: true,
      imports: [TanStackField],
      template: `
        <ng-container [tanstackField]="form" name="name" #field="field">
          <input
            aria-label="Name"
            [value]="field.api.value"
            (input)="field.api.handleChange($any($event).target.value)"
          />
        </ng-container>
        <output data-testid="name">{{ name() }}</output>
      `,
    })
    class TestComponent {
      form = injectForm({ defaultValues: { name: 'Ada' } })
      name = injectSelector(this.form, (state) => state.values.name)
    }

    const screen = await render(TestComponent)
    await screen.getByLabelText('Name').clear()
    await userEvent.type(screen.getByLabelText('Name'), 'Grace')
    expect(screen.getByTestId('name')).toHaveTextContent('Grace')
  })
})
