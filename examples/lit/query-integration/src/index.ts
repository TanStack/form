import { LitElement, html, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'
import {
  MutationObserver,
  QueryClient,
  QueryObserver,
  keepPreviousData,
} from '@tanstack/query-core'
import { TanStackFormController, formOptions } from '@tanstack/lit-form'
import { db, sleep } from './mock-db'
import type { AnyFieldApi } from '@tanstack/lit-form'
import type { QueryObserverResult } from '@tanstack/query-core'
import type { StoredUser } from './mock-db'

const emptyUser: StoredUser = {
  firstName: '',
  lastName: '',
}

function fieldInfo(field: AnyFieldApi) {
  return html`
    ${
      field.meta.isInvalid
        ? html`<em role="alert">
            ${field.errors.map((error) => error.message).join(', ')}
          </em>`
        : nothing
    }
    ${field.meta.isValidating ? 'Validating...' : nothing}
  `
}

@customElement('tanstack-query-form')
export class TanStackQueryForm extends LitElement {
  private queryClient = new QueryClient()
  private userQuery = new QueryObserver(this.queryClient, {
    queryKey: ['data'],
    queryFn: () => db.getData(),
    placeholderData: keepPreviousData,
  })
  private userResult: QueryObserverResult<StoredUser> =
    this.userQuery.getCurrentResult()
  private unsubscribeQuery?: () => void
  private currentDefaults = emptyUser

  private saveUser = new MutationObserver(this.queryClient, {
    mutationFn: (value: StoredUser) => db.saveUser(value),
    onSuccess: async () => {
      await this.userQuery.refetch()
    },
  })

  private form = new TanStackFormController(this, this.formOptions(emptyUser))

  protected createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.unsubscribeQuery = this.userQuery.subscribe((result) => {
      this.userResult = result
      if (result.data && result.data !== this.currentDefaults) {
        this.currentDefaults = result.data
        this.form.update(this.formOptions(result.data))
      }
      this.requestUpdate()
    })
  }

  disconnectedCallback() {
    this.unsubscribeQuery?.()
    this.unsubscribeQuery = undefined
    super.disconnectedCallback()
  }

  private formOptions(defaultValues: StoredUser) {
    return formOptions({
      defaultValues,
      onSubmit: async ({ formApi, value }) => {
        await this.saveUser.mutate(value)
        formApi.reset(value)
      },
      errorVisibility: ({ fieldState }) => fieldState.meta.isTouched,
    })
  }

  render() {
    if (this.userResult.isPending) return html`<p>Loading...</p>`

    return html`
      <h1>Query Integration Form Example</h1>
      <form
        @submit=${(event: SubmitEvent) => {
          event.preventDefault()
          event.stopPropagation()
          void this.form.api.handleSubmit()
        }}
      >
        ${this.form.field(
          {
            name: 'firstName',
            validators: [
              {
                run: ({ value }) =>
                  !value
                    ? 'A first name is required'
                    : value.length < 3
                      ? 'First name must be at least 3 characters'
                      : undefined,
                triggers: ['change'],
              },
              {
                run: async ({ value }) => {
                  await sleep(1000)
                  return value.includes('error')
                    ? 'No "error" allowed in first name'
                    : undefined
                },
                triggers: ['change'],
                triggerDebounceMs: 500,
              },
            ],
          },
          (field) => this.renderField(field, 'First Name'),
        )}
        ${this.form.field({ name: 'lastName' }, (field) =>
          this.renderField(field, 'Last Name'),
        )}
        ${this.form.subscribe(
          (state) => [state.canSubmit, state.isSubmitting] as const,
          ([canSubmit, isSubmitting]) => html`
            <button type="submit" ?disabled=${!canSubmit || isSubmitting}>
              ${isSubmitting ? '...' : 'Submit'}
            </button>
            <button
              type="reset"
              @click=${(event: Event) => {
                event.preventDefault()
                this.form.api.reset()
              }}
            >
              Reset
            </button>
          `,
        )}
      </form>
    `
  }

  private renderField(field: AnyFieldApi, label: string) {
    return html`
      <div>
        <label for=${field.name}>${label}:</label>
        <input
          id=${field.name}
          name=${field.name}
          .value=${field.value}
          @blur=${() => field.handleBlur()}
          @input=${(event: InputEvent) =>
            field.handleChange((event.currentTarget as HTMLInputElement).value)}
          aria-invalid=${field.meta.isInvalid ? 'true' : 'false'}
        />
        ${fieldInfo(field)}
      </div>
    `
  }
}
