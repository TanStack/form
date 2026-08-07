import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core'
import {
  QueryClient,
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental'
import {
  TanStackField,
  injectForm,
  injectSelector,
} from '@tanstack/angular-form'
import { db, sleep } from './mock-db'
import type { StoredUser } from './mock-db'

const emptyUser: StoredUser = { firstName: '', lastName: '' }

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackField],
  template: `
    <main>
      @if (userQuery.isPending()) {
        <p>Loading...</p>
      } @else if (userQuery.isError()) {
        <p role="alert">{{ userQuery.error().message }}</p>
      } @else {
        <h1>Query Integration Form Example</h1>
        <form (submit)="handleSubmit($event)">
          <ng-container
            [tanstackField]="form"
            name="firstName"
            [validators]="firstNameValidators"
            #firstName="field"
          >
            <label>
              <span>First Name</span>
              <input
                [name]="firstName.api.name"
                [value]="firstName.api.value"
                (blur)="firstName.api.handleBlur()"
                (input)="firstName.api.handleChange($any($event).target.value)"
                [attr.aria-invalid]="firstName.api.meta.isInvalid"
              />
              @for (error of firstName.api.errors; track error) {
                <small role="alert">{{ error.message }}</small>
              }
            </label>
          </ng-container>
          <ng-container
            [tanstackField]="form"
            name="lastName"
            #lastName="field"
          >
            <label>
              <span>Last Name</span>
              <input
                [name]="lastName.api.name"
                [value]="lastName.api.value"
                (blur)="lastName.api.handleBlur()"
                (input)="lastName.api.handleChange($any($event).target.value)"
              />
            </label>
          </ng-container>
          <div class="actions">
            <button type="submit" [disabled]="!canSubmit()">
              {{ isSubmitting() ? '...' : 'Submit' }}
            </button>
            <button type="button" (click)="form.reset()">Reset</button>
          </div>
        </form>
      }
    </main>
  `,
})
export class AppComponent {
  private queryClient = inject(QueryClient)
  userQuery = injectQuery(() => ({
    queryKey: ['user'],
    queryFn: () => db.getData(),
  }))
  saveUser = injectMutation(() => ({
    mutationFn: (value: StoredUser) => db.saveUser(value),
    onSuccess: () => this.queryClient.invalidateQueries({ queryKey: ['user'] }),
  }))

  firstNameValidators = [
    {
      run: ({ value }: { value: string }) =>
        !value
          ? 'A first name is required'
          : value.length < 3
            ? 'First name must be at least 3 characters'
            : undefined,
      triggers: ['change'] as const,
    },
    {
      run: async ({ value }: { value: string }) => {
        await sleep(1000)
        return value.includes('error')
          ? 'No "error" allowed in first name'
          : undefined
      },
      triggers: ['change'] as const,
      triggerDebounceMs: 500,
    },
  ]

  form = injectForm({
    defaultValues: emptyUser,
    errorVisibility: ({ fieldState }) => fieldState.meta.isTouched,
    onSubmit: async ({ formApi, value }) => {
      await this.saveUser.mutateAsync(value)
      formApi.reset(value)
    },
  })
  canSubmit = injectSelector(this.form, (state) => state.canSubmit)
  isSubmitting = injectSelector(this.form, (state) => state.isSubmitting)

  constructor() {
    effect(() => {
      const user = this.userQuery.data()
      if (user && !this.form.state.isTouched) this.form.reset(user)
    })
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.form.handleSubmit()
  }
}
