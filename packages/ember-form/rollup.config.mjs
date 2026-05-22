import { babel } from '@rollup/plugin-babel';
import { Addon } from '@embroider/addon-dev/rollup';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const babelConfig = resolve(rootDirectory, './babel.publish.config.cjs');

const extensions = ['.js', '.ts', '.gjs', '.gts'];

export default {
  output: addon.output(),

  plugins: [
    addon.publicEntrypoints(['**/*.js', 'index.js'], {
      exclude: ['-private/**'],
    }),

    addon.dependencies(),

    babel({
      extensions,
      babelHelpers: 'bundled',
      configFile: babelConfig,
    }),

    addon.gjs(),
    addon.declarations(
      'declarations',
      'pnpm ember-tsc --declaration --emitDeclarationOnly --declarationDir declarations -p tsconfig.publish.json',
    ),
    addon.clean(),
  ],
};
