import {
  Component,
  inject,
  Injectable,
  input,
  type OnChanges,
  type OnDestroy,
  type OnInit,
  signal,
} from '@angular/core'
import { TanStackField, injectForm, injectStore } from '@tanstack/angular-form'
import type {
  AnyFormApi,
  FieldApi,
  FieldValidateAsyncFn,
  FieldValidateFn,
} from '@tanstack/angular-form'

@Injectable()
class TanStackFieldInjectable<T> {
  field = signal<
    FieldApi<
      any,
      any,
      T,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >
  >(null as never)
}

function injectProvideField(form: AnyFormApi) {
  const base = inject(TanStackFieldInjectable)
  base.field.set(form)
}

@Component({
  selector: 'tanstack-app-field',
  standalone: true,
  template: ` <ng-content></ng-content> `,
  providers: [TanStackFieldInjectable],
})
class TanStackFieldComponent extends TanStackField<
  // TODO: Infer this, don't make it `any`
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
> {
  _ = injectProvideField(this.tanstackField)
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanStackField],
  template: `
    <form (submit)="handleSubmit($event)">
      <div>
        <tanstack-app-field
          [tanstackField]="form"
          name="firstName"
          [validators]="{
            onChange: firstNameValidator,
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: firstNameAsyncValidator,
          }"
          #firstName="field"
        >
          <app-text-field />
        </tanstack-app-field>
      </div>
      <div>
        <ng-container [tanstackField]="form" name="lastName" #lastName="field">
          <label [for]="lastName.api.name">Last Name:</label>
          <input
            [id]="lastName.api.name"
            [name]="lastName.api.name"
            [value]="lastName.api.state.value"
            (blur)="lastName.api.handleBlur()"
            (input)="lastName.api.handleChange($any($event).target.value)"
          />
        </ng-container>
      </div>
      <button type="submit" [disabled]="!canSubmit()">
        {{ isSubmitting() ? '...' : 'Submit' }}
      </button>
      <button type="reset" (click)="form.reset()">Reset</button>
    </form>
  `,
})
export class AppComponent {
  firstNameValidator: FieldValidateFn<any, string, any> = ({ value }) =>
    !value
      ? 'A first name is required'
      : value.length < 3
        ? 'First name must be at least 3 characters'
        : undefined

  firstNameAsyncValidator: FieldValidateAsyncFn<any, string, any> = async ({
    value,
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return value.includes('error') && 'No "error" allowed in first name'
  }

  form = injectForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit({ value }) {
      // Do something with form data
      console.log(value)
    },
  })

  canSubmit = injectStore(this.form, (state) => state.canSubmit)
  isSubmitting = injectStore(this.form, (state) => state.isSubmitting)

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.form.handleSubmit()
  }
}
