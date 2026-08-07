---
id: async-initial-values
title: Async Initial Values
---

Forms often edit data loaded from an API. A server-state library such as
TanStack Query should own fetching, caching, loading, and retries; TanStack
Form should own the editable copy.

There are two useful patterns for async initial values in Angular: resolve the
data before constructing the form, or construct the form immediately with
complete fallback values and reset it when data arrives.

## Resolve data before constructing the editor

Angular Router resolvers can make the record available synchronously when the
editor component is constructed. This lets `defaultValues` start with the
complete loaded value.

```ts
import { Component, inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import type { ResolveFn, Routes } from '@angular/router'
import { injectForm } from '@tanstack/angular-form'

type User = {
  firstName: string
  lastName: string
}

export const userResolver: ResolveFn<User> = async (route) => {
  const response = await fetch(`/api/users/${route.paramMap.get('userId')}`)
  return response.json()
}

@Component({
  selector: 'app-user-editor',
  standalone: true,
  template: `<form><!-- fields --></form>`,
})
export class UserEditorComponent {
  private route = inject(ActivatedRoute)
  private user = this.route.snapshot.data['user'] as User

  form = injectForm({
    defaultValues: this.user,
    onSubmit: async ({ value }) => {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(value),
      })
    },
  })
}

export const routes: Routes = [
  {
    path: 'users/:userId',
    component: UserEditorComponent,
    resolve: { user: userResolver },
  },
]
```

This pattern is useful when no form state is needed during loading. It gives
the form complete data on its initial construction. If the router reuses the
same component instance for another record, reset that form from the new
resolved data or arrange for a fresh editor instance.

## Create the form before data arrives

You can instead use `injectForm` in the same component as `injectQuery`.
Provide a static, shape-complete fallback so `defaultValues` are never
`undefined`, then deliberately reset the untouched form when query data
arrives.

```ts
import { Component, effect, inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { injectQuery } from '@tanstack/angular-query-experimental'
import { injectForm } from '@tanstack/angular-form'

type User = {
  firstName: string
  lastName: string
}

const emptyUser: User = {
  firstName: '',
  lastName: '',
}

@Component({
  selector: 'app-user-page',
  standalone: true,
  template: `
    @if (userQuery.isPending()) {
      <p>Loading…</p>
    } @else if (userQuery.isError()) {
      <p role="alert">Could not load the user.</p>
    } @else {
      <form><!-- fields --></form>
    }
  `,
})
export class UserPageComponent {
  private route = inject(ActivatedRoute)
  private userId = this.route.snapshot.paramMap.get('userId')!

  userQuery = injectQuery(() => ({
    queryKey: ['user', this.userId],
    queryFn: async (): Promise<User> => {
      const response = await fetch(`/api/users/${this.userId}`)
      return response.json()
    },
  }))

  form = injectForm({
    defaultValues: emptyUser,
    onSubmit: async ({ value }) => {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(value),
      })
    },
  })

  constructor() {
    effect(() => {
      const user = this.userQuery.data()
      if (user && !this.form.state.isTouched) {
        this.form.reset(user)
      }
    })
  }
}
```

In this example, fields remain unmounted during loading, so the user cannot
edit them before the loaded values arrive. You can render the empty form
immediately when that better suits the UI, but then decide how incoming data
should interact with edits.

This is the approach demonstrated by the repository's
`examples/angular/query-integration` example.

## Background refetches and record changes

`defaultValues` establish the form's baseline; they are not a fully controlled
`values` prop. When background data arrives, decide at the product level
whether to keep local edits, prompt before replacing them, or call
`form.reset(nextValues)` deliberately. Do not overwrite in-progress input
merely because a query refreshed.

When switching to a different record, construct a fresh editor or deliberately
reset the existing form. Otherwise, values from the previous record can remain
in the form.
