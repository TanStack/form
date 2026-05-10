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
import {
  FieldApi,
  FieldApiOptions,
  FieldAsyncValidateOrFn,
  FieldValidateOrFn,
  FormApi,
} from '@tanstack/form-core'
import { injectStore } from '@tanstack/angular-store'
import type {
  DeepKeys,
  DeepValue,
  FieldListeners,
  FieldMeta,
  FieldValidators,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
} from '@tanstack/form-core'

@Directive({
  selector: '[tanstackField]',
  standalone: true,
  exportAs: 'field',
})
export class TanStackField<
  TParentData,
  const TName extends DeepKeys<TParentData>,
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
  TSubmitMeta,
> implements OnInit {
  name = input.required<TName>()
  defaultValue = input<NoInfer<TData>>()
  asyncDebounceMs = input(undefined as never as number, {
    transform: numberAttribute,
  })
  asyncAlways = input(undefined as never as boolean, {
    transform: booleanAttribute,
  })
  tanstackField =
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
        TSubmitMeta
      >
    >()

  validators =
    input<
      NoInfer<
        FieldValidators<
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

  listeners = input<NoInfer<FieldListeners<TParentData, TName, TData>>>()
  defaultMeta =
    input<
      Partial<
        FieldMeta<
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

  mode = input<'value' | 'array'>()

  disableErrorFlat = input<boolean>()

  _api = computed(() => {
    return new FieldApi(untracked(this.options))
  })

  get api(): FieldApi<
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
    TSubmitMeta
  > {
    return this._api()
  }

  options = computed(
    () =>
      ({
        defaultValue: this.defaultValue(),
        asyncDebounceMs: this.asyncDebounceMs(),
        asyncAlways: this.asyncAlways(),
        disableErrorFlat: this.disableErrorFlat(),
        validators: this.validators(),
        listeners: this.listeners(),
        defaultMeta: this.defaultMeta(),
        name: this.name(),
        form: this.tanstackField(),
      }) as FieldApiOptions<
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
        TSubmitMeta
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
    // Subscribe to the pieces of field state that should trigger a re-render.
    // For array mode, we only track the length of the array value to avoid
    // re-renders when child properties change. Meta is tracked piece by piece
    // so that consumers re-render when any meta property updates.
    // See: https://github.com/TanStack/form/issues/1961
    const injectorOpts = { injector: this.injector }
    const isArrayMode = this.mode() === 'array'
    const reactiveValue = injectStore(
      this._api().store,
      (state) =>
        isArrayMode
          ? Object.keys((state.value as unknown) ?? []).length
          : state.value,
      injectorOpts,
    )
    const reactiveIsTouched = injectStore(
      this._api().store,
      (state) => state.meta.isTouched,
      injectorOpts,
    )
    const reactiveIsBlurred = injectStore(
      this._api().store,
      (state) => state.meta.isBlurred,
      injectorOpts,
    )
    const reactiveIsDirty = injectStore(
      this._api().store,
      (state) => state.meta.isDirty,
      injectorOpts,
    )
    const reactiveErrorMap = injectStore(
      this._api().store,
      (state) => state.meta.errorMap,
      injectorOpts,
    )
    const reactiveErrorSourceMap = injectStore(
      this._api().store,
      (state) => state.meta.errorSourceMap,
      injectorOpts,
    )
    const reactiveIsValidating = injectStore(
      this._api().store,
      (state) => state.meta.isValidating,
      injectorOpts,
    )

    effect(
      () => {
        // Load bearing change detection check — read every reactive source so
        // the effect runs whenever any of them change.
        reactiveValue()
        reactiveIsTouched()
        reactiveIsBlurred()
        reactiveIsDirty()
        reactiveErrorMap()
        reactiveErrorSourceMap()
        reactiveIsValidating()
        this.cd.markForCheck()
      },
      { injector: this.injector },
    )
  }
}
