import Component from '@glimmer/component';
import { trackedObject } from '@glimmer/validator';
import { registerDestructor } from '@ember/destroyable';

import type {
  FormApi,
  FormAsyncValidateOrFn,
  FormState,
  FormValidateOrFn,
} from '@tanstack/form-core';

export interface SubscribeSignature<
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
> {
  Args: {
    /** The form returned from `createForm`. */
    form: FormApi<
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
    /** Optional selector. Defaults to identity (the full form state). */
    selector?: (
      state: FormState<
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
    ) => TSelected;
  };
  Blocks: {
    default: [selected: TSelected];
  };
}

/**
 * Subscribe to a slice of the form state and yield it. The yielded value
 * updates whenever the underlying store changes (subject to the selector
 * returning a different value).
 *
 * @example
 * ```gjs
 * <Subscribe
 *   @form={{this.form}}
 *   @selector={{this.canSubmitSelector}}
 *   as |slice|
 * >
 *   <button type="submit" disabled={{slice.cantSubmit}}>Submit</button>
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
  #box: { current: TSelected };

  constructor(
    owner: unknown,
    args: SubscribeSignature<
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
    >['Args'],
  ) {
    super(owner as never, args);

    const read = (): TSelected => {
      const state = this.args.form.store.state;
      return this.args.selector
        ? this.args.selector(state)
        : (state as unknown as TSelected);
    };

    this.#box = trackedObject({ current: read() }) as { current: TSelected };

    const unsub = this.args.form.store.subscribe(() => {
      this.#box.current = read();
    }).unsubscribe;

    registerDestructor(this, unsub);
  }

  get selected() {
    return this.#box.current;
  }

  <template>{{yield this.selected}}</template>
}
