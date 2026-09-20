import { renderHook } from '@octanejs/testing-library';
import { describe, expect, it } from 'vitest';
import { useForm } from '../../src/index';
import {
	renderNativeEventForm,
	renderRegisteredFieldComponent,
} from '../_fixtures/divergences.tsrx';

describe('@tanstack/octane-form documented divergences', () => {
	it('keeps the generated form identity stable across rerenders', () => {
		const { result, rerender } = renderHook(() => useForm({ defaultValues: { name: '' } }));
		const initial = result.current.formId;
		rerender();
		expect(initial).toBeTruthy();
		expect(result.current.formId).toBe(initial);
	});

	it('registers and renders callable Octane field components', () => {
		expect(renderRegisteredFieldComponent()).toHaveValue('Ada');
	});

	it('receives the native input event while updating field state', () => {
		const { input, observedEvent } = renderNativeEventForm();
		expect(observedEvent).toBeInstanceOf(Event);
		expect('nativeEvent' in observedEvent!).toBe(false);
		expect(input).toHaveValue('Grace');
	});
});
