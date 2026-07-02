import * as goober from 'goober'
import { createEffect, createSignal } from 'solid-js'
import { useTheme } from '@tanstack/devtools-ui'
import { tokens } from './tokens'

const stylesFactory = (theme: 'light' | 'dark') => {
  const { colors, font, size, border } = tokens
  const { size: fontSize } = font
  const themeColors = colors.theme[theme]
  const css = goober.css

  return {
    panelHeader: css`
      align-items: center;
      background: ${themeColors.surface.panel};
      border-bottom: 1px solid ${themeColors.border.default};
      color: ${themeColors.text.primary};
      display: flex;
      flex-shrink: 0;
      flex-wrap: wrap;
      font-size: ${fontSize.md};
      font-weight: ${font.weight.bold};
      gap: ${size[2]};
      justify-content: space-between;
      padding: ${size[2]};
      position: sticky;
      top: 0;
      z-index: 5;
    `,
    segmentedControl: css`
      align-items: center;
      background: ${themeColors.surface.subtle};
      border: 1px solid ${themeColors.border.default};
      border-radius: ${border.radius.sm};
      display: inline-flex;
      flex: 0 0 auto;
      overflow: hidden;
    `,
    segmentedButton: css`
      appearance: none;
      background: ${themeColors.interactive.resting};
      border: 0;
      color: ${themeColors.text.secondary};
      cursor: pointer;
      display: inline-flex;
      font: inherit;
      font-size: ${fontSize['2xs']};
      font-weight: ${font.weight.semibold};
      justify-content: center;
      letter-spacing: 0;
      line-height: ${font.lineHeight['2xs']};
      margin: 0;
      min-height: ${size[5]};
      min-width: ${size[10]};
      padding: ${size[0.5]} ${size[1.5]};
      white-space: nowrap;

      &:not(:first-child) {
        border-left: 1px solid ${themeColors.border.default};
      }

      &:hover {
        background: ${themeColors.interactive.subtleHover};
        color: ${themeColors.text.primary};
      }

      &:focus-visible {
        outline: 2px solid ${themeColors.border.focus};
        outline-offset: -2px;
      }
    `,
    segmentedButtonActive: css`
      background: ${themeColors.interactive.active};
      color: ${themeColors.interactive.activeText};
    `,
    placeholderContent: css`
      color: ${themeColors.text.primary};
      font-size: ${fontSize.sm};
      line-height: ${font.lineHeight.md};
      padding: ${size[3]};
    `,
  }
}

export function useStyles() {
  const { theme } = useTheme()
  const [styles, setStyles] = createSignal(stylesFactory(theme()))
  createEffect(() => {
    setStyles(stylesFactory(theme()))
  })
  return styles
}
