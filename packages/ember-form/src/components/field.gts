import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { FieldApi } from '@tanstack/form-core';
import {
  associateDestroyableChild,
  destroy,
  registerDestructor,
} from '@ember/destroyable';
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

  #mounted?: { api: AnyFieldApi; field: AnyFieldApi; scope: object };

  /**
   * Replaces the mounted `FieldApi`.
   * The old one unmounts when its scope is destroyed.
   */
  #mount(options: AnyFieldApi['options']) {
    if (this.#mounted) destroy(this.#mounted.scope);

    const api: AnyFieldApi = new FieldApi(options);
    const scope = {};

    associateDestroyableChild(this, scope);
    registerDestructor(scope, api.mount());

    this.#mounted = { api, field: withTrackedState(api, scope), scope };

    return this.#mounted.field;
  }

  /**
   * form-core documents `update` as free of side effects,
   * so the field can apply the current args when it is read.
   *
   * A `FieldApi` belongs to one name in one form.
   * If one of the two changes, the field mounts a new `FieldApi`.
   */
  @cached
  get field() {
    const options = {
      ...this.args,
      form: sourceOf(this.form),
    } as AnyFieldApi['options'];

    const mounted = this.#mounted;

    if (
      !mounted ||
      mounted.api.form !== options.form ||
      mounted.api.name !== options.name
    ) {
      return this.#mount(options);
    }

    mounted.api.update(options);

    return mounted.field;
  }

  <template>{{yield this.field}}</template>
}
