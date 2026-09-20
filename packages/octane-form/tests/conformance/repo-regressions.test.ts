// Ordinary repository-authored regressions; not react-parity owned.
import '../_fixtures/ordinary/repo-regressions.tsrx';
import { expect, it } from 'vitest';
import { FieldApi, FormApi } from '@tanstack/octane-form';

it('deleting a field preserves a mounted sibling whose name shares its prefix', () => {
	const form = new FormApi({ defaultValues: { name: 'Ada', nameSuffix: 'Lovelace' } });
	const unmountForm = form.mount();
	const sibling = new FieldApi({ form, name: 'nameSuffix' });
	const unmountSibling = sibling.mount();
	try {
		form.deleteField('name');
		expect(form.getFieldValue('name')).toBeUndefined();
		expect(form.getFieldValue('nameSuffix')).toBe('Lovelace');
		sibling.handleChange('Byron');
		expect(form.getFieldValue('nameSuffix')).toBe('Byron');
	} finally {
		unmountSibling();
		unmountForm();
	}
});
