import type { DeepKeys, DeepValue } from './deep-keys.public'
import type { FormApi } from './FormApi/FormApi.public'
import type { AnyFieldApi, FieldApi } from './FieldApi/FieldApi.public'
import type {
  FieldValidators,
  FormValidator,
  FormValidators,
  ValidationTrigger,
} from './validation.public'

// triggers

export type FormListenerTriggers = ValidationTrigger | 'mount' | 'reset'
export type FieldListenerTriggers = FormListenerTriggers | 'unmount'

// shared

export interface ListenerPredicateContext<TFormData, TValue> {
  formApi: FormApi<TFormData, any, any>
  triggerFieldApi?: AnyFieldApi
  value: TValue
}

export type ListenerPredicateFn<TFormData, TValue> = (
  context: ListenerPredicateContext<TFormData, TValue>,
) => boolean

export interface ListenerTriggerConfig<
  TTriggers extends FieldListenerTriggers,
  TFormData,
  TValue,
> {
  trigger: TTriggers
  when?: boolean | ListenerPredicateFn<TFormData, TValue>
}

export type ListenerTriggerOption<
  TTriggers extends FieldListenerTriggers,
  TFormData,
  TValue,
> = TTriggers | ListenerTriggerConfig<TTriggers, TFormData, TValue>

export type ListenerDebounceFn<TFormData, TValue> = (
  context: ListenerPredicateContext<TFormData, TValue>,
) => number

export interface Listener<
  TTriggers extends FieldListenerTriggers,
  TFormData,
  TValue,
> {
  /**
   * The debounce time in milliseconds for validation triggers (change, blur).
   * Does not affect submit events, which always execute immediately.
   *
   * @default 0
   */
  triggerDebounceMs?: number | ListenerDebounceFn<TFormData, TValue>
  triggers?: Array<ListenerTriggerOption<TTriggers, TFormData, TValue>>
}

// form

export interface FormListenerContext<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
  TSubmitReturn,
> {
  triggerFieldApi?: FieldApi<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    any,
    any,
    any
  >
  formApi: FormApi<TFormData, TFormValidators, TSubmitReturn>
  value: TFormData
}

export type FormListenerFn<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
  TSubmitReturn,
> = (
  context: FormListenerContext<TFormData, TFormValidators, TSubmitReturn>,
) => void

export type AnyFormListener = FormListener<any, any, any>

export interface FormListener<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
  TSubmitReturn,
> extends Listener<FormListenerTriggers, TFormData, TFormData> {
  run: FormListenerFn<TFormData, TFormValidators, TSubmitReturn>
}

export type FormListeners<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
  TSubmitReturn,
> = Array<FormListener<TFormData, TFormValidators, TSubmitReturn>>

// field

export interface FieldListenerContext<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
> {
  value: TFieldValue
  fieldApi: FieldApi<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TFieldName,
    TFieldValue,
    TFieldValidators
  >
  formApi: FormApi<TFormData, TFormValidators, TSubmitReturn>
}

// Field A listens to field B
// field B triggers field A validation
// -> should fieldApi refer to A or should it refer to B?
//    -> No, it should refer to field A still. B data can be obtained from other sources.

export type FieldListenerFn<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
> = (
  context: FieldListenerContext<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TFieldName,
    TFieldValue,
    TFieldValidators
  >,
) => void

export type AnyFieldListener = FieldListener<any, any, any, any, any, any>

export interface FieldListener<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
> extends Listener<FieldListenerTriggers, TFormData, TFieldValue> {
  run: FieldListenerFn<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TFieldName,
    TFieldValue,
    TFieldValidators
  >
  // TODO what to name it
  // - listenTo
  // - listenToFields
  // - watchFields
  watchFields?: Array<DeepKeys<TFormData>>
}

export type FieldListeners<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
> = Array<
  FieldListener<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TFieldName,
    TFieldValue,
    TFieldValidators
  >
>

/**
 * {
 *   onChange: ({ fieldApi }) => { doA(fieldApi); doB(); }
 *   change: () => {}
 *   changeDebounceMs -- MISSING! TODO
 * }
 *
 *
 * [{
 *   run: schema,
 *   triggers: ['change']
 * }]
 *
 * [{
 *   run: ({(fieldApi | formApi)}) => {},
 *   triggers: ['change', 'blur'] // not just change | blur, but | submit | mount | unmount
 *   triggerDebounceMs: 500
 * }]
 */

/**
 * Listeners cases
 * change: form.setFieldValue or field.handleChange()
 * blur: field.handleBlur
 * submit: form.handleSubmit
 * mount: form.mount or field.mount
 * reset: form.reset or field.reset
 *
 *
 * foo with listener onChange
 *
 * foo.bar updates value -> should foo trigger listener
 * -> validation: makes sense, the value changed, check again
 *
 * form.setFieldValue('foo') => getOrCreate('foo').triggerListener()
 *
 * Context proposal
 *
 * Form-level listener:
 * { value, formApi, triggerFieldApi?: } {
 *  if (fieldApi) {}
 *
 *
 * }
 *
 * <Field name='foo' listener={'change'}>
 * <Field name='foo.bar' listener={'change'}>
 *
 *
 * </Field>
 *
 *
 * <form.ArrayField name="users" listeners={'change'}>
 * <form.Field name="users[0]" listeners={'change'}>
 * <form.Field name="users[1]" listeners={'change'}>
 * </form.ArrayField>
 *
 *
 * #refCount: number === 0 -> microTask delete if still 0
 * -> one FieldApi passed to both
 *  * <form.Field name="foo.bar" listeners={'change'}>
 *  * <form.Field name="users[0]" listeners={'change'}>
 *
 * value === oldValue referentially is a valid invalidation for checking isDefaultValue once more
 * -> evaluate()
 * form.isDefaultValue => field.isDefaultValue
 * parent.isDefaultValue => child.isDefaultValue
 *
 *
 * child.handleChange -> getBy(form.options.defaultValues, child.name) !== newValue
 * -> evaluate() is true or false -> notify parents
 *
 *
 * form.setFieldValue(name, value) => {
 *   const old = getby(form.options.defaultValues, name)
 *   const isDefaultValue = evaluate(old, value)
 *
 *   if (!isDefaultValue) {
 *      form.isDefaultValueCounter--; // WALK THE TREE
 *   } else {
 *      form.isDefaultValueCounter++;
 *   }
 *
 *   // users reports isDefaultValue
 *   // BUT users[0] contributed to counter
 *
 *   That means doing this in setFieldValue isn't enough.
 *
 *   field.notifyDefaultValue() {
 *      form.incrementOrDecrement()
 *      // recursive because we want children to notify children
 *      for (const child of this._children) {
 *         field.notifyDefaultValue()
 *      }
 *
 *      let curr = this
 *      while (!curr._isRoot) {
 *         form.incrementOrDecrement()
 *         curr = curr._parent
 *      }
 *   }
 *
 *   // then propagating isn't enough
 *
 *
 *
 *   meta.isDefaultValue = form.isDefaultValueCounter === 0
 * }
 *
 * foo.bar touches -> touches foo -> touches form
 * -> form.touchedCount = 2 or 1
 *
 * field.handleChange -> form.setValue(field.name)
 * setBy(input, name, value) => ({...input, setBy(input, remainingName, value)})
 *
 * Field-level listener:
 * TODO don't call it triggerFieldApi on field level context, in case it is
 *
 *
 * { value, formApi, fieldApi }
 *
 * const myCallback = form.createHelper().fieldListener('foo', { })
 *
 * createHelper(formOptions | form)
 * <form.Field listeners={myCallback}
 *
 *
 *  * Field mounts
 *  -> is there `listeners.listenToblabla`
 *  -> if so, for each, `form.getOrCreateFieldApi(name)
 *  -> const unsubscribe = otherField.attachListener(this)
 *
 *  -> field._update() brings in different names
 *  -> Map<oldName, unsubscribe> -> unsubscribe
 *
 *  -> repeat process of subscribing
 *
 *  prune condition needs to be extended: listeners need to be size 0
 *
 *  -> {
 *     run: () => {},
 *     triggers: ['change', 'blur', 'submit', 'mount', 'unmount'], // not the same as submit
 *     // runOnSubmit doesn't exist
 *     listenToFields: ['otherField']
 *   }
 *
 */
