import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
// `trackedObject` is re-exported from `@ember/reactive/collections` in
// ember-source 6.8+, but that path isn't in @embroider/addon-dev's virtual
// peer-deps list yet. Importing from `@glimmer/validator` (a virtual peer)
// gets the same primitive without the resolution warning.
import { trackedObject } from '@glimmer/validator';
import { FieldApi } from '@tanstack/form-core';
import { registerDestructor } from '@ember/destroyable';

import type {
  AnyFormApi,
  DeepKeys,
  DeepValue,
  FieldAsyncValidateOrFn,
  FieldValidateOrFn,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
} from '@tanstack/form-core';

export interface FieldSignature<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
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
  TParentSubmitMeta,
> {
  Args: {
    /** The owning form returned from `createForm`. */
    form: AnyFormApi;
    /** Path into the form's data. */
    name: TName;
    /** Optional default value for this field. */
    defaultValue?: TData;
    /** Debounce duration for async validators (ms). */
    asyncDebounceMs?: number;
    /** Always run async validators (skip cache). */
    asyncAlways?: boolean;
    /** Initial field meta. */
    defaultMeta?: unknown;
    /** Field-level validators. */
    validators?: unknown;
    /** Field-level listeners. */
    listeners?: unknown;
    /** 'value' (default) or 'array' for managing array fields. */
    mode?: 'value' | 'array';
  };
  Blocks: {
    default: [
      field: FieldApi<
        TParentData,
        TName,
        TData,
        TOnMount,
        TOnChange,
        TOnChangeAsync,
        TOnBlur,
        TOnBlurAsync,
        TOnSubmit,
        TOnSubmitAsync,
        TOnDynamic,
        TOnDynamicAsync,
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
        TParentSubmitMeta
      >,
    ];
  };
}

/**
 * Field component for `@tanstack/ember-form`. Instantiates a `FieldApi` for
 * the given path, mounts it for the lifetime of this component, and yields
 * the field API to its block.
 *
 * `field.state` reads a `trackedObject` snapshot of the underlying store, so
 * reads in templates rerender on store changes.
 *
 * @example
 * ```gjs
 * <Field @form={{this.form}} @name="firstName" as |field|>
 *   <input
 *     value={{field.state.value}}
 *     {{on "input" (fn this.handleInput field)}}
 *   />
 * </Field>
 * ```
 */
export default class Field<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
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
  TParentSubmitMeta,
> extends Component<
  FieldSignature<
    TParentData,
    TName,
    TData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
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
    TParentSubmitMeta
  >
> {
  #api: FieldApi<
    TParentData,
    TName,
    TData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
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
    TParentSubmitMeta
  >;

  constructor(
    owner: unknown,
    args: FieldSignature<
      TParentData,
      TName,
      TData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
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
      TParentSubmitMeta
    >['Args'],
  ) {
    super(owner as never, args);

    this.#api = new FieldApi(this.#fieldOptions as never);

    // We replace the `state` getter on the FieldApi instance with one that
    // reads from a `trackedObject` mirror of the store. This is intentionally
    // unconventional: form-core's `FieldApi#state` is defined on the prototype
    // and reads `this.store.state` synchronously. By shadowing it on the
    // instance with a tracked snapshot, every `{{field.state.X}}` read inside
    // a template entangles with the corresponding key on the tracked mirror,
    // and the `store.subscribe` callback below assigns into that mirror to
    // dirty only the keys that actually changed.
    const state = trackedObject(this.#api.store.state) as object;
    Object.defineProperty(this.#api, 'state', {
      configurable: true,
      get: () => state,
    });

    const cleanupMount = this.#api.mount();
    const unsub = this.#api.store.subscribe(() => {
      Object.assign(state, this.#api.store.state);
    }).unsubscribe;

    registerDestructor(this, () => {
      unsub();
      cleanupMount();
    });
  }

  get #fieldOptions() {
    return {
      form: this.args.form,
      name: this.args.name,
      defaultValue: this.args.defaultValue,
      asyncDebounceMs: this.args.asyncDebounceMs,
      asyncAlways: this.args.asyncAlways,
      defaultMeta: this.args.defaultMeta,
      validators: this.args.validators,
      listeners: this.args.listeners,
      mode: this.args.mode,
    };
  }

  /**
   * Mirrors svelte-form's `$effect.pre(() => api.update(opts))`. Reading this
   * getter inside the template entangles with each `this.args.*` it touches,
   * so any change to a passed-in argument re-runs `api.update(...)`. The
   * leading underscore is a convention — public-but-internal — because
   * templates invoke path lookups via `Reflect.get`, which can't reach
   * `#private` fields.
   */
  @cached
  get _syncArgs() {
    this.#api.update(this.#fieldOptions as never);
    return null;
  }

  get field() {
    return this.#api;
  }

  <template>
    {{this._syncArgs}}
    {{yield this.field}}
  </template>
}
