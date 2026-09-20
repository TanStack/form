import { resolve } from 'node:path';
import { describe, it } from 'vitest';
import {
	mountDifferential,
	preloadDifferentialFixture,
} from '../../../octane/tests/differential/_rig.js';

const fixture = resolve(__dirname, '../_fixtures/parity.tsrx');
const cache = resolve(__dirname, '.react-cache');

await Promise.all([preloadDifferentialFixture(fixture, cache)]);

describe('differential: @tanstack/octane-form vs @tanstack/react-form', () => {
	// @parity-case differential:tanstack-form-interactions
	it('matches values, validation, arrays, and reset', async () => {
		const differential = await mountDifferential(fixture, 'FormParity', undefined, cache);

		await differential.step('mount', () => {});
		await differential.step('validate an empty name', async (octane, react) => {
			await octane.input('#name', '');
			await react.input('#name', '');
		});
		await differential.step('enter a valid name', async (octane, react) => {
			await octane.input('#name', 'Grace');
			await react.input('#name', 'Grace');
		});
		await differential.step('push an array value', async (octane, react) => {
			await octane.click('#push');
			await react.click('#push');
		});
		await differential.step('pop an array value', async (octane, react) => {
			await octane.click('#pop');
			await react.click('#pop');
		});
		await differential.step('reset', async (octane, react) => {
			await octane.click('#reset');
			await react.click('#reset');
		});
		differential.unmount();
	});
});
