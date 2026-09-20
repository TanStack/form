import { describe, expect, it } from 'vitest';
import { useSelector, useStore } from '@tanstack/octane-form';

describe('package exports', () => {
	it('exports useSelector and useStore from @tanstack/octane-store', () => {
		expect(useSelector).toBeTypeOf('function');
		expect(useStore).toBeTypeOf('function');
	});
});
