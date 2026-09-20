import { FormApi, functionalUpdate, mergeAndUpdate } from '@tanstack/form-core';
import { useSelector } from '@tanstack/octane-store';
import { useMemo, useRef, useState } from 'octane';
import { Field } from './useField.tsrx';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { useFormId } from './useFormId';
import { FormGroup } from './useFormGroup.tsrx';
import type { FormGroupComponent } from './useFormGroup.tsrx';
import type {
	AnyFormApi,
	AnyFormState,
	FormAsyncValidateOrFn,
	FormOptions,
	FormState,
	FormValidateOrFn,
} from '@tanstack/form-core';
import type { FieldComponent } from './useField.tsrx';
import type { SubscribeComponent } from './types';

type FormRenderable = unknown;
type FormPropsWithChildren<P = object> = P & { children?: FormRenderable };
type FormFunctionComponent<P = object> = (props: P) => FormRenderable;

/**
 * Fields that are added onto the `FormAPI` from `@tanstack/form-core` and returned from `useForm`
 */
export interface OctaneFormApi<
	in out TFormData,
	in out TOnMount extends undefined | FormValidateOrFn<TFormData>,
	in out TOnChange extends undefined | FormValidateOrFn<TFormData>,
	in out TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
	in out TOnBlur extends undefined | FormValidateOrFn<TFormData>,
	in out TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
	in out TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
	in out TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
	in out TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
	in out TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
	in out TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
	in out TSubmitMeta,
> {
	/**
	 * A component to render form fields. With this, you can render and manage individual form fields.
	 */
	Field: FieldComponent<
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
		TSubmitMeta
	>;
	FormGroup: FormGroupComponent<
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
		TSubmitMeta
	>;
	/**
	 * A `Subscribe` function that allows you to listen and react to changes in the form's state. It's especially useful when you need to execute side effects or render specific components in response to state updates.
	 */
	Subscribe: SubscribeComponent<
		FormState<
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
			TOnServer
		>
	>;
}

/**
 * An extended version of the `FormApi` class that includes renderer-specific components from `OctaneFormApi`
 */
export type OctaneFormExtendedApi<
	TFormData,
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
> = FormApi<
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
	TSubmitMeta
> &
	OctaneFormApi<
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
		TSubmitMeta
	>;

function LocalSubscribe({
	form,
	selector = (state) => state,
	children,
}: FormPropsWithChildren<{
	form: AnyFormApi;
	selector?: (state: AnyFormState) => AnyFormState;
}>): ReturnType<FormFunctionComponent> {
	const data = useSelector(form.store, selector);

	return <>{functionalUpdate(children, data)}</>;
}

/**
 * A custom hook that returns an extended instance of the `FormApi` class.
 *
 * This API encapsulates all the necessary functionalities related to the form. It allows you to manage form state, handle submissions, and interact with form fields
 */
export function useForm<
	TFormData,
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
>(
	opts?: FormOptions<
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
		TSubmitMeta
	>,
) {
	const fallbackFormId = useFormId();
	const formId = opts?.formId ?? fallbackFormId;
	const [prevFormId, setPrevFormId] = useState(formId);

	const [formApi, setFormApi] = useState(() => {
		return new FormApi<
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
			TSubmitMeta
		>({ ...opts, formId });
	});

	if (prevFormId !== formId) {
		setFormApi(new FormApi({ ...opts, formId }));
		setPrevFormId(formId);
	}

	const extendedFormApi = useMemo(() => {
		const extendedApi: OctaneFormExtendedApi<
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
			TSubmitMeta
		> = {
			...formApi,
			handleSubmit: ((...props: never[]) => {
				return formApi._handleSubmit(...props);
			}) as typeof formApi.handleSubmit,
			// We must add all `get`ters from `core`'s `FormApi` here, as otherwise the spread operator won't catch those
			get formId(): string {
				return formApi._formId;
			},
			get state() {
				return formApi.store.state;
			},
		} as never;

		extendedApi.Field = function APIField(props) {
			return <Field {...props} form={formApi} />;
		};

		extendedApi.FormGroup = function APIFormGroup(props) {
			return <FormGroup {...props} form={formApi} />;
		};

		extendedApi.Subscribe = function Subscribe(props: any) {
			return <LocalSubscribe form={formApi} selector={props.selector} children={props.children} />;
		};

		return extendedApi;
	}, [formApi]);

	useIsomorphicLayoutEffect(formApi.mount, [formApi]);

	/**
	 * formApi.update should not have any side effects. Think of it like a `useRef`
	 * that we need to keep updated every render with the most up-to-date information.
	 */
	useIsomorphicLayoutEffect(() => {
		formApi.update(opts);
	});

	const hasRan = useRef(false);

	useIsomorphicLayoutEffect(() => {
		if (!hasRan.current) return;
		if (!opts?.transform) return;
		mergeAndUpdate(formApi, opts.transform as never);
	}, [formApi, opts?.transform]);

	useIsomorphicLayoutEffect(() => {
		hasRan.current = true;
	});

	return extendedFormApi;
}
