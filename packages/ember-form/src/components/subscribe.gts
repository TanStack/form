import Component from '@glimmer/component';
import { registerDestructor } from '@ember/destroyable';
import { TrackedValue } from '../-private/tracked-state.ts';

import type { AnyFormApi, FormState } from '@tanstack/form-core';

export interface SubscribeSignature<TParentData, TSelected> {
  Args: {
    /** The form returned from `createForm`. */
    form: AnyFormApi;
    /** Optional selector. Defaults to identity (the full form state). */
    selector?: (
      state: FormState<
        TParentData,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any
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
 *   <button type="submit" disabled={{not slice.canSubmit}}>Submit</button>
 * </Subscribe>
 * ```
 */
export default class Subscribe<TParentData, TSelected> extends Component<
  SubscribeSignature<TParentData, TSelected>
> {
  #box: TrackedValue<TSelected>;

  constructor(
    owner: unknown,
    args: SubscribeSignature<TParentData, TSelected>['Args'],
  ) {
    super(owner as never, args);

    const read = (): TSelected => {
      const state = this.args.form.store.state as FormState<
        TParentData,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any
      >;
      return this.args.selector
        ? this.args.selector(state)
        : (state as unknown as TSelected);
    };

    this.#box = new TrackedValue(read());

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
