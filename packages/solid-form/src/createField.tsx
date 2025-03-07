import { FieldApi } from "@tanstack/form-core";
import {
	createComponent,
	createComputed,
	createMemo,
	createSignal,
	onCleanup,
	onMount,
} from "solid-js";
import type {
	DeepKeys,
	DeepValue,
	FieldAsyncValidateOrFn,
	FieldValidateOrFn,
	FormAsyncValidateOrFn,
	FormValidateOrFn,
	Narrow,
} from "@tanstack/form-core";

import type { JSXElement } from "solid-js";
import type { CreateFieldOptions } from "./types";

interface SolidFieldApi<
	TParentData,
	TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
	TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
	TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
	TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
	TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
	TParentSubmitMeta,
> {
	Field: FieldComponent<
		TParentData,
		TFormOnMount,
		TFormOnChange,
		TFormOnChangeAsync,
		TFormOnBlur,
		TFormOnBlurAsync,
		TFormOnSubmit,
		TFormOnSubmitAsync,
		TFormOnServer,
		TParentSubmitMeta
	>;
}

export type CreateField<
	TParentData,
	TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
	TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
	TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
	TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
	TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
	TParentSubmitMeta,
> = <
	TName extends DeepKeys<TParentData>,
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
	TSubmitMeta,
>(
	opts: () => { name: Narrow<TName> } & Omit<
		CreateFieldOptions<
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
			TFormOnMount,
			TFormOnChange,
			TFormOnChangeAsync,
			TFormOnBlur,
			TFormOnBlurAsync,
			TFormOnSubmit,
			TFormOnSubmitAsync,
			TFormOnServer,
			TSubmitMeta
		>,
		"form"
	>,
) => () => FieldApi<
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
	TFormOnMount,
	TFormOnChange,
	TFormOnChangeAsync,
	TFormOnBlur,
	TFormOnBlurAsync,
	TFormOnSubmit,
	TFormOnSubmitAsync,
	TFormOnServer,
	TParentSubmitMeta
> &
	SolidFieldApi<
		TParentData,
		TFormOnMount,
		TFormOnChange,
		TFormOnChangeAsync,
		TFormOnBlur,
		TFormOnBlurAsync,
		TFormOnSubmit,
		TFormOnSubmitAsync,
		TFormOnServer,
		TParentSubmitMeta
	>;

// ugly way to trick solid into triggering updates for changes on the fieldApi
function makeFieldReactive<
	TParentData,
	TName extends DeepKeys<TParentData>,
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
	TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
	TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
	TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
	TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
	TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
	TParentSubmitMeta,
>(
	fieldApi: FieldApi<
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
		TFormOnMount,
		TFormOnChange,
		TFormOnChangeAsync,
		TFormOnBlur,
		TFormOnBlurAsync,
		TFormOnSubmit,
		TFormOnSubmitAsync,
		TFormOnServer,
		TParentSubmitMeta
	> &
		SolidFieldApi<
			TParentData,
			TFormOnMount,
			TFormOnChange,
			TFormOnChangeAsync,
			TFormOnBlur,
			TFormOnBlurAsync,
			TFormOnSubmit,
			TFormOnSubmitAsync,
			TFormOnServer,
			TParentSubmitMeta
		>,
): () => FieldApi<
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
	TFormOnMount,
	TFormOnChange,
	TFormOnChangeAsync,
	TFormOnBlur,
	TFormOnBlurAsync,
	TFormOnSubmit,
	TFormOnSubmitAsync,
	TFormOnServer,
	TParentSubmitMeta
> &
	SolidFieldApi<
		TParentData,
		TFormOnMount,
		TFormOnChange,
		TFormOnChangeAsync,
		TFormOnBlur,
		TFormOnBlurAsync,
		TFormOnSubmit,
		TFormOnSubmitAsync,
		TFormOnServer,
		TParentSubmitMeta
	> {
	const [field, setField] = createSignal(fieldApi, { equals: false });
	const unsubscribeStore = fieldApi.store.subscribe(() => setField(fieldApi));
	onCleanup(unsubscribeStore);
	return field;
}

export function createField<
	TParentData,
	TName extends DeepKeys<TParentData>,
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
	TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
	TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
	TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
	TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
	TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
	TParentSubmitMeta,
>(
	opts: () => CreateFieldOptions<
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
		TFormOnMount,
		TFormOnChange,
		TFormOnChangeAsync,
		TFormOnBlur,
		TFormOnBlurAsync,
		TFormOnSubmit,
		TFormOnSubmitAsync,
		TFormOnServer,
		TParentSubmitMeta
	>,
) {
	const options = opts();

	const api = new FieldApi(options);

	const extendedApi: typeof api &
		SolidFieldApi<
			TParentData,
			TFormOnMount,
			TFormOnChange,
			TFormOnChangeAsync,
			TFormOnBlur,
			TFormOnBlurAsync,
			TFormOnSubmit,
			TFormOnSubmitAsync,
			TFormOnServer,
			TParentSubmitMeta
		> = api as never;

	extendedApi.Field = Field as never;

	let mounted = false;
	// Instantiates field meta and removes it when unrendered
	onMount(() => {
		const cleanupFn = api.mount();
		mounted = true;
		onCleanup(() => {
			cleanupFn();
			mounted = false;
		});
	});

	/**
	 * fieldApi.update should not have any side effects. Think of it like a `useRef`
	 * that we need to keep updated every render with the most up-to-date information.
	 *
	 * createComputed to make sure this effect runs before render effects
	 */
	createComputed(() => {
		if (!mounted) return;
		api.update(opts());
	});

	return makeFieldReactive<
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
		TFormOnMount,
		TFormOnChange,
		TFormOnChangeAsync,
		TFormOnBlur,
		TFormOnBlurAsync,
		TFormOnSubmit,
		TFormOnSubmitAsync,
		TFormOnServer,
		TParentSubmitMeta
	>(extendedApi as never);
}

type FieldComponentProps<
	TParentData,
	TName extends DeepKeys<TParentData>,
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
	TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
	TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
	TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
	TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
	TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
	TParentSubmitMeta,
> = {
	children: (
		fieldApi: () => FieldApi<
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
			TFormOnMount,
			TFormOnChange,
			TFormOnChangeAsync,
			TFormOnBlur,
			TFormOnBlurAsync,
			TFormOnSubmit,
			TFormOnSubmitAsync,
			TFormOnServer,
			TParentSubmitMeta
		>,
	) => JSXElement;
} & Omit<
	CreateFieldOptions<
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
		TFormOnMount,
		TFormOnChange,
		TFormOnChangeAsync,
		TFormOnBlur,
		TFormOnBlurAsync,
		TFormOnSubmit,
		TFormOnSubmitAsync,
		TFormOnServer,
		TParentSubmitMeta
	>,
	"form"
>;

export type FieldComponent<
	TParentData,
	TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
	TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
	TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
	TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
	TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
	TParentSubmitMeta,
> = <
	TName extends DeepKeys<TParentData>,
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
>({
	children,
	...fieldOptions
}: Omit<
	FieldComponentProps<
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
		TFormOnMount,
		TFormOnChange,
		TFormOnChangeAsync,
		TFormOnBlur,
		TFormOnBlurAsync,
		TFormOnSubmit,
		TFormOnSubmitAsync,
		TFormOnServer,
		TParentSubmitMeta
	>,
	"form"
>) => JSXElement;

export function Field<
	TParentData,
	TName extends DeepKeys<TParentData>,
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
	TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
	TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
	TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
	TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
	TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
	TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
	TParentSubmitMeta,
>(
	props: {
		children: (
			fieldApi: () => FieldApi<
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
				TFormOnMount,
				TFormOnChange,
				TFormOnChangeAsync,
				TFormOnBlur,
				TFormOnBlurAsync,
				TFormOnSubmit,
				TFormOnSubmitAsync,
				TFormOnServer,
				TParentSubmitMeta
			>,
		) => JSXElement;
	} & CreateFieldOptions<
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
		TFormOnMount,
		TFormOnChange,
		TFormOnChangeAsync,
		TFormOnBlur,
		TFormOnBlurAsync,
		TFormOnSubmit,
		TFormOnSubmitAsync,
		TFormOnServer,
		TParentSubmitMeta
	>,
) {
	const fieldApi = createField<
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
		TFormOnMount,
		TFormOnChange,
		TFormOnChangeAsync,
		TFormOnBlur,
		TFormOnBlurAsync,
		TFormOnSubmit,
		TFormOnSubmitAsync,
		TFormOnServer,
		TParentSubmitMeta
	>(() => {
		const { children, ...fieldOptions } = props;
		return fieldOptions;
	});

	return <>{createComponent(() => props.children(fieldApi), {})}</>;
}
