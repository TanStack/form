import { render } from '@testing-library/angular'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { describe, expect, it } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { TanStackField, injectForm } from '../src/index'
import { sleep } from './utils'
import type { FieldValidateAsyncFn, FieldValidateFn } from '@tanstack/form-core'

const user = userEvent.setup()

describe('TanStackFieldDirective', () => {
  it('should allow to set default value', async () => {
    @Component({
      selector: 'test-component',
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
        <ng-container [tanstackField]="form" name="firstName" #f="field">
          <input
            data-testid="fieldinput"
            [value]="f.api.state.value"
            (blur)="f.api.handleBlur()"
            (input)="f.api.handleChange($any($event).target.value)"
          />
        </ng-container>
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
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
        <ng-container
          [tanstackField]="form"
          name="firstName"
          defaultValue="otherName"
          #f="field"
        >
          <input
            data-testid="fieldinput"
            [value]="f.api.state.value"
            (blur)="f.api.handleBlur()"
            (input)="f.api.handleChange($any($event).target.value)"
          />
        </ng-container>
      `,
      imports: [TanStackField],
    })
    class TestComponent {
      form = injectForm({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        } as Person,
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
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
        <ng-container
          [tanstackField]="form"
          name="firstName"
          [validators]="{ onChange: otherValidator }"
          #f="field"
        >
          <input
            data-testid="fieldinput"
            [value]="f.api.state.value"
            (blur)="f.api.handleBlur()"
            (input)="
              f.api.setValue($any($event).target.value, {
                dontUpdateMeta: true,
              })
            "
          />
          @for (error of f.api.getMeta().errors; track error) {
            <p>{{ error }}</p>
          }
        </ng-container>
      `,
      imports: [TanStackField],
    })
    class TestComponent {
      otherValidator: FieldValidateFn<Person, 'firstName'> = ({ value }) =>
        value === 'other' ? error : undefined

      form = injectForm({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        } as Person,
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
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
        <ng-container
          [tanstackField]="form"
          name="firstName"
          [defaultMeta]="{ isTouched: true }"
          [validators]="{ onChange: otherValidator }"
          #f="field"
        >
          <input
            data-testid="fieldinput"
            [value]="f.api.state.value"
            (blur)="f.api.handleBlur()"
            (input)="f.api.handleChange($any($event).target.value)"
          />
          <p>{{ f.api.getMeta().errorMap?.onChange }}</p>
        </ng-container>
      `,
      imports: [TanStackField],
    })
    class TestComponent {
      otherValidator: FieldValidateFn<Person, 'firstName'> = ({ value }) =>
        value === 'other' ? error : undefined

      form = injectForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        } as Person,
      })
    }

    const { getByTestId, queryByText, getByText } = await render(TestComponent)

    const input = getByTestId('fieldinput')
    expect(queryByText(error)).not.toBeInTheDocument()
    await user.type(input, 'other')
    expect(getByText(error)).toBeInTheDocument()
  })

  it('should validate on change and on blur', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const onChangeError = 'Please enter a different value (onChangeError)'
    const onBlurError = 'Please enter a different value (onBlurError)'

    @Component({
      selector: 'test-component',
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
        <ng-container
          [tanstackField]="form"
          name="firstName"
          [defaultMeta]="{ isTouched: true }"
          [validators]="{ onChange: onChange, onBlur: onBlur }"
          #f="field"
        >
          <input
            data-testid="fieldinput"
            [value]="f.api.state.value"
            [name]="f.api.name"
            (blur)="f.api.handleBlur()"
            (input)="
              f.api.setValue($any($event).target.value, {
                dontUpdateMeta: true,
              })
            "
          />
          <p>{{ f.api.getMeta().errorMap?.onChange }}</p>
          <p>{{ f.api.getMeta().errorMap?.onBlur }}</p>
        </ng-container>
      `,
      imports: [TanStackField],
    })
    class TestComponent {
      onChange: FieldValidateFn<Person, 'firstName'> = ({ value }) =>
        value === 'other' ? onChangeError : undefined
      onBlur: FieldValidateFn<Person, 'firstName'> = ({ value }) =>
        value === 'other' ? onBlurError : undefined

      form = injectForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        } as Person,
      })
    }

    const { getByTestId, getByText, queryByText } = await render(TestComponent)
    const input = getByTestId('fieldinput')
    expect(queryByText(onChangeError)).not.toBeInTheDocument()
    expect(queryByText(onBlurError)).not.toBeInTheDocument()
    await user.type(input, 'other')
    expect(getByText(onChangeError)).toBeInTheDocument()
    await user.click(document.body)
    expect(queryByText(onBlurError)).toBeInTheDocument()
  })

  it('should validate async on change', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const error = 'Please enter a different value'

    @Component({
      selector: 'test-component',
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
        <ng-container
          [tanstackField]="form"
          name="firstName"
          [defaultMeta]="{ isTouched: true }"
          [validators]="{ onChangeAsync: onChangeAsync }"
          #f="field"
        >
          <input
            data-testid="fieldinput"
            [name]="f.api.name"
            [value]="f.api.state.value"
            (blur)="f.api.handleBlur()"
            (input)="f.api.handleChange($any($event).target.value)"
          />
          <p>{{ f.api.getMeta().errorMap?.onChange }}</p>
        </ng-container>
      `,
      imports: [TanStackField],
    })
    class TestComponent {
      onChangeAsync: FieldValidateAsyncFn<Person, 'firstName'> = async () => {
        await sleep(10)
        return error
      }

      form = injectForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        } as Person,
      })
    }

    const { getByTestId, getByText, findByText, queryByText } =
      await render(TestComponent)
    const input = getByTestId('fieldinput')
    expect(queryByText(error)).not.toBeInTheDocument()
    await user.type(input, 'other')
    await findByText(error)
    expect(getByText(error)).toBeInTheDocument()
  })

  it('should validate async on change and async on blur', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const onChangeError = 'Please enter a different value (onChangeError)'
    const onBlurError = 'Please enter a different value (onBlurError)'

    @Component({
      selector: 'test-component',
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
        <ng-container
          [tanstackField]="form"
          name="firstName"
          [defaultMeta]="{ isTouched: true }"
          [validators]="{
            onChangeAsync: onChangeAsync,
            onBlurAsync: onBlurAsync,
          }"
          #f="field"
        >
          <input
            data-testid="fieldinput"
            [name]="f.api.name"
            [value]="f.api.state.value"
            (blur)="f.api.handleBlur()"
            (input)="f.api.handleChange($any($event).target.value)"
          />
          <p>{{ f.api.getMeta().errorMap?.onChange }}</p>
          <p>{{ f.api.getMeta().errorMap?.onBlur }}</p>
        </ng-container>
      `,
      imports: [TanStackField],
    })
    class TestComponent {
      onChangeAsync: FieldValidateAsyncFn<Person, 'firstName'> = async () => {
        await sleep(10)
        return onChangeError
      }

      onBlurAsync: FieldValidateAsyncFn<Person, 'firstName'> = async () => {
        await sleep(10)
        return onBlurError
      }

      form = injectForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        } as Person,
      })
    }

    const { getByTestId, getByText, findByText, queryByText } =
      await render(TestComponent)
    const input = getByTestId('fieldinput')

    expect(queryByText(onChangeError)).not.toBeInTheDocument()
    expect(queryByText(onBlurError)).not.toBeInTheDocument()
    await user.type(input, 'other')
    await findByText(onChangeError)
    expect(getByText(onChangeError)).toBeInTheDocument()
    await user.click(document.body)
    await findByText(onBlurError)
    expect(getByText(onBlurError)).toBeInTheDocument()
  })
})

describe('form should reset when rendered correctly - angular', () => {
  it('should be able to handle async resets', async () => {
    @Component({
      selector: 'test-component',
      standalone: true,
      template: `
        <ng-container [tanstackField]="form" name="name" #f="field">
          <input
            data-testid="fieldinput"
            [value]="f.api.state.value"
            (input)="f.api.handleChange($any($event).target.value)"
          />
        </ng-container>
        <button
          type="button"
          (click)="form.handleSubmit()"
          data-testid="submit"
        >
          submit
        </button>
      `,
      imports: [TanStackField],
    })
    class TestComponent {
      form = injectForm({
        defaultValues: {
          name: '',
        },
        onSubmit: ({ value }) => {
          expect(value).toEqual({ name: 'test' })
          this.form.reset({ name: 'test' })
        },
      })
    }

    const { getByTestId } = await render(TestComponent)

    const input = getByTestId('fieldinput')
    const submit = getByTestId('submit')

    await user.type(input, 'test')
    await expect(input).toHaveValue('test')

    await user.click(submit)

    await expect(input).toHaveValue('test')
  })
})
