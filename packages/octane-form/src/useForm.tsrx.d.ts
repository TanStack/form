// Declaration companion generated from useForm.tsrx.
import { FormApi } from '@tanstack/form-core';
import type { FormGroupComponent } from './useFormGroup.tsrx';
import type { FormAsyncValidateOrFn, FormOptions, FormState, FormValidateOrFn } from '@tanstack/form-core';
import type { FieldComponent } from './useField.tsrx';
type FormRenderable = unknown;
type FormFunctionComponent<P = object> = (props: P) => FormRenderable;
/**
 * Fields that are added onto the `FormAPI` from `@tanstack/form-core` and returned from `useForm`
 */
export interface OctaneFormApi<in out TFormData, in out TOnMount extends undefined | FormValidateOrFn<TFormData>, in out TOnChange extends undefined | FormValidateOrFn<TFormData>, in out TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>, in out TOnBlur extends undefined | FormValidateOrFn<TFormData>, in out TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>, in out TOnSubmit extends undefined | FormValidateOrFn<TFormData>, in out TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>, in out TOnDynamic extends undefined | FormValidateOrFn<TFormData>, in out TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>, in out TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>, in out TSubmitMeta> {
    /**
     * A component to render form fields. With this, you can render and manage individual form fields.
     */
    Field: FieldComponent<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta>;
    FormGroup: FormGroupComponent<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta>;
    /**
     * A `Subscribe` function that allows you to listen and react to changes in the form's state. It's especially useful when you need to execute side effects or render specific components in response to state updates.
     */
    Subscribe: <TSelected = NoInfer<FormState<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer>>>(props: {
        selector?: (state: NoInfer<FormState<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer>>) => TSelected;
        children: ((state: NoInfer<TSelected>) => FormRenderable) | FormRenderable;
    }) => ReturnType<FormFunctionComponent>;
}
/**
 * An extended version of the `FormApi` class that includes renderer-specific components from `OctaneFormApi`
 */
export type OctaneFormExtendedApi<TFormData, TOnMount extends undefined | FormValidateOrFn<TFormData>, TOnChange extends undefined | FormValidateOrFn<TFormData>, TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnBlur extends undefined | FormValidateOrFn<TFormData>, TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnSubmit extends undefined | FormValidateOrFn<TFormData>, TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnDynamic extends undefined | FormValidateOrFn<TFormData>, TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>, TSubmitMeta> = FormApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta> & OctaneFormApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta>;
/**
 * A custom hook that returns an extended instance of the `FormApi` class.
 *
 * This API encapsulates all the necessary functionalities related to the form. It allows you to manage form state, handle submissions, and interact with form fields
 */
export declare function useForm<TFormData, TOnMount extends undefined | FormValidateOrFn<TFormData>, TOnChange extends undefined | FormValidateOrFn<TFormData>, TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnBlur extends undefined | FormValidateOrFn<TFormData>, TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnSubmit extends undefined | FormValidateOrFn<TFormData>, TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnDynamic extends undefined | FormValidateOrFn<TFormData>, TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>, TSubmitMeta>(opts?: FormOptions<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta>): OctaneFormExtendedApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta>;
export {};
