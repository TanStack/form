// Repository-authored regressions that are not present in the pinned upstream
// suite. Keep them outside react-parity ownership so ordinary shards execute
// them.
import { describe, expect, it } from 'vitest';
import { render, waitFor } from '@octanejs/testing-library';
import { userEvent } from '@testing-library/user-event';
import { useReducer, useState } from 'octane';
import { useForm } from '@tanstack/octane-form';

const user = userEvent.setup();

describe('tanstack-form repository regressions', () => {
	it('mounts a replacement form when an explicit formId is removed', async () => {
		const mountedIds: string[] = [];

		function Comp() {
			const [formId, setFormId] = useState<string | undefined>('first');
			const [, forceRender] = useReducer((count) => count + 1, 0);
			const form = useForm({
				formId,
				listeners: {
					onMount: () => mountedIds.push(formId ?? 'fallback'),
				},
			});

			return <>
				<span data-testid="dynamic-form-id">{form.formId}</span>
				<button data-testid="clear-form-id" onClick={() => setFormId(undefined)}>
					clear
				</button>
				<button data-testid="rerender-form" onClick={forceRender}>
					rerender
				</button>
			</>;
		}

		const { getByTestId } = render(<Comp />);
		const id = getByTestId('dynamic-form-id');
		expect(id).toHaveTextContent('first');
		expect(mountedIds).toEqual(['first']);

		await user.click(getByTestId('clear-form-id'));
		await waitFor(() => expect(mountedIds).toEqual(['first', 'fallback']));
		expect(id).not.toHaveTextContent('first');
		const fallbackId = id.textContent;
		expect(fallbackId).not.toBe('');

		await user.click(getByTestId('rerender-form'));
		expect(id).toHaveTextContent(fallbackId!);
		expect(mountedIds).toEqual(['first', 'fallback']);
	});

	it('uses the current group state throughout a name change render', async () => {
		const observedValues: string[] = [];

		function Comp() {
			const [groupName, setGroupName] = useState<'step1' | 'step2'>('step1');
			const form = useForm({
				defaultValues: {
					step1: { label: 'first' },
					step2: { label: 'second' },
				},
			});

			return <>
				<button data-testid="change-group" onClick={() => setGroupName('step2')}>
					change
				</button>
				<form.FormGroup name={groupName}>
					{(group) => {
						observedValues.push(group.state.value.label);
						return <span data-testid="group-label">{group.state.value.label}</span>;
					}}
				</form.FormGroup>
			</>;
		}

		const { getByTestId } = render(<Comp />);
		expect(getByTestId('group-label')).toHaveTextContent('first');

		observedValues.length = 0;
		await user.click(getByTestId('change-group'));

		expect(getByTestId('group-label')).toHaveTextContent('second');
		expect(observedValues).not.toContain('first');
	});
});
