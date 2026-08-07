import {
  ChangeDetectorRef,
  Directive,
  Injector,
  OnInit,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  untracked,
} from '@angular/core'
import { FormApi, FormGroupApi, FormGroupApiOptions } from '@tanstack/form-core'
import { injectStore } from '@tanstack/angular-store'
import type {
  DeepKeys,
  DeepValue,
  FieldLikeMeta,
  FormAsyncValidateOrFn,
  FormGroupAsyncValidateOrFn,
  FormGroupListeners,
  FormGroupState,
  FormGroupValidateOrFn,
  FormGroupValidators,
  FormValidateOrFn,
} from '@tanstack/form-core'

@Directive({
  selector: '[tanstackFormGroup]',
  standalone: true,
  exportAs: 'formGroup',
})
export class TanStackFormGroup<
  TParentData,
  const TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChange extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TSubmitMeta,
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
> implements OnInit {
  name = input.required<TName>()
  defaultValue = input<NoInfer<TData>>()
  asyncDebounceMs = input(undefined as never as number, {
    transform: numberAttribute,
  })
  asyncAlways = input(undefined as never as boolean, {
    transform: booleanAttribute,
  })
  canSubmitWhenInvalid = input(undefined as never as boolean, {
    transform: booleanAttribute,
  })
  tanstackFormGroup =
    input.required<
      FormApi<
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
        TParentSubmitMeta
      >
    >()

  validators =
    input<
      NoInfer<
        FormGroupValidators<
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
          TOnDynamicAsync
        >
      >
    >()

  listeners = input<NoInfer<FormGroupListeners<TParentData, TName, TData>>>()

  defaultMeta =
    input<
      Partial<
        FieldLikeMeta<
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
          TFormOnDynamicAsync
        >
      >
    >()

  defaultState = input<Partial<FormGroupState>>()

  onSubmitMeta = input<NoInfer<TSubmitMeta>>()

  onGroupSubmit =
    input<
      NoInfer<
        FormGroupApiOptions<
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
          TSubmitMeta,
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
        >['onGroupSubmit']
      >
    >()

  onGroupSubmitInvalid =
    input<
      NoInfer<
        FormGroupApiOptions<
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
          TSubmitMeta,
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
        >['onGroupSubmitInvalid']
      >
    >()

  mode = input<'value' | 'array'>()

  _api = computed(() => {
    return new FormGroupApi(untracked(this.options))
  })

  get api(): FormGroupApi<
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
    TSubmitMeta,
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
  > {
    return this._api()
  }

  options = computed(
    () =>
      ({
        defaultValue: this.defaultValue(),
        asyncDebounceMs: this.asyncDebounceMs(),
        asyncAlways: this.asyncAlways(),
        canSubmitWhenInvalid: this.canSubmitWhenInvalid(),
        validators: this.validators(),
        listeners: this.listeners(),
        defaultMeta: this.defaultMeta(),
        defaultState: this.defaultState(),
        onSubmitMeta: this.onSubmitMeta(),
        onGroupSubmit: this.onGroupSubmit(),
        onGroupSubmitInvalid: this.onGroupSubmitInvalid(),
        name: this.name(),
        form: this.tanstackFormGroup(),
      }) as FormGroupApiOptions<
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
        TSubmitMeta,
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
  )

  injector = inject(Injector)

  constructor() {
    effect((onCleanup) => {
      const unmount = this._api().mount()

      onCleanup(() => {
        unmount()
      })
    })

    effect(() => {
      this._api().update(this.options())
    })
  }

  cd = inject(ChangeDetectorRef)

  ngOnInit() {
    const vals = injectStore(
      this._api().store,
      this.mode() === 'array'
        ? (state) => {
            return [
              state.meta,
              Object.keys((state.value as unknown) ?? []).length,
            ]
          }
        : undefined,
      {
        injector: this.injector,
      },
    )

    // Submission lifecycle and aggregated validity now live on `state.meta`
    // (mirroring `FieldApi.state.meta`), so subscribing to the main store
    // above is sufficient to keep them reactive.

    effect(
      () => {
        // Load bearing change detection check
        const _values = vals()
        this.cd.markForCheck()
      },
      { injector: this.injector },
    )
  }
}
