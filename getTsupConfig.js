// @ts-check

import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions'

/**
 * @param {Object} opts - Options for building configurations.
 * @param {string[]} opts.entry - The entry array.
 * @returns {import('tsup').Options}
 */
export function modernConfig(opts) {
  return {
    entry: opts.entry,
    format: ['cjs', 'esm'],
    target: ['chrome91', 'firefox90', 'edge91', 'safari15', 'ios15', 'opera77'],
    outDir: 'build/modern',
    dts: true,
    sourcemap: true,
    clean: true,
    esbuildPlugins: [esbuildPluginFilePathExtensions({ esmExtension: 'js' })],
  }
}

/**
 * @param {Object} opts - Options for building configurations.
 * @param {string[]} opts.entry - The entry array.
 * @returns {import('tsup').Options}
 */
export function legacyConfig(opts) {
  return {
    entry: opts.entry,
    format: ['cjs', 'esm'],
    target: ['es2020', 'node16'],
    outDir: 'build/legacy',
    external: [/@tanstack/],
    dts: {
      resolve: true,
      compilerOptions: {
        paths: {
          '@tanstack/form-core': ['@tanstack/form-core'],
          '@tanstack/react-form': ['@tanstack/react-form'],
          '@tanstack/vue-form': ['@tanstack/vue-form'],
          '@tanstack/solid-form': ['@tanstack/solid-form'],
          '@tanstack/yup-form-adapter': ['@tanstack/yup-form-adapter'],
          '@tanstack/zod-form-adapter': ['@tanstack/zod-form-adapter'],
          '@tanstack/valibot-form-adapter': ['@tanstack/valibot-form-adapter'],
        },
      },
    },
    sourcemap: true,
    clean: true,
    esbuildPlugins: [esbuildPluginFilePathExtensions({ esmExtension: 'js' })],
  }
}
