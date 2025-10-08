import {
    AnyFieldGroupApi,
	DeepKeysOfType,
	FieldGroupApi,
	FieldGroupState,
	FieldsMap,
	FormAsyncValidateOrFn,
	FormValidateOrFn,
    functionalUpdate,
} from "@tanstack/form-core";
import { Accessor, Component, createRenderEffect, createSignal, JSX, ParentComponent, ParentProps } from "solid-js";
import { LensFieldComponent } from "./createField";
import { AppFieldExtendedSolidFormApi } from "./createFormHook"
import { useStore } from "@tanstack/solid-store";

function LocalSubscribe({
	lens,
	selector,
	children,
}: ParentProps<{
	lens: AnyFieldGroupApi;
	selector: (state: FieldGroupState<any>) => FieldGroupState<any>;
}>) {
	const data = useStore(lens.store, selector);

	return functionalUpdate(children, data);
}

/**
 * @private
 */
export type AppFieldExtendedSolidFieldGroupApi<
	TFormData,
	TFieldGroupData,
	TFields extends
		| DeepKeysOfType<TFormData, TFieldGroupData | null | undefined>
		| FieldsMap<TFormData, TFieldGroupData>,
	TOnMount extends undefined | FormValidateOrFn<TFormData>,
	TOnChange extends undefined | FormValidateOrFn<TFormData>,
	TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
	TOnBlur extends undefined | FormValidateOrFn<TFormData>,
	TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
	TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
	TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
	TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
	TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
	TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
	TSubmitMeta,
	TFieldComponents extends Record<string, Component<any>>,
	TFormComponents extends Record<string, Component<any>>,
> = FieldGroupApi<
	TFormData,
	TFieldGroupData,
	TFields,
	TOnMount,
	TOnChange,
	TOnChangeAsync,
	TOnBlur,
	TOnBlurAsync,
	TOnSubmit,
	TOnSubmitAsync,
	TOnDynamic,
	TOnDynamicAsync,
	TOnServer,
	TSubmitMeta
> &
	NoInfer<TFormComponents> & {
		AppField: LensFieldComponent<
			TFieldGroupData,
			TSubmitMeta,
			NoInfer<TFieldComponents>
		>;
		AppForm: ParentComponent;
		/**
		 * A React component to render form fields. With this, you can render and manage individual form fields.
		 */
		Field: LensFieldComponent<TFieldGroupData, TSubmitMeta>;

		/**
		 * A `Subscribe` function that allows you to listen and react to changes in the form's state. It's especially useful when you need to execute side effects or render specific components in response to state updates.
		 */
		Subscribe: <TSelected = NoInfer<FieldGroupState<TFieldGroupData>>>(props: {
			selector?: (
				state: NoInfer<FieldGroupState<TFieldGroupData>>,
			) => TSelected;
			children: ((state: NoInfer<TSelected>) => JSX.Element) | JSX.Element;
		}) => JSX.Element;
	};

export function createFieldGroup<
    TFormData,
    TFieldGroupData,
    TFields extends
    | DeepKeysOfType<TFormData, TFieldGroupData | null | undefined>
    | FieldsMap<TFormData, TFieldGroupData>,
    TOnMount extends undefined | FormValidateOrFn<TFormData>,
    TOnChange extends undefined | FormValidateOrFn<TFormData>,
    TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
    TOnBlur extends undefined | FormValidateOrFn<TFormData>,
    TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
    TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
    TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
    TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
    TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
    TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
    TComponents extends Record<string, Component<any>>,
    TFormComponents extends Record<string, Component<any>>,
    TSubmitMeta = never,
>(opts: {
    form:
    | AppFieldExtendedSolidFormApi<
        TFormData,
        TOnMount,
        TOnChange,
        TOnChangeAsync,
        TOnBlur,
        TOnBlurAsync,
        TOnSubmit,
        TOnSubmitAsync,
        TOnDynamic,
        TOnDynamicAsync,
        TOnServer,
        TSubmitMeta,
        TComponents,
        TFormComponents
    >
    | AppFieldExtendedSolidFieldGroupApi<
        // Since this only occurs if you nest it within other form lenses, it can be more
        // lenient with the types.
        unknown,
        TFormData,
        string | FieldsMap<unknown, TFormData>,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        TSubmitMeta,
        TComponents,
        TFormComponents
    >;
    fields: TFields;
    defaultValues?: TFieldGroupData;
    onSubmitMeta?: TSubmitMeta;
    formComponents: TFormComponents;
}): Accessor<AppFieldExtendedSolidFieldGroupApi<
    TFormData,
    TFieldGroupData,
    TFields,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TOnServer,
    TSubmitMeta,
    TComponents,
    TFormComponents
    >> { 
    const [formLensApi] = createSignal((() => {
        const api = new FieldGroupApi(opts);
        const form =
        opts.form instanceof FieldGroupApi
            ? (opts.form.form as AppFieldExtendedSolidFormApi<
                    TFormData,
                    TOnMount,
                    TOnChange,
                    TOnChangeAsync,
                    TOnBlur,
                    TOnBlurAsync,
                    TOnSubmit,
                    TOnSubmitAsync,
                    TOnDynamic,
                    TOnDynamicAsync,
                    TOnServer,
                    TSubmitMeta,
                    TComponents,
                    TFormComponents
                >)
                : opts.form;
        
        const extendedApi: AppFieldExtendedSolidFieldGroupApi<
            TFormData,
            TFieldGroupData,
            TFields,
            TOnMount,
            TOnChange,
            TOnChangeAsync,
            TOnBlur,
            TOnBlurAsync,
            TOnSubmit,
            TOnSubmitAsync,
            TOnDynamic,
            TOnDynamicAsync,
            TOnServer,
            TSubmitMeta,
            TComponents,
            TFormComponents
            > = api as never;
        extendedApi.AppForm = function AppForm(appFormProps) {
            return <form.AppForm {...appFormProps} />
        }

        extendedApi.AppField = function AppField(props) {
            return <form.AppField {...(formLensApi().getFormFieldOptions(props) as any)} />
        }

        extendedApi.Field = function Field(props) {
            return <form.Field {...(formLensApi().getFormFieldOptions(props) as any)} />    
        }

        extendedApi.Subscribe = function Subscribe(props: any) {
            return <LocalSubscribe lens={formLensApi()} selector={props.selector} children={ props.children} />
        }
        return Object.assign(extendedApi, {
			...opts.formComponents,
		}) as AppFieldExtendedSolidFieldGroupApi<
			TFormData,
			TFieldGroupData,
			TFields,
			TOnMount,
			TOnChange,
			TOnChangeAsync,
			TOnBlur,
			TOnBlurAsync,
			TOnSubmit,
			TOnSubmitAsync,
			TOnDynamic,
			TOnDynamicAsync,
			TOnServer,
			TSubmitMeta,
			TComponents,
			TFormComponents
		>;
    })())

    createRenderEffect(() => {
        formLensApi().mount()
    })
    return formLensApi;
}