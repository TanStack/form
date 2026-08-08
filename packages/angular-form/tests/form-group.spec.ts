import { Component, signal } from '@angular/core'
import { render } from '@testing-library/angular'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TanStackField, TanStackFormGroup, injectForm } from '../src/index'
import type { FormGroupValidators } from '@tanstack/form-core'

describe('TanStackFormGroup', () => {
  it('maps group-relative field options through the core group API', async () => {
    @Component({
      standalone: true,
      imports: [TanStackField, TanStackFormGroup],
      template: `
        <ng-container
          [tanstackFormGroup]="form"
          name="guest"
          #group="formGroup"
        >
          <ng-container
            [tanstackField]="group.api"
            name="name"
            #name="field"
          >
            <button type="button" (click)="name.api.handleChange('A')">
              Change name
            </button>
          </ng-container>
          <ng-container
            [tanstackField]="group.api"
            name="confirmation"
            [validators]="fieldValidators"
            [listeners]="fieldListeners"
            #confirmation="field"
          >
            <output>{{ confirmation.api.name }}</output>
          </ng-container>
        </ng-container>
      `,
    })
    class TestComponent {
      validator = vi.fn(() => undefined)
      listener = vi.fn()
      fieldValidators = [
        {
          triggers: ['change'] as const,
          watchFields: ['name'] as const,
          run: this.validator,
        },
      ]
      fieldListeners = [
        {
          triggers: ['change'] as const,
          watchFields: ['name'] as const,
          run: this.listener,
        },
      ]
      form = injectForm({
        defaultValues: { guest: { name: '', confirmation: '' } },
      })
    }

    const screen = await render(TestComponent)
    const user = userEvent.setup()

    expect(screen.getByText('guest.confirmation')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Change name' }))
    expect(screen.fixture.componentInstance.validator).toHaveBeenCalled()
    expect(screen.fixture.componentInstance.listener).toHaveBeenCalled()
  })

  it('validates and submits one scoped section of a form', async () => {
    @Component({
      standalone: true,
      imports: [TanStackField, TanStackFormGroup],
      template: `
        <ng-container
          [tanstackFormGroup]="form"
          name="step1"
          [validators]="groupValidators"
          [onSubmit]="advance"
          #group="formGroup"
        >
          <form (submit)="submitGroup($event, group.api)">
            <ng-container
              [tanstackField]="group.api"
              name="name"
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
            @for (error of group.api.state.errors; track error) {
              <p role="alert">{{ error.message }}</p>
            }
            <button type="submit">Next</button>
          </form>
        </ng-container>
        <output data-testid="step">{{ step() }}</output>
      `,
    })
    class TestComponent {
      step = signal(0)
      groupValidators = [
        {
          triggers: [],
          run: ({ value }) =>
            value.name.length < 2 ? 'Enter a name' : undefined,
        },
      ] satisfies FormGroupValidators<{ name: string }>
      advance = () => this.step.set(1)
      form = injectForm({
        defaultValues: { step1: { name: '' }, other: '' },
      })

      submitGroup(event: SubmitEvent, group: { handleSubmit: () => unknown }) {
        event.preventDefault()
        group.handleSubmit()
      }
    }

    const screen = await render(TestComponent)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Enter a name')
    await user.type(screen.getByLabelText('Name'), 'Ada')
    await user.click(screen.getByRole('button', { name: 'Next' }))
    await vi.waitFor(() => {
      expect(screen.getByTestId('step')).toHaveTextContent('1')
    })
  })
})
