import { useForm } from '@tanstack/octane-form';

export function ServerForm() @{
	const form = useForm({
		defaultValues: {
			name: 'Server Ada',
		},
	});

	<form>
		<form.Field name="name">
			{(field) => <input id="name" value={field.state.value} />}
		</form.Field>
		<form.Subscribe selector={(state) => state.values.name}>
			{(name) => <output id="name-output">{name}</output>}
		</form.Subscribe>
	</form>
}
