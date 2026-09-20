import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'octane/server';
import { ServerForm } from '../_fixtures/server.tsrx';

describe('@tanstack/octane-form SSR', () => {
	it('renders field and form snapshots without a DOM', () => {
		expect(typeof document).toBe('undefined');

		const { html, css } = renderToStaticMarkup(ServerForm);

		expect(html).toBe(
			'<form><input id="name" value="Server Ada"/><output id="name-output">Server Ada</output></form>',
		);
		expect(css).toBe('');
	});
});
