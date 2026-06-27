'use server'

export default async function someAction(prev: unknown, formData: FormData) {
  // How to call some function from tanstack form, with type inference from formOpts
  // That returns FormState (to set `errors.onServer` and others) when validation fails
  // But otherwise just passes through
}
