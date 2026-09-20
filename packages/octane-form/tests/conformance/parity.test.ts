import { describe, expect, it } from 'vitest';
import * as binding from '@tanstack/octane-form';

describe('export surface', () => {
	it('provides the React runtime exports using useSelector for store subscriptions', async () => {
		const real = await import('@tanstack/react-form');
		// The Octane Store adapter uses useSelector and omits the deprecated useStore alias.
		const reactExports = Object.keys(real).filter((name) => name !== 'useStore');
		expect(Object.keys(binding).sort()).toEqual(reactExports.sort());
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
	});
});
