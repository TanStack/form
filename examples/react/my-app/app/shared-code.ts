import { formOptions } from '@tanstack/react-form'

export const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    age: 0,
  },
  validators: [
    {
      run: () => 'Error',
      triggers: ['server'],
    },
    {
      run: () => z.object({}).transform(() => 0),
      triggers: ['server'],
    },
    {
      run: () => z.object({}).transform(() => 1),
      triggers: ['server'],
    },
  ],
})

// const someAction = createServerValidate({
// ...formOptions,
//
// });

// Draft A

// export const formOpts = formOptions({
//   defaultValues: {
//     firstName: '',
//     age: 0,
//   },
//   validators: [
//     {
//       run: () => 'Error',
//       triggers: ['server']
//   ],
//   serverState: <useActionState>.state.formState
// })

// (formData) => ...
// [{ formState }: Data?, action] = useActionState

// const someAction = createServerValidate(formOpts);

// <within a server function>
// Throwable
// const {outputs, data} = await someAction(formData)

// For beta: RFC?

// ----------------
// Might omit for now, as focus on Next.js
// ----------------

// // Possibility to use single package from core for `createServerValidate` with many frameworks:

// import { serverValidateHelper } "@tanstack/react-form";
// import { start } from '@tanstack/react-form-start';
// import { next } from '@tanstack/react-form-nextjs'; // :(

// const { createServerValidate } = serverValidateHelper({ framework: start() })

// const someAction = createServerValidate(formOpts);
// framework: {
//   setPersistenceValue,
//   getPersistenceValue
// }

// // But problem exists if the meta-framework requires the user to explicitly define `req`/`res` (unlike Start)
// // In which case:

// const someAction: CustomizedValidateFnFromStart = createServerValidate(formOpts, { framework: start() /* Overload that changes the return type of `createServerValidate` when used */ });
//
// someAction(formData, {req, res})
