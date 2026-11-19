import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { FieldApi } from '@tanstack/form-core';
import {
  associateDestroyableChild,
  destroy,
  registerDestructor,
} from '@ember/destroyable';
import { liveOptions } from '../-private/live-options.ts';
import { sourceOf, withTrackedState } from '../-private/tracked-api.ts';

import type { FieldSignature } from '../types.ts';
import type {
  AnyFieldApi,
  DeepKeys,
  DeepValue,
  FieldAsyncValidateOrFn,
  FieldValidateOrFn,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
} from '@tanstack/form-core';

interface Mounted {
  api: AnyFieldApi;
  field: AnyFieldApi;
  scope: object;
  defaultValue: unknown;
}

/**
 * Yields a `FieldApi` for `@name`.
 *
 * `field.state` is autotracked.
 *
 * @example
 * ```gjs
 * <Field @form={{tanstackForm}} @name="firstName" as |field|>
 *   <input
 *     value={{field.state.value}}
 *     {{on "input" (fn handleInput field)}}
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
  /**
   * The `Field` that a form yields overrides this.
   */
  get form() {
    return this.args.form;
  }

  #mounted?: Mounted;

  /**
   * Replaces the mounted `FieldApi`.
   * The old one unmounts when its scope is destroyed.
   *
   * `form` and `name` are fixed, and every other option is live.
   * form-core copies these two out of the options one time,
   * so a live value can only disagree with the copy:
   *
   * ```ts
   * // @tanstack/form-core, src/FieldApi.ts
   * constructor(opts) {
   *   this.form = opts.form
   *   this.name = opts.name
   *   this.options = opts
   * ```
   */
  #mount(form: AnyFieldApi['form'], name: AnyFieldApi['name']) {
    if (this.#mounted) destroy(this.#mounted.scope);

    const { args } = this;
    const api: AnyFieldApi = new FieldApi(
      liveOptions(args, { form, name }) as AnyFieldApi['options'],
    );
    const scope = {};

    associateDestroyableChild(this, scope);
    registerDestructor(scope, api.mount());

    this.#mounted = {
      api,
      field: withTrackedState(api, scope),
      scope,
      defaultValue: args.defaultValue,
    };

    return this.#mounted.field;
  }

  /**
   * Gives a changed `@defaultValue` to form-core.
   *
   * This is a write to the form store during a render.
   * It is here because form-core gives no other way.
   *
   * The value of an untouched field is derived data: it is the default value.
   * form-core does not derive it. It copies the default value into the store,
   * so the copy is wrong after the option changes, until someone calls `update`:
   *
   * ```ts
   * // @tanstack/form-core, src/FieldApi.ts
   * update = (opts) => {
   *   this.options = opts
   *   this.name = opts.name
   *
   *   if (!this.state.meta.isTouched && this.options.defaultValue !== undefined) {
   *     const formField = this.form.getFieldValue(this.name)
   *     if (!evaluate(formField, opts.defaultValue)) {
   *       this.form.setFieldValue(this.name, opts.defaultValue, { ... })
   *     }
   *   }
   * ```
   *
   * The correct design reads the option when it reads the value:
   *
   * ```ts
   * get value() {
   *   return this.state.meta.isTouched ? stored : this.options.defaultValue
   * }
   * ```
   *
   * The other adapters call `update` in an effect, after each render,
   * so a changed default value causes a second render.
   * This adapter calls it before the template reads the value,
   * and only for a new `@defaultValue`.
   */
  #applyDefaultValue(mounted: Mounted) {
    const { defaultValue } = this.args;

    if (Object.is(mounted.defaultValue, defaultValue)) return;

    mounted.defaultValue = defaultValue;
    mounted.api.update(mounted.api.options);
  }

  /**
   * A `FieldApi` belongs to one name in one form.
   * If one of the two changes, the field mounts a new `FieldApi`.
   *
   * No other arg needs work here, because the options are live.
   * See `#applyDefaultValue` for the one exception.
   */
  @cached
  get field() {
    const form = sourceOf(this.form);
    const { name } = this.args;
    const mounted = this.#mounted;

    if (!mounted || mounted.api.form !== form || mounted.api.name !== name) {
      return this.#mount(form, name);
    }

    this.#applyDefaultValue(mounted);

    return mounted.field;
  }

  <template>{{yield this.field}}</template>
}
