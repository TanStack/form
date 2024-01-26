import { type VariantProps, cva } from './utils'

const buttonVariants = cva({
  variants: {
    base: {
      true: 'relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-md font-sora text-sm font-medium text-black dark:text-white transition-colors focus-visible:z-20 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-blue-500 disabled:pointer-events-none disabled:opacity-50',
    },
    variant: {
      primary:
        'bg-blue-500 text-white dark:text-white transition duration-200 hover:-translate-y-1 hover:bg-blue-500/90 hover:shadow-lg hover:shadow-blue-600/90 focus-visible:-translate-y-1 focus-visible:bg-blue/90 focus-visible:shadow-lg focus-visible:shadow-blue-600/90',
      secondary:
        'bg-gray-500 text-white dark:text-white transition duration-200 hover:-translate-y-1 hover:bg-gray-500/90 hover:shadow-lg hover:shadow-gray-600/90 focus-visible:-translate-y-1 focus-visible:bg-gray-500/90 focus-visible:shadow-lg focus-visible:shadow-gray-600/90',
      outline:
        'border border-gray-300 bg-white dark:bg-black hover:bg-accent/50 focus-visible:bg-accent/50 dark:border-gray-700',
      ghost:
        'hover:bg-gray-200 focus-visible:bg-gray-200 hover:dark:bg-gray-800 focus-visible:dark:bg-gray-800',
      opacity:
        'opacity-75 transition-opacity hover:opacity-100 focus-visible:opacity-100',
      link: 'underline-offset-4 hover:underline',
    },
    size: {
      xs: 'h-6 px-2.5',
      sm: 'h-8 p-1',
      md: 'h-10 px-4 py-2',
      icon: 'h-10 w-10',
    },
  },
})

type buttonVariantProps = VariantProps<typeof buttonVariants>

const inputVariants = cva({
  base: 'peer select-none appearance-none border focus:ring-0 focus:ring-offset-0 border-gray-300 transition-colors focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 focus-visible:dark:border-blue-500',
  variants: {
    type: {
      text: 'flex h-10 w-full rounded-md bg-white dark:bg-black px-3 py-2 text-sm placeholder:text-gray-500',
      password:
        'flex h-10 w-full rounded-md bg-white dark:bg-black px-3 py-2 text-sm placeholder:text-gray-500',
      tel: 'flex h-10 w-full rounded-md bg-white dark:bg-black px-3 py-2 text-sm placeholder:text-gray-500',
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

export {
  buttonVariants,
  inputVariants,
  type buttonVariantProps,
  type inputVariantProps,
}
