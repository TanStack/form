import { useForm } from '@tanstack/octane-form';

export function FormParity() @{
	const form = useForm({
		defaultValues: {
			name: 'Ada',
			tags: ['compiler'],
		},
	});

	<form
		onSubmit={(event) => {
			event.preventDefault();
			void form.handleSubmit();
		}}
	>
		<form.Field
			name="name"
			validators={{
				onChange: ({ value }) => (value.length === 0 ? 'Name is required' : undefined),
			}}
		>
			{(field) => <label>
				Name
				<input
					id="name"
					value={field.state.value}
					onBlur={field.handleBlur}
					onInput={(event) => field.handleChange(event.target.value)}
				/>
				<span id="name-errors">{field.state.meta.errors.join('|')}</span>
			</label>}
		</form.Field>

		<form.Field name="tags" mode="array">
			{(field) => <div>
				<button id="push" type="button" onClick={() => field.pushValue('runtime')}>
					push
				</button>
				<button
					id="pop"
					type="button"
					onClick={() => field.removeValue(field.state.value.length - 1)}
				>
					pop
				</button>
			</div>}
		</form.Field>

		<form.Subscribe selector={(state) => state.values}>
			{(values) => <output id="values">{JSON.stringify(values)}</output>}
		</form.Subscribe>
		<form.Subscribe selector={(state) => state.canSubmit}>
			{(canSubmit) => <button id="submit" type="submit" disabled={!canSubmit}>
				submit
			</button>}
		</form.Subscribe>
		<button id="reset" type="button" onClick={() => form.reset()}>
			reset
		</button>
	</form>
}
