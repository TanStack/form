import { FormApi } from '@tanstack/form-core';
import { registerDestructor } from '@ember/destroyable';
import { TrackedValue } from './-private/tracked-state.ts';

import type {
  FormAsyncValidateOrFn,
  FormOptions,
  FormState,
  FormValidateOrFn,
} from '@tanstack/form-core';

/**
 * The Ember-flavored extensions that `createForm` adds to the `FormApi`.
 *
 * Mirrors the shape of `SvelteFormApi` but uses Glimmer's autotracking
 * (`@tracked` via `TrackedValue`) instead of Svelte runes for reactivity.
 */
export interface EmberFormApi<
  TParentData,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  TSubmitMeta,
> {
  /**
   * Returns a reactive selection of the form state. The resulting object's
   * `.current` property is autotracked, so templates and `cached` getters
   * that read it recompute on store changes.
   */
  useStore: <
    TSelected = NoInfer<
      FormState<
        TParentData,
        TFormOnMount,
        TFormOnChange,
        TFormOnChangeAsync,
        TFormOnBlur,
        TFormOnBlurAsync,
        TFormOnSubmit,
        TFormOnSubmitAsync,
        TFormOnDynamic,
        TFormOnDynamicAsync,
        TFormOnServer
      >
    >,
  >(
    selector?: (
      state: NoInfer<
        FormState<
          TParentData,
          TFormOnMount,
          TFormOnChange,
          TFormOnChangeAsync,
          TFormOnBlur,
          TFormOnBlurAsync,
          TFormOnSubmit,
          TFormOnSubmitAsync,
          TFormOnDynamic,
          TFormOnDynamicAsync,
          TFormOnServer
        >
      >,
    ) => TSelected,
  ) => { readonly current: TSelected };
}

/**
 * The full, extended `FormApi` returned by `createForm`.
 */
export type EmberFormExtendedApi<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
  TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta,
> = FormApi<
  TFormData,
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnDynamic,
  TOnDynamicAsync,
  TOnServer,
  TSubmitMeta
> &
  EmberFormApi<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TOnServer,
    TSubmitMeta
  >;

/**
 * Create a `FormApi` instance whose lifecycle is tied to `parent`. Mounts the
 * form immediately and registers a destructor on `parent` to unmount and
 * release store subscriptions when `parent` is destroyed.
 *
 * @example
 * ```gjs
 * import Component from '@glimmer/component';
 * import { createForm, Field } from '@tanstack/ember-form';
 *
 * export default class MyForm extends Component {
 *   form = createForm(this, {
 *     defaultValues: { firstName: '', lastName: '' },
 *     onSubmit: async ({ value }) => console.log(value),
 *   });
 *
 *   <template>
 *     <form {{on "submit" this.form.handleSubmit}}>
 *       <Field @form={{this.form}} @name="firstName" as |field|>
 *         <input value={{field.state.value}} />
 *       </Field>
 *     </form>
 *   </template>
 * }
 * ```
 *
 * @param parent  Any destroyable (typically `this` from a `@glimmer/component`).
 *                Used to schedule unmount + unsubscribe on destruction.
 * @param options FormApi options. Currently captured at construction time;
 *                call `form.update(opts)` to apply runtime changes.
 */
export function createForm<
  TParentData,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  TSubmitMeta,
>(
  parent: object,
  options?: FormOptions<
    TParentData,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnDynamic,
    TFormOnDynamicAsync,
    TFormOnServer,
    TSubmitMeta
  >,
): EmberFormExtendedApi<
  TParentData,
  TFormOnMount,
  TFormOnChange,
  TFormOnChangeAsync,
  TFormOnBlur,
  TFormOnBlurAsync,
  TFormOnSubmit,
  TFormOnSubmitAsync,
  TFormOnDynamic,
  TFormOnDynamicAsync,
  TFormOnServer,
  TSubmitMeta
> {
  const api = new FormApi(options);

  const cleanupMount = api.mount();
  const subscriptions: Array<() => void> = [];

  const extended = api as typeof api &
    EmberFormApi<
      TParentData,
      TFormOnMount,
      TFormOnChange,
      TFormOnChangeAsync,
      TFormOnBlur,
      TFormOnBlurAsync,
      TFormOnSubmit,
      TFormOnSubmitAsync,
      TFormOnDynamic,
      TFormOnDynamicAsync,
      TFormOnServer,
      TSubmitMeta
    >;

  extended.useStore = ((selector) => {
    const read = () => (selector ? selector(api.state) : api.state);
    const box = new TrackedValue(read());
    const unsub = api.store.subscribe(() => {
      box.current = read();
    }).unsubscribe;
    subscriptions.push(unsub);
    return box;
  }) as (typeof extended)['useStore'];

  registerDestructor(parent, () => {
    for (const unsub of subscriptions) unsub();
    cleanupMount();
  });

  return extended;
}
