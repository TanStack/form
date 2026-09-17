import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { FormApi } from '@tanstack/form-core';
import { registerDestructor } from '@ember/destroyable';
import { trackStore } from './-private/track-store.ts';
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

    #api = this.#create();

    #create() {
      const api = new FormApi(this.#options);
      const state = trackStore(api.store, this);

      const extensions: Extensions = {
        Field: class extends Field<
          // The `FieldComponent` type gives each invocation its generics.
          any, any, any, any, any, any, any, any, any, any, any, any,
          any, any, any, any, any, any, any, any, any, any, any
        > {
          get form() {
            return api;
          }
        } as never,

        Subscribe: class extends Subscribe<
          any, any, any, any, any, any, any, any, any, any, any, any
        > {
          get form() {
            return api;
          }
        } as never,

        useSelector: ((selector?: (state: typeof api.state) => unknown) => ({
          get current() {
            return selector ? selector(state) : state;
          },
        })) as Extensions['useSelector'],
      };

      registerDestructor(this, api.mount());

      return Object.assign(api, extensions);
    }

    /**
     * form-core documents `update` as free of side effects,
     * so the form can apply the current args when it is read.
     */
    @cached
    get form() {
      this.#api.update(this.#options);

      return this.#api;
    }

    <template>{{yield this.form}}</template>
  }

  return Form;
}
