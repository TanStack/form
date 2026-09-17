import Component from '@glimmer/component';
import { trackStore } from '../-private/track-store.ts';

import type { SubscribeSignature } from '../types.ts';
import type {
  FormAsyncValidateOrFn,
  FormState,
  FormValidateOrFn,
} from '@tanstack/form-core';

/**
 * Yields a selection of the form state.
 *
 * @example
 * ```gjs
 * <Subscribe @form={{tanstackForm}} @selector={{pickSubmit}} as |state|>
 *   <button type="submit" disabled={{state.cantSubmit}}>Submit</button>
 * </Subscribe>
 * ```
 */
export default class Subscribe<
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
  TSelected = FormState<
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
  >,
> extends Component<
  SubscribeSignature<
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
    TSubmitMeta,
    TSelected
  >
> {
  /**
   * The `Subscribe` that a form yields overrides this.
   */
  get form() {
    return this.args.form;
  }

  #readState = trackStore(this.form.store, this);

  get selected(): TSelected {
    const state = this.#readState();

    return this.args.selector
      ? this.args.selector(state)
      : (state as unknown as TSelected);
  }

  <template>{{yield this.selected}}</template>
}
