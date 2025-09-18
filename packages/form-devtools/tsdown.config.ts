import { defineConfig } from 'tsdown'
import { parsePresetOptions } from 'tsup-preset-solid'

const preset_options = {
  entries: {
    entry: 'src/index.ts',
    dev_entry: true,
    server_entry: true,
  },
  loader: {
    '.png': 'dataurl',
  },
  cjs: false,
  drop_console: true,
}

export default defineConfig(parsePresetOptions(preset_options))
