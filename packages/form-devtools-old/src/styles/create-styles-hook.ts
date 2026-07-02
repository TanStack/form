import { createEffect, createSignal } from 'solid-js'
import { useTheme } from '@tanstack/devtools-ui'

export type ThemeName = 'light' | 'dark'

export function createStylesHook<TStyles>(
  stylesFactory: (theme: ThemeName) => TStyles,
) {
  return function useGeneratedStyles() {
    const { theme } = useTheme()
    const [styles, setStyles] = createSignal(stylesFactory(theme()))

    createEffect(() => {
      setStyles(() => stylesFactory(theme()))
    })

    return styles
  }
}
