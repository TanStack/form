import { describe, expect, it } from 'vitest';
import * as binding from '@tanstack/octane-form';

describe('export surface', () => {
	it('provides every runtime export of real @tanstack/react-form', async () => {
		const real = await import('@tanstack/react-form');
		expect(Object.keys(binding).sort()).toEqual(Object.keys(real).sort());
	});

	it('re-exports the same @tanstack/form-core module instance', async () => {
		const core = await import('@tanstack/form-core');
		expect(binding.FormApi).toBe(core.FormApi);
		expect(binding.FieldApi).toBe(core.FieldApi);
		expect(binding.formOptions).toBe(core.formOptions);
	});

	it('uses the Octane TanStack Store adapter', async () => {
		const store = await import('@tanstack/octane-store');
		expect(binding.useSelector).toBe(store.useSelector);
		expect(binding.useStore).toBe(store.useStore);
	});
});
