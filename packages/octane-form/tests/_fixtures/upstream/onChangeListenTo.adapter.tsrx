// Ported from @tanstack/react-form 1.33.2 to the Octane test renderer.
// OCTANE DIVERGENCE: upstream renders this sole scenario under <StrictMode>.
// Octane has no StrictMode double-invoke, so this file stays ordinary coverage.
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render } from '@octanejs/testing-library';
import { useSelector } from '@tanstack/octane-store';
import { useForm } from '@tanstack/octane-form';
import { sleep } from '../../conformance/utils';
import type { ReadonlyStore } from '@tanstack/octane-store';

function DebugSubscribe({ store }: { store: ReadonlyStore<any> }) {
	const isFieldsValidating = useSelector(store, (s) => s.isFieldsValidating);
	return <span data-testid="isFieldsValidating">{String(isFieldsValidating)}</span>;
}

describe('Octane adapter - onChangeListenTo race', () => {
	it('does not leave linked fields stuck in isValidating when multiple rapid updates occur', async () => {
		vi.useFakeTimers();

		const validationFn = vi.fn();

		function Comp() {
			const form = useForm({
				defaultValues: {
					street: '',
					houseNo: '',
					zipCode: '',
					city: '',
				},
			});

			return (
				<>
					<form.Field
						name="street"
						validators={{
							onChangeListenTo: ['houseNo', 'zipCode', 'city'],
							onChangeAsyncDebounceMs: 300,
							onChangeAsync: async () => {
								await sleep(500);
								validationFn();
								return undefined;
							},
						}}
						children={(field) => (
							<div>
								<input
									data-testid="street"
									value={field.state.value}
									onInput={(e) => field.handleChange(e.target.value)}
								/>
								<span data-testid="street-validating">{String(field.state.meta.isValidating)}</span>
							</div>
						)}
					/>

					<form.Field
						name="houseNo"
						children={(field) => (
							<div>
								<input
									data-testid="houseNo"
									value={field.state.value}
									onInput={(e) => field.handleChange(e.target.value)}
								/>
								<span data-testid="houseNo-validating">
									{String(field.state.meta.isValidating)}
								</span>
							</div>
						)}
					/>

					<form.Field
						name="zipCode"
						children={(field) => (
							<div>
								<input
									data-testid="zipCode"
									value={field.state.value}
									onInput={(e) => field.handleChange(e.target.value)}
								/>
								<span data-testid="zipCode-validating">
									{String(field.state.meta.isValidating)}
								</span>
							</div>
						)}
					/>

					<form.Field
						name="city"
						children={(field) => (
							<div>
								<input
									data-testid="city"
									value={field.state.value}
									onInput={(e) => field.handleChange(e.target.value)}
								/>
								<span data-testid="city-validating">{String(field.state.meta.isValidating)}</span>
							</div>
						)}
					/>

					<DebugSubscribe store={form.store} />
				</>
			);
		}

		const { getByTestId } = render(<Comp />);

		const street = getByTestId('street') as HTMLInputElement;
		const houseNo = getByTestId('houseNo') as HTMLInputElement;
		const zipCode = getByTestId('zipCode') as HTMLInputElement;
		const city = getByTestId('city') as HTMLInputElement;

		await act(async () => {
			// Simulate rapid updates (autofill), then run debounce + async validation.
			fireEvent.input(street, { target: { value: 'Foo Street' } });
			fireEvent.input(houseNo, { target: { value: '2' } });
			fireEvent.input(zipCode, { target: { value: '12345' } });
			fireEvent.input(city, { target: { value: 'Barrington' } });
			await vi.runAllTimersAsync();
		});

		expect(validationFn).toHaveBeenCalledTimes(1);

		// Verify validation flags are not stuck
		const isFieldsValidating = getByTestId('isFieldsValidating').textContent;
		const streetValidating = getByTestId('street-validating').textContent;
		const houseValidating = getByTestId('houseNo-validating').textContent;
		const zipValidating = getByTestId('zipCode-validating').textContent;
		const cityValidating = getByTestId('city-validating').textContent;

		expect(isFieldsValidating).toBe('false');
		expect(streetValidating).toBe('false');
		expect(houseValidating).toBe('false');
		expect(zipValidating).toBe('false');
		expect(cityValidating).toBe('false');

		vi.useRealTimers();
	});
});
