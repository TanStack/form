import { type VariantProps, defineConfig } from 'cva';
import { twMerge } from 'tailwind-merge';

const { cva, cx, compose } = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
});

export { cva, cx, compose, type VariantProps };
