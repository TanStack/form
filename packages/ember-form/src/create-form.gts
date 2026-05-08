import { FormApi } from '@tanstack/form-core';
import { registerDestructor } from '@ember/destroyable';
import { TrackedValue } from './-private/tracked-state.ts';
import Field from './components/field.gts';

import type { TOC } from '@ember/component/template-only';
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

  /**
   * A `<Field>` component closure-bound to this form. Lets you write
   * `<this.form.Field @name="..." as |field|>...</this.form.Field>` instead
   * of passing `@form={{this.form}}` explicitly.
   */
  Field: TOC<BoundFieldSignature>;
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
 * @private
 *
 * Build a closure-bound `<Field>` for a specific `FormApi`. The returned
 * component takes all of `FieldSignature['Args']` minus `form` (which is
 * supplied from the closure), so it can be invoked as `<form.Field @name=... />`.
 *
 * Typed via `as never` because strict glint wants to validate the inner
 * `<Field>` invocation against the full Field signature, but we're forwarding
 * untyped args from the outer template scope (the loss of types is recovered
 * by the cast on the calling site, where `EmberFormApi['Field']` is declared).
 */
interface BoundFieldSignature {
  Args: {
    name: string;
    defaultValue?: unknown;
    asyncDebounceMs?: number;
    asyncAlways?: boolean;
    defaultMeta?: unknown;
    validators?: unknown;
    listeners?: unknown;
    mode?: 'value' | 'array';
  };
  Blocks: {
    default: [field: unknown];
  };
}

function makeBoundField(
  api: FormApi<any, any, any, any, any, any, any, any, any, any, any, any>,
): TOC<BoundFieldSignature> {
  return <template>
    <Field
      @form={{api}}
      @name={{@name}}
      @defaultValue={{@defaultValue}}
      @asyncDebounceMs={{@asyncDebounceMs}}
      @asyncAlways={{@asyncAlways}}
      @defaultMeta={{@defaultMeta}}
      @validators={{@validators}}
      @listeners={{@listeners}}
      @mode={{@mode}}
      as |field|
    >
      {{yield field}}
    </Field>
  </template>;
}

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

  extended.Field = makeBoundField(api);

  registerDestructor(parent, () => {
    for (const unsub of subscriptions) unsub();
    cleanupMount();
  });

  return extended;
}
