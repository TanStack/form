// OCTANE DIVERGENCE: upstream wraps these scenarios in <StrictMode> to prove
// double-invoke behavior. Octane has no StrictMode double-invoke, so the cases
// run without that wrapper as ordinary package coverage rather than React
// parity evidence.
import { describe, expect, it } from 'vitest';
import { render } from '@octanejs/testing-library';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'octane';
import { useForm } from '@tanstack/octane-form';
import type { AnyFieldApi } from '@tanstack/octane-form';

const user = userEvent.setup();

describe('useField StrictMode divergences', () => {
	it('should handle strict mode properly with conditional fields', async () => {
		function FieldInfo({ field }: { field: AnyFieldApi }) {
			return <>
				{field.state.meta.isTouched && field.state.meta.errors.length
					? <em>{field.state.meta.errors.join(',')}</em>
					: null}
				{field.state.meta.isValidating ? 'Validating...' : null}
			</>;
		}

		function Comp() {
			const [showField, setShowField] = useState(true);

			const form = useForm({
				defaultValues: {
					firstName: '',
					lastName: '',
				},
				onSubmit: async () => {},
			});

			return <div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div>
						{/* A type-safe field component*/}
						{showField
							? <form.Field
									name="firstName"
									validators={{
										onChange: ({ value }) => (!value ? 'A first name is required' : undefined),
									}}
									children={(field) => {
										// Avoid hasty abstractions. Render props are great!
										return <>
											<label htmlFor={field.name}>First Name:</label>
											<input
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onInput={(e) => field.handleChange(e.target.value)}
											/>
											<FieldInfo field={field} />
										</>;
									}}
								/>
							: null}
					</div>
					<div>
						<form.Field
							name="lastName"
							children={(field) => <>
								<label htmlFor={field.name}>Last Name:</label>
								<input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onInput={(e) => field.handleChange(e.target.value)}
								/>
								<FieldInfo field={field} />
							</>}
						/>
					</div>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => <button type="submit" disabled={!canSubmit}>
							{isSubmitting ? '...' : 'Submit'}
						</button>}
					/>
					<button type="button" onClick={() => setShowField((prev) => !prev)}>
						{showField ? 'Hide field' : 'Show field'}
					</button>
				</form>
			</div>;
		}

		const { getByText, findByText, queryByText } = render(<Comp />);

		await user.click(getByText('Submit'));
		expect(await findByText('A first name is required')).toBeInTheDocument();
		await user.click(getByText('Hide field'));
		await user.click(getByText('Submit'));
		expect(queryByText('A first name is required')).not.toBeInTheDocument();
	});

	it('should handle deeply nested values', async () => {
		function Comp() {
			const form = useForm({
				defaultValues: {
					name: { first: 'Test', last: 'User' },
				},
			});

			return <form.Field name="name.last" children={(field) => <p>{field.state.value}</p>} />;
		}

		const { queryByText, findByText } = render(<Comp />);

		expect(queryByText('Test')).not.toBeInTheDocument();
		expect(await findByText('User')).toBeInTheDocument();
	});
});
