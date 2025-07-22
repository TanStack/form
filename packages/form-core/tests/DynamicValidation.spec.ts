import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { FieldApi, FormApi } from '../src/index'
import { rhfValidationLogic } from '../src/ValidationLogic';

describe('custom validation', () => {
    it('should handle default validation logic', () => {
        const form = new FormApi({
            defaultValues: {
                name: '',
            },
            validationLogic: rhfValidationLogic,
            validators: {
                onChange: z.object({
                    name: z.string().min(3, 'Name must be at least 3 characters long'),
                }),
            }
        })

        form.mount()

        const field = new FieldApi({
            form,
            name: 'name',
        })

        field.mount()

        expect(field.getValue()).toBe('')
        expect(field.state.meta.errorMap.onChange).toEqual([{
            message: 'Name must be at least 3 characters long',
        }]);

        field.setValue('Jo');
        expect(field.state.meta.errorMap.onChange).toEqual([{
            message: 'Name must be at least 3 characters long',
        }]);
        form.handleSubmit();

        expect(field.state.meta.errorMap.onChange).toEqual([{
            message: 'Name must be at least 3 characters long',
        }]);

        field.setValue('Joe123');

        expect(field.state.meta.errorMap.onChange).toEqual(undefined);
    });

    it('rhf validation should work as-expected', () => {
        const form = new FormApi({
            defaultValues: {
                name: '',
            },
            validationLogic: rhfValidationLogic,
            validators: {
                onDynamic: z.object({
                    name: z.string().min(3, 'Name must be at least 3 characters long'),
                }),
            }
        })

        form.mount()

        const field = new FieldApi({
            form,
            name: 'name',
        })

        field.mount()

        expect(field.getValue()).toBe('')
        expect(field.state.meta.errorMap.onDynamic).toBe(undefined);

        field.setValue('Jo');

        expect(field.state.meta.errorMap.onDynamic).toBe(undefined);

        form.handleSubmit();

        expect(field.state.meta.errorMap.onDynamic).toEqual([{
            message: 'Name must be at least 3 characters long',
        }]);

        field.setValue('Joe123');

        expect(field.state.meta.errorMap.onDynamic).toBe(undefined);
    })
});