import { type VariantProps, cva } from './utils'

const inputVariants = cva({
  base: 'peer select-none appearance-none border outline-none border-gray-300 transition-colors focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 focus-visible:dark:border-blue-500',
  variants: {
    type: {
      text: 'flex h-10 w-full rounded-md bg-white dark:bg-black px-3 py-2 text-sm placeholder:text-gray-500',
      password:
        'flex h-10 w-full rounded-md bg-white dark:bg-black px-3 py-2 text-sm placeholder:text-gray-500',
      checkbox:
        'h-4 w-4 cursor-pointer rounded-sm bg-white dark:bg-black transition-colors checked:border-blue-500 checked:bg-blue-500 checked:hover:bg-blue-500 checked:focus:bg-blue-500 checked:dark:border-blue-500',
      number:
        'flex h-10 w-full rounded-md bg-white dark:bg-black px-3 py-2 text-sm [appearance:textfield] placeholder:text-gray-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
    },
    invalid: {
      true: 'border-red-500 focus-visible:border-red-500 dark:border-red-500 focus-visible:dark:border-red-500',
    },
  },
})

type inputVariantProps = VariantProps<typeof inputVariants>

export { inputVariants, type inputVariantProps }
