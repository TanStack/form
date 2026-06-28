import { css } from 'goober'
import { createStylesHook } from './create-styles-hook'
import { tokens } from './tokens'
import type { ThemeName } from './create-styles-hook'

function createFieldMetaBadgeStyles(theme: ThemeName) {
  const { colors, size, font, border, alpha } = tokens
  const themeColors = colors.theme[theme]
  const { size: fontSize } = font
  const toneColors = {
    pristine: theme === 'dark' ? '#2dd4bf' : '#0f766e',
    touched: themeColors.text.accent,
    blurred: theme === 'dark' ? '#c084fc' : '#7e22ce',
  }

  return {
    badge: css`
      --field-meta-badge-bg: ${themeColors.surface.subtle};
      --field-meta-badge-border: ${themeColors.border.default};
      --field-meta-badge-color: ${themeColors.text.secondary};

      background: var(--field-meta-badge-bg);
      border: 1px solid var(--field-meta-badge-border);
      border-radius: ${border.radius.sm};
      color: var(--field-meta-badge-color);
      display: inline-flex;
      flex: 0 1 auto;
      font-size: ${fontSize['2xs']};
      font-weight: ${font.weight.semibold};
      line-height: ${font.lineHeight['2xs']};
      max-width: 100%;
      min-width: 0;
      overflow: hidden;
      padding: ${size[0.5]} ${size[1]};
      text-overflow: ellipsis;
      white-space: nowrap;

      &[data-size='md'] {
        font-size: ${fontSize.xs};
        line-height: ${font.lineHeight.xs};
        padding: ${size[0.5]} ${size[1.5]};
      }

      &[data-tone='pristine'] {
        --field-meta-badge-bg: ${toneColors.pristine}${alpha[10]};
        --field-meta-badge-border: ${toneColors.pristine}${alpha[30]};
        --field-meta-badge-color: ${toneColors.pristine};
      }

      &[data-tone='success'] {
        --field-meta-badge-bg: ${themeColors.status.success}${alpha[10]};
        --field-meta-badge-border: ${themeColors.status.success}${alpha[30]};
        --field-meta-badge-color: ${themeColors.status.success};
      }

      &[data-tone='warning'] {
        --field-meta-badge-bg: ${themeColors.status.warning}${alpha[10]};
        --field-meta-badge-border: ${themeColors.status.warning}${alpha[30]};
        --field-meta-badge-color: ${themeColors.status.warning};
      }

      &[data-tone='touched'] {
        --field-meta-badge-bg: ${themeColors.interactive.active};
        --field-meta-badge-border: ${themeColors.interactive.focusRing};
        --field-meta-badge-color: ${toneColors.touched};
      }

      &[data-tone='blurred'] {
        --field-meta-badge-bg: ${toneColors.blurred}${alpha[10]};
        --field-meta-badge-border: ${toneColors.blurred}${alpha[30]};
        --field-meta-badge-color: ${toneColors.blurred};
      }

      &[data-tone='danger'] {
        --field-meta-badge-bg: ${themeColors.status.danger}${alpha[10]};
        --field-meta-badge-border: ${themeColors.status.danger}${alpha[30]};
        --field-meta-badge-color: ${themeColors.status.danger};
      }
    `,
  }
}

export const useFieldMetaBadgeStyles = createStylesHook(
  createFieldMetaBadgeStyles,
)
