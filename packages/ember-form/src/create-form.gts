import Component from '@glimmer/component';
import { FormApi } from '@tanstack/form-core';
import { registerDestructor } from '@ember/destroyable';
import { trackedObject } from '@glimmer/validator';
import Field from './components/field.gts';

import type { TOC } from '@ember/component/template-only';
import type {
  FormAsyncValidateOrFn,
  FormOptions,
  FormState,
  FormValidateOrFn,
} from '@tanstack/form-core';

/**
 * The Ember-flavored extensions that `createForm` adds to the `FormApi` it
 * yields. Mirrors the shape of `SvelteFormApi` but uses Glimmer's autotracking
 * (via `trackedObject`) instead of Svelte runes for reactivity.
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
   * `<form.Field @name="..." as |field|>...</form.Field>` instead of passing
   * `@form={{form}}` explicitly.
   */
  Field: TOC<BoundFieldSignature>;
}

/**
 * The full, extended `FormApi` yielded from a `createForm` component's block.
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
 * supplied from the closure), so it can be invoked as
 * `<form.Field @name=... />`.
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
 * The component returned from `createForm`. Invokers can pass any subset of
 * `FormOptions` as args to override the base options provided at module
 * scope.
 */
export interface FormComponentSignature<
  TFormData,
  TFormOnMount extends undefined | FormValidateOrFn<TFormData>,
  TFormOnChange extends undefined | FormValidateOrFn<TFormData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TFormData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta,
> {
  Args: Partial<
    FormOptions<
      TFormData,
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
    >
  >;
  Blocks: {
    default: [
      form: EmberFormExtendedApi<
        TFormData,
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
    ];
  };
}

/**
 * Build a reusable form component from a `FormOptions` blueprint. Each time
 * the returned component is invoked it instantiates its own `FormApi` (mixed
 * with the invocation args) and yields it.
 *
 * Designed to be called at module scope — no `this` required — so the same
 * options can back many form instances and the same component can be reused
 * across pages.
 *
 * @example
 * ```gjs
 * import { createForm } from '@tanstack/ember-form';
 *
 * const SignupForm = createForm({
 *   defaultValues: { firstName: '', lastName: '' },
 * });
 *
 * <template>
 *   <SignupForm @onSubmit={{handleSubmit}} as |form|>
 *     <form.Field @name="firstName" as |field|>
 *       <input value={{field.state.value}} />
 *     </form.Field>
 *     <button {{on "click" form.handleSubmit}}>Submit</button>
 *   </SignupForm>
 * </template>
 * ```
 *
 * @param baseOptions Default `FormOptions`. Anything passed as a component
 *                    arg (e.g. `@onSubmit`) overrides the matching key.
 */
export function createForm<
  TFormData,
  TFormOnMount extends undefined | FormValidateOrFn<TFormData> = undefined,
  TFormOnChange extends undefined | FormValidateOrFn<TFormData> = undefined,
  TFormOnChangeAsync extends
    | undefined
    | FormAsyncValidateOrFn<TFormData> = undefined,
  TFormOnBlur extends undefined | FormValidateOrFn<TFormData> = undefined,
  TFormOnBlurAsync extends
    | undefined
    | FormAsyncValidateOrFn<TFormData> = undefined,
  TFormOnSubmit extends undefined | FormValidateOrFn<TFormData> = undefined,
  TFormOnSubmitAsync extends
    | undefined
    | FormAsyncValidateOrFn<TFormData> = undefined,
  TFormOnDynamic extends undefined | FormValidateOrFn<TFormData> = undefined,
  TFormOnDynamicAsync extends
    | undefined
    | FormAsyncValidateOrFn<TFormData> = undefined,
  TFormOnServer extends
    | undefined
    | FormAsyncValidateOrFn<TFormData> = undefined,
  TSubmitMeta = never,
>(
  baseOptions: FormOptions<
    TFormData,
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
  > = {} as never,
): abstract new (owner: unknown, args: never) => Component<
  FormComponentSignature<
    TFormData,
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
  >
> {
  return makeFormComponent(baseOptions) as never;
}

function makeFormComponent<
  TFormData,
  TFormOnMount extends undefined | FormValidateOrFn<TFormData>,
  TFormOnChange extends undefined | FormValidateOrFn<TFormData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TFormData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta,
>(
  baseOptions: FormOptions<
    TFormData,
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
) {
  type Sig = FormComponentSignature<
    TFormData,
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

  return class FormComponent extends Component<Sig> {
    api: EmberFormExtendedApi<
      TFormData,
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

    constructor(owner: unknown, args: Sig['Args']) {
      super(owner as never, args);

      const merged = { ...baseOptions, ...this.args };
      const formApi = new FormApi(merged as never) as FormApi<
        TFormData,
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

      const cleanupMount = formApi.mount();
      const subscriptions: Array<() => void> = [];

      const extended = formApi as typeof formApi &
        EmberFormApi<
          TFormData,
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

      extended.useStore = ((selector: never) => {
        const read = () =>
          selector ? (selector as (s: never) => never)(formApi.state as never) : formApi.state;
        const box = trackedObject({ current: read() }) as { current: unknown };
        const unsub = formApi.store.subscribe(() => {
          box.current = read();
        }).unsubscribe;
        subscriptions.push(unsub);
        return box;
      }) as (typeof extended)['useStore'];

      extended.Field = makeBoundField(formApi as never);

      this.api = extended;

      registerDestructor(this, () => {
        for (const unsub of subscriptions) unsub();
        cleanupMount();
      });
    }

    /**
     * Re-apply merged options whenever any arg changes. Read in the template
     * so the autotracking entanglement actually fires; mirrors svelte-form's
     * `$effect.pre(() => api.update(opts))`.
     *
     * Glimmer's autotracking memoizes per-tag; reads of `this.args.*` here
     * entangle with their argument tags, so the body only re-runs when an
     * arg has actually changed.
     */
    get _syncOptions() {
      this.api.update({ ...baseOptions, ...this.args } as never);
      return null;
    }

    <template>
      {{this._syncOptions}}
      {{yield this.api}}
    </template>
  };
}
