import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { AnyFormApi, FieldApi, FieldValidators, FormApi, FormValidators } from '../src/index'

interface ValidationLogicProps {
    // TODO: Type this properly
    form: AnyFormApi,
    // TODO: Type this properly
    validators: FormValidators<any, any, any, any, any, any, any, any>
    event: {
        type: "blur" | "change" | "submit" | "mount" | "server"
        fieldName?: string
    }
    runValidation: (props: {
        validators: Array<FormValidators<any, any, any, any, any, any, any, any>[keyof FormValidators<any, any, any, any, any, any, any, any>]>
        form: AnyFormApi
    }) => void;
}

/**
 * This forces a form's validation logic to be ran as if it were a React Hook Form validation logic.
 * 
 * This means that it will only run the `onDynamic` validator, and it will not run any other validators and changes the validation
 * type based on the state of the form itself.
 * 
 * When the form is not yet submitted, it will not run the validation logic.
 * When the form is submitted, it will run the validation logic on `change`
 * 
 * TODO: In the future, we should allow the validation logic to be changed via a `mode` and `reValidateMode`
 * 
 * TODO: This should handle async validation properly, but will currently omit it for simplicity.
 * 
 * TODO: Handle field validation logic as well?
 */
function rhfValidationLogic(
    props: ValidationLogicProps
) {
    const validatorNames = Object.keys(props.validators);
    if (validatorNames.length === 0) {
        // No validators is a valid case, just return
        return;
    }

    if (validatorNames.length > 1) {
        throw new Error('Multiple validators are not supported with `rhfValidationLogic`')
    }

    const validatorName = validatorNames[0] as keyof FormValidators<any, any, any, any, any, any, any, any>;
    if (validatorName !== 'onDynamic') {
        throw new Error(`Only 'onDynamic' validators are supported with 'rhfValidationLogic', but got '${validatorName}'`)
    }

    const validator = props.validators[validatorName];
    if (props.form.state.submissionAttempts === 0) {
        if (props.event.type !== 'submit') return;
        return props.runValidation({
            validators: [validator],
            form: props.form,
        });
    }

    if (props.event.type === "change") return;

    return props.runValidation({
        validators: [validator],
        form: props.form,
    });
}

function defaultValidationLogic(
    props: ValidationLogicProps
) {
    switch (props.event.type) {
        case 'mount': {
            // Run mount validation
            return props.runValidation({
                validators: [props.validators.onMount],
                form: props.form,
            });
        }
        case 'submit': {
            // Run change, blur, submit, server validation
            return props.runValidation({
                validators: [
                    props.validators.onChange,
                    props.validators.onBlur,
                    props.validators.onSubmit,
                    // TODO: Fix this type
                    (props.validators as any).onServer,
                ],
                form: props.form,
            });
        }
        case 'server': {
            // Run server validation
            return props.runValidation({
                validators: [(props.validators as any).onServer],
                form: props.form,
            });
        }
        case 'blur': {
            // Run blur, server validation
            return props.runValidation({
                validators: [
                    props.validators.onBlur,
                    (props.validators as any).onServer,
                ],
                form: props.form,
            });
        }
        case 'change': {
            // Run change, server validation
            return props.runValidation({
                validators: [
                    props.validators.onChange,
                    (props.validators as any).onServer,
                ],
                form: props.form,
            });
        }
        default: {
            throw new Error(`Unknown validation event type: ${props.event.type}`);
        }
    }
}

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