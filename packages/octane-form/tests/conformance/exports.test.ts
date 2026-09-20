import { describe, expect, it } from 'vitest';
import { renderHook } from '@octanejs/testing-library';
import { act } from 'octane';
import { FormApi, useSelector } from '@tanstack/octane-form';

describe('package exports', () => {
	it('exports useSelector from the Octane Store adapter', () => {
		expect(useSelector).toBeTypeOf('function');
	});
});
	});
});
