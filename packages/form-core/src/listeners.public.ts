import type { FieldApi } from './FieldApi.public'
import type { FormValidator, ValidationTrigger } from './validation.public'

// form

export type FormListenerEvents = ValidationTrigger | 'mount' | 'reset'

export interface FormListenerContext<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
> {
  fieldApi?: FieldApi<TFormData, TFormValidators>
  formApi: TFormData
}

export type FormListenerFn<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
> = (context: FormListenerContext<TFormData, TFormValidators>) => void

export interface FormListenerConfig<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
> {
  run: FormListenerFn<TFormData, TFormValidators>
  triggers: Array<FormListenerEvents>
  debounceMs?: number
}

// field

export type FieldListenerEvents =
  | ValidationTrigger
  | 'mount'
  | 'unmount'
  | 'reset'

export interface FieldListenerContext<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
> {
  value: any
  fieldApi: FieldApi<TFormData, TFormValidators>
}

export type FieldListenerFn<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
> = (context: FieldListenerContext<TFormData, TFormValidators>) => void

export interface FieldListenerConfig<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
> {
  listener: FieldListenerFn<TFormData, TFormValidators>
  debounceMs?: number
}

export type FieldListeners<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
> = Partial<
  Record<
    FieldListenerEvents,
    | FieldListenerConfig<TFormData, TFormValidators>
    | FieldListenerFn<TFormData, TFormValidators>
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
 */
