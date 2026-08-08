---
id: async-initial-values
title: Async Initial Values
---

Forms often edit data loaded from an API. A server-state library should own
fetching, caching, loading, and retries; TanStack Form should own the editable
copy.

There are two supported approaches: wait to create the controller until the
data is ready, or create it immediately with complete fallback values. Choose
the one that matches the loading experience your element needs.

## Wait before creating the editor

Keep the controller optional, fetch the data, and create it only after complete
defaults exist:

```ts
import { LitElement, html } from 'lit'
import {
  TanStackFormController,
  formOptions,
  type LitFormType,
} from '@tanstack/lit-form'

type User = {
  firstName: string
  lastName: string
}

const userFormShape = formOptions({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
})

class UserEditor extends LitElement {
  private form?: LitFormType<typeof userFormShape>
  private loadError = false

  connectedCallback() {
    super.connectedCallback()
    void this.loadUser()
  }

  private async loadUser() {
    try {
      const response = await fetch('/api/users/1')
      const user = (await response.json()) as User

      this.form = new TanStackFormController(this, {
        defaultValues: user,
        onSubmit: async ({ value }) => {
          await fetch('/api/users/1', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(value),
          })
        },
      })
    } catch {
      this.loadError = true
    }
    this.requestUpdate()
  }

  render() {
    if (this.loadError) return html`<p role="alert">Could not load.</p>`
    if (!this.form) return html`<p>Loading…</p>`
    return html`<form><!-- fields --></form>`
  }
}
```

This is useful when no form state is needed during loading. Creating a fresh
editor for a different record also makes record changes explicit.

## Create the form before data arrives

Provide a static, shape-complete fallback, then call `form.update(...)` when
the query result changes. Keep option creation in one function so callbacks and
validation settings remain consistent.

```ts
import { TanStackFormController, formOptions } from '@tanstack/lit-form'

const emptyUser: User = {
  firstName: '',
  lastName: '',
}

class UserEditor extends LitElement {
  private form = new TanStackFormController(this, this.options(emptyUser))

  private options(defaultValues: User) {
    return formOptions({
      defaultValues,
      onSubmit: async ({ value }) => {
        await saveUser(value)
      },
    })
  }

  connectedCallback() {
    super.connectedCallback()
    void loadUser().then((user) => {
      this.form.update(this.options(user))
      this.requestUpdate()
    })
  }
}
```

When loaded data replaces the fallback, TanStack Form applies the new defaults
to untouched fields while preserving fields the user already touched. You can
hide the fields during loading or render the empty form immediately.

The repository's `examples/lit/query-integration` example demonstrates this
pattern with `QueryObserver` from TanStack Query Core.

## Background refetches and record changes

`defaultValues` establish the baseline; they are not a fully controlled
`values` property. Later `form.update(...)` calls preserve touched fields.

If a background refetch arrives while a user is editing, decide whether to keep
local edits, prompt before replacing them, or deliberately call
`form.api.reset(nextValues)`. Do not overwrite in-progress input merely because
a query refreshed.

When switching records, create a fresh editor element/controller or explicitly
reset the existing form. Otherwise, touched values from the previous record can
be preserved when new defaults arrive.
