import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'octane/server';

import { useForm } from '../src';

function ServerForm() @{
	const form = useForm({
		defaultValues: {
			name: 'Server Ada',
		},
	});

	<form>
		<form.Field name="name">
			{(field) => <input id="name" value={field.state.value} />}
		</form.Field>
		<form.Subscribe selector={(state) => state.values.name}>
			{(name) => <output id="name-output">{name}</output>}
		</form.Subscribe>
	</form>
}

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
