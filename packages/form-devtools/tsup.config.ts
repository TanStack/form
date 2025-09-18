import { defineConfig } from 'tsup'
import { generateTsupOptions, parsePresetOptions } from 'tsup-preset-solid'

const preset_options = {
  entries: {
    entry: 'src/index.ts',
    dev_entry: true,
    server_entry: true,
  },
  cjs: false,
  drop_console: true,
}

export default defineConfig(() => {
  const parsed_data = parsePresetOptions(preset_options)
  const tsup_options = generateTsupOptions(parsed_data)

  return tsup_options.map((option) => ({
    ...option,
    loader: {
      '.png': 'dataurl',
    },
  }))
})
