// Declaration companion generated from useFieldGroup.tsrx.
import { FieldGroupApi } from '@tanstack/form-core';
import type { DeepKeysOfType, FieldGroupState, FieldsMap, FormAsyncValidateOrFn, FormValidateOrFn } from '@tanstack/form-core';
import type { AppFieldExtendedOctaneFormApi } from './createFormHook.tsrx';
import type { LensFieldComponent } from './useField.tsrx';
type FieldGroupRenderable = unknown;
type FieldGroupPropsWithChildren<P = object> = P & {
    children?: FieldGroupRenderable;
};
type FieldGroupFunctionComponent<P = object> = (props: P) => FieldGroupRenderable;
type FieldGroupComponentType<P = object> = FieldGroupFunctionComponent<P>;
/**
 * @private
 */
export type AppFieldExtendedOctaneFieldGroupApi<TFormData, TFieldGroupData, TFields extends DeepKeysOfType<TFormData, TFieldGroupData | null | undefined> | FieldsMap<TFormData, TFieldGroupData>, TOnMount extends undefined | FormValidateOrFn<TFormData>, TOnChange extends undefined | FormValidateOrFn<TFormData>, TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnBlur extends undefined | FormValidateOrFn<TFormData>, TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnSubmit extends undefined | FormValidateOrFn<TFormData>, TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnDynamic extends undefined | FormValidateOrFn<TFormData>, TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>, TSubmitMeta, TFieldComponents extends Record<string, FieldGroupComponentType<any>>, TFormComponents extends Record<string, FieldGroupComponentType<any>>> = FieldGroupApi<TFormData, TFieldGroupData, TFields, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta> & NoInfer<TFormComponents> & {
    AppField: LensFieldComponent<TFieldGroupData, TSubmitMeta, NoInfer<TFieldComponents>>;
    AppForm: FieldGroupComponentType<FieldGroupPropsWithChildren<{}>>;
    /**
     * A component to render form fields. With this, you can render and manage individual form fields.
     */
    Field: LensFieldComponent<TFieldGroupData, TSubmitMeta>;
    /**
     * A `Subscribe` function that allows you to listen and react to changes in the form's state. It's especially useful when you need to execute side effects or render specific components in response to state updates.
     */
    Subscribe: <TSelected = NoInfer<FieldGroupState<TFieldGroupData>>>(props: {
        selector?: (state: NoInfer<FieldGroupState<TFieldGroupData>>) => TSelected;
        children: ((state: NoInfer<TSelected>) => FieldGroupRenderable) | FieldGroupRenderable;
    }) => ReturnType<FieldGroupFunctionComponent>;
};
export declare function useFieldGroup<TFormData, TFieldGroupData, TFields extends DeepKeysOfType<TFormData, TFieldGroupData | null | undefined> | FieldsMap<TFormData, TFieldGroupData>, TOnMount extends undefined | FormValidateOrFn<TFormData>, TOnChange extends undefined | FormValidateOrFn<TFormData>, TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnBlur extends undefined | FormValidateOrFn<TFormData>, TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnSubmit extends undefined | FormValidateOrFn<TFormData>, TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnDynamic extends undefined | FormValidateOrFn<TFormData>, TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>, TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>, TComponents extends Record<string, FieldGroupComponentType<any>>, TFormComponents extends Record<string, FieldGroupComponentType<any>>, TSubmitMeta = never>(opts: {
    form: AppFieldExtendedOctaneFormApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta, TComponents, TFormComponents> | AppFieldExtendedOctaneFieldGroupApi<unknown, TFormData, string | FieldsMap<unknown, TFormData>, any, any, any, any, any, any, any, any, any, any, TSubmitMeta, TComponents, TFormComponents>;
    fields: TFields;
    defaultValues?: TFieldGroupData;
    onSubmitMeta?: TSubmitMeta;
    formComponents: TFormComponents;
}): AppFieldExtendedOctaneFieldGroupApi<TFormData, TFieldGroupData, TFields, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta, TComponents, TFormComponents>;
export {};
