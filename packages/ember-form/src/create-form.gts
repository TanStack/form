import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { FormApi } from '@tanstack/form-core';
import { registerDestructor } from '@ember/destroyable';
import { withTrackedState } from './-private/tracked-api.ts';
import Field from './components/field.gts';
import Subscribe from './components/subscribe.gts';

import type { EmberFormApi, FormComponentSignature } from './types.ts';
import type { ComponentLike } from '@glint/template';
import type {
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateOrFn,
} from '@tanstack/form-core';

/**
 * Returns a component that owns one form per invocation.
 *
 * Call this in module scope.
 * Each arg on the component overrides the same key in `baseOptions`.
 *
 * The component yields the form.
 * `state` on the yielded form is autotracked per key.
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
 *   <SignupForm @onSubmit={{save}} as |tanstackForm|>
 *     <tanstackForm.Field @name="firstName" as |field|>
 *       <input value={{field.state.value}} />
 *     </tanstackForm.Field>
 *   </SignupForm>
 * </template>
 * ```
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
  > = {},
): ComponentLike<
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
  type Signature = FormComponentSignature<
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

  type Extensions = EmberFormApi<
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

  class Form extends Component<Signature> {
    get #options() {
      return { ...baseOptions, ...this.args };
    }

    #api = new FormApi(this.#options);

    #form = this.#extend();

    #extend() {
      const api = this.#api;

      registerDestructor(this, api.mount());

      const form: typeof api & Extensions = withTrackedState(api, this, {
        Field: class extends Field<
          // The `FieldComponent` type gives each invocation its generics.
          any, any, any, any, any, any, any, any, any, any, any, any,
          any, any, any, any, any, any, any, any, any, any, any
        > {
          get form() {
            return form;
          }
        } as never,

        Subscribe: class extends Subscribe<
          any, any, any, any, any, any, any, any, any, any, any, any
        > {
          get form() {
            return form;
          }
        } as never,

        useSelector: ((selector?: (state: typeof api.state) => unknown) => ({
          get current() {
            return selector ? selector(form.state) : form.state;
          },
        })) as Extensions['useSelector'],
      } satisfies Extensions);

      return form;
    }

    /**
     * Gives the current args to form-core each time one of them changes.
     *
     * A getter that calls `update` is not correct Ember code.
     * It is here because form-core gives no other way, for three reasons.
     *
     * 1. form-core copies the default values into its store.
     *    The values of an untouched form are derived data,
     *    but form-core does not derive them,
     *    so a changed `@defaultValues` needs a write to the store:
     *
     * ```ts
     * // @tanstack/form-core, src/FormApi.ts
     * update = (options) => {
     *   const oldOptions = this.options
     *   this.options = options
     *
     *   const shouldUpdateValues =
     *     options.defaultValues &&
     *     !evaluate(options.defaultValues, oldOptions.defaultValues) &&
     *     !this.state.isTouched
     *   // ...
     *   this.baseStore.setState(() => getDefaultFormState({ ... }))
     * ```
     *
     * 2. `update` finds a change only if it gets a new object.
     *    The comparison above reads the old and the new default values
     *    from two option objects. An object with live getters,
     *    as `Field` uses, always gives the same value for the two.
     *
     * 3. `reset` replaces the options with a copy.
     *    A copy of live getters is a set of fixed values,
     *    so the form no longer sees a changed arg after this line:
     *
     * ```ts
     * // @tanstack/form-core, src/FormApi.ts
     * reset = (values, opts) => {
     *   if (values && !opts?.keepDefaultValues) {
     *     this.options = { ...this.options, defaultValues: values }
     *   }
     * ```
     *
     * Without a changed default value, `update` only assigns `this.options`,
     * and nothing in a template can observe that assignment.
     *
     * The other adapters call `update` in an effect, after each render,
     * so a changed default value causes a second render.
     * This adapter calls it before the template reads the form.
     */
    @cached
    get form() {
      this.#api.update(this.#options);

      return this.#form;
    }

    <template>{{yield this.form}}</template>
  }

  return Form;
}
