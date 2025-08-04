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
> implements OnInit
{
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
