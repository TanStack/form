import { render, waitFor } from '@testing-library/angular'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { describe, expect, it, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { TanStackField, TanStackFormGroup, injectForm } from '../src/index'

const user = userEvent.setup()

describe('TanStackFormGroupDirective', () => {
  it('should call onGroupSubmit but not the form onSubmit when submitting the group', async () => {
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()

    @Component({
      selector: 'test-component',
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
        <ng-container
          [tanstackFormGroup]="form"
          name="step1"
          [onGroupSubmit]="onGroupSubmit"
          #g="formGroup"
        >
          <form
            (submit)="
              $event.preventDefault();
              $event.stopPropagation();
              g.api.handleSubmit()
            "
          >
            <ng-container [tanstackField]="form" name="step1.name" #f="field">
              <input
                data-testid="step1-name"
                [value]="f.api.state.value"
                (input)="f.api.handleChange($any($event).target.value)"
              />
            </ng-container>
            <button type="submit" data-testid="submit-group">
              Submit Group
            </button>
          </form>
        </ng-container>
      `,
      imports: [TanStackField, TanStackFormGroup],
    })
    class TestComponent {
      onGroupSubmit = onGroupSubmit
      form = injectForm({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
        onSubmit,
      })
    }

    const { getByTestId } = await render(TestComponent)
    await user.click(getByTestId('submit-group'))

    await waitFor(() => expect(onGroupSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should expose group state value reactively', async () => {
    @Component({
      selector: 'test-component',
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
        <ng-container [tanstackFormGroup]="form" name="step1" #g="formGroup">
          <ng-container [tanstackField]="form" name="step1.name" #f="field">
            <input
              data-testid="step1-name"
              [value]="f.api.state.value"
              (input)="f.api.handleChange($any($event).target.value)"
            />
          </ng-container>
          <pre data-testid="group-value">{{
            stringify(g.api.state.value)
          }}</pre>
        </ng-container>
      `,
      imports: [TanStackField, TanStackFormGroup],
    })
    class TestComponent {
      stringify = JSON.stringify
      form = injectForm({
        defaultValues: {
          step1: { name: 'initial' },
          step2: { name: 'other' },
        },
      })
    }

    const { getByTestId } = await render(TestComponent)
    expect(getByTestId('group-value').textContent).toBe('{"name":"initial"}')

    await user.clear(getByTestId('step1-name'))
    await user.type(getByTestId('step1-name'), 'updated')

    await waitFor(() =>
      expect(getByTestId('group-value').textContent).toBe('{"name":"updated"}'),
    )
  })

  it('should call onGroupSubmitInvalid when group-level validation fails', async () => {
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    @Component({
      selector: 'test-component',
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
        <ng-container
          [tanstackFormGroup]="form"
          name="step1"
          [validators]="{ onSubmit: groupValidator }"
          [onGroupSubmit]="onGroupSubmit"
          [onGroupSubmitInvalid]="onGroupSubmitInvalid"
          #g="formGroup"
        >
          <form
            (submit)="
              $event.preventDefault();
              $event.stopPropagation();
              g.api.handleSubmit()
            "
          >
            <ng-container [tanstackField]="form" name="step1.name" #f="field">
              <input
                data-testid="step1-name"
                [value]="f.api.state.value"
                (input)="f.api.handleChange($any($event).target.value)"
              />
            </ng-container>
            <button type="submit" data-testid="submit-group">
              Submit Group
            </button>
            <pre data-testid="group-error">{{
              g.api.state.meta.errorMap.onSubmit ?? ''
            }}</pre>
          </form>
        </ng-container>
      `,
      imports: [TanStackField, TanStackFormGroup],
    })
    class TestComponent {
      onGroupSubmit = onGroupSubmit
      onGroupSubmitInvalid = onGroupSubmitInvalid
      groupValidator = ({ value }: { value: { name: string } }) =>
        !value.name ? 'Name is required' : undefined
      form = injectForm({
        defaultValues: {
          step1: { name: '' },
          step2: { name: 'test2' },
        },
        onSubmit,
      })
    }

    const { getByTestId } = await render(TestComponent)
    await user.click(getByTestId('submit-group'))

    await waitFor(() => expect(onGroupSubmitInvalid).toHaveBeenCalledTimes(1))
    expect(onGroupSubmit).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    await waitFor(() =>
      expect(getByTestId('group-error').textContent).toBe('Name is required'),
    )
  })

  it('should ignore form-level field errors outside the group when submitting the group', async () => {
    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    @Component({
      selector: 'test-component',
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
        <ng-container
          [tanstackFormGroup]="form"
          name="step1"
          [onGroupSubmit]="onGroupSubmit"
          [onGroupSubmitInvalid]="onGroupSubmitInvalid"
          #g="formGroup"
        >
          <form
            (submit)="
              $event.preventDefault();
              $event.stopPropagation();
              g.api.handleSubmit()
            "
          >
            <ng-container [tanstackField]="form" name="step1.name" #f="field">
              <input
                data-testid="step1-name"
                [value]="f.api.state.value"
                (input)="f.api.handleChange($any($event).target.value)"
              />
            </ng-container>
            <button type="submit" data-testid="submit-group">
              Submit Group
            </button>
          </form>
        </ng-container>
      `,
      imports: [TanStackField, TanStackFormGroup],
    })
    class TestComponent {
      onGroupSubmit = onGroupSubmit
      onGroupSubmitInvalid = onGroupSubmitInvalid
      form = injectForm({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
        validators: {
          onSubmit: () => ({
            fields: {
              'step2.name': 'Required',
            },
          }),
        },
      })
    }

    const { getByTestId } = await render(TestComponent)
    await user.click(getByTestId('submit-group'))

    await waitFor(() => expect(onGroupSubmit).toHaveBeenCalledTimes(1))
    expect(onGroupSubmitInvalid).not.toHaveBeenCalled()
  })

  it('should pass submit meta through handleSubmit', async () => {
    const onGroupSubmit = vi.fn()

    @Component({
      selector: 'test-component',
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
        <ng-container
          [tanstackFormGroup]="form"
          name="step1"
          [onGroupSubmit]="onGroupSubmit"
          [onSubmitMeta]="submitMeta"
          #g="formGroup"
        >
          <button
            type="button"
            data-testid="submit-group"
            (click)="g.api.handleSubmit({ source: 'button' })"
          >
            Submit Group
          </button>
        </ng-container>
      `,
      imports: [TanStackFormGroup],
    })
    class TestComponent {
      onGroupSubmit = onGroupSubmit
      submitMeta = {} as { source: string }
      form = injectForm({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      })
    }

    const { getByTestId } = await render(TestComponent)
    await user.click(getByTestId('submit-group'))

    await waitFor(() => expect(onGroupSubmit).toHaveBeenCalledTimes(1))
    expect(onGroupSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        value: { name: 'test' },
        meta: { source: 'button' },
      }),
    )
  })

  it('should rerender group.state.meta.isSubmitting during an async submit', async () => {
    let resolveSubmit!: () => void
    const onGroupSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve
        }),
    )

    @Component({
      selector: 'test-component',
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
        <ng-container
          [tanstackFormGroup]="form"
          name="step1"
          [onGroupSubmit]="onGroupSubmit"
          #g="formGroup"
        >
          <form
            (submit)="
              $event.preventDefault();
              $event.stopPropagation();
              g.api.handleSubmit()
            "
          >
            <button
              type="submit"
              data-testid="submit-group"
              [disabled]="g.api.state.meta.isSubmitting"
            >
              {{ g.api.state.meta.isSubmitting ? 'Saving...' : 'Continue' }}
            </button>
          </form>
        </ng-container>
      `,
      imports: [TanStackFormGroup],
    })
    class TestComponent {
      onGroupSubmit = onGroupSubmit
      form = injectForm({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      })
    }

    const { getByTestId } = await render(TestComponent)
    const button = getByTestId('submit-group') as HTMLButtonElement
    expect(button.textContent.trim()).toBe('Continue')
    expect(button.disabled).toBe(false)

    await user.click(button)

    await waitFor(() => expect(button.textContent.trim()).toBe('Saving...'))
    expect(button.disabled).toBe(true)

    resolveSubmit()

    await waitFor(() => expect(button.textContent.trim()).toBe('Continue'))
    expect(button.disabled).toBe(false)
    expect(onGroupSubmit).toHaveBeenCalledTimes(1)
  })
})
