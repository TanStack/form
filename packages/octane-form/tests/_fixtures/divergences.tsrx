import { fireEvent, render } from '@octanejs/testing-library';
import { createFormHook, createFormHookContexts, useForm } from '../../src/index';

export function renderRegisteredFieldComponent() {
	const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

	function TextField({ label }: { label: string }) {
		const field = useFieldContext<string>();
		return <label>
			{label}
			<input
				value={field.state.value}
				onInput={(event) => field.handleChange(event.target.value)}
			/>
		</label>;
	}

	const { useAppForm } = createFormHook({
		fieldComponents: { TextField },
		formComponents: {},
		fieldContext,
		formContext,
	});

	function App() {
		const form = useAppForm({ defaultValues: { name: 'Ada' } });
		return <form.AppField name="name">
			{(field) => <field.TextField label="Name" />}
		</form.AppField>;
	}

	return render(<App />).getByLabelText('Name');
}

export function renderNativeEventForm() {
	let observedEvent: Event | undefined;

	function App() {
		const form = useForm({ defaultValues: { name: '' } });
		return <form.Field name="name">
			{(field) => <input
				aria-label="Name"
				value={field.state.value}
				onInput={(event) => {
					observedEvent = event;
					field.handleChange(event.target.value);
				}}
			/>}
		</form.Field>;
	}

	const input = render(<App />).getByLabelText('Name');
	fireEvent.input(input, { target: { value: 'Grace' } });
	return { input, observedEvent };
}
