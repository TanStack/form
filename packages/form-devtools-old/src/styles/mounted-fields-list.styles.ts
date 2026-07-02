import { css } from 'goober'
import { createStylesHook } from './create-styles-hook'
import { tokens } from './tokens'
import type { ThemeName } from './create-styles-hook'

function createMountedFieldsStyles(theme: ThemeName) {
  const { colors, size, font, border, alpha } = tokens
  const themeColors = colors.theme[theme]
  const { size: fontSize } = font

  return {
    fieldListPanel: css`
      display: flex;
      flex-direction: column;
      min-width: 0;
      overflow: visible;
    `,
    fieldListControls: css`
      border-bottom: 1px solid ${themeColors.border.default};
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      gap: ${size[2]};
      padding: ${size[2]};
    `,
    fieldSearchLabel: css`
      display: flex;
      flex-direction: column;
      gap: ${size[1]};
      min-width: 0;
    `,
    fieldSearchText: css`
      color: ${themeColors.text.secondary};
      font-size: ${fontSize.xs};
      font-weight: ${font.weight.semibold};
      line-height: ${font.lineHeight.xs};
    `,
    fieldSearchInput: css`
      appearance: none;
      background: ${themeColors.surface.card};
      border: 1px solid ${themeColors.border.default};
      border-radius: ${border.radius.md};
      color: ${themeColors.text.primary};
      font: inherit;
      font-size: ${fontSize.sm};
      line-height: ${font.lineHeight.sm};
      min-width: 0;
      outline: none;
      padding: ${size[1.5]} ${size[2]};
      width: 100%;

      &::placeholder {
        color: ${themeColors.text.muted};
      }

      &:focus {
        border-color: ${themeColors.border.focus};
        box-shadow: 0 0 0 3px ${themeColors.interactive.focusRing};
      }
    `,
    fieldFilterGroup: css`
      display: flex;
      flex-wrap: wrap;
      gap: ${size[1]};
    `,
    fieldFilterTagWrapper: css`
      border-radius: ${border.radius.sm};
      outline: 2px solid transparent;
      outline-offset: 1px;
      transition: outline-color 0.1s ease;
    `,
    fieldFilterTagWrapperActive: css`
      outline-color: ${themeColors.border.focus};
    `,
    fieldList: css`
      display: flex;
      flex-direction: column;
      gap: ${size[1]};
      min-width: 0;
      overflow: visible;
      padding: ${size[1.5]};
    `,
    fieldListEmpty: css`
      color: ${themeColors.text.secondary};
      font-size: ${fontSize.sm};
      line-height: ${font.lineHeight.md};
      padding: ${size[3]} ${size[2]};
      text-align: center;
    `,
    fieldRow: css`
      --field-status-color: ${themeColors.status.success};
      --field-status-bg: ${themeColors.status.success}${alpha[10]};

      align-items: stretch;
      background: ${themeColors.surface.card};
      border: 1px solid ${themeColors.border.default};
      border-radius: ${border.radius.md};
      display: flex;
      min-height: ${size[10]};
      min-width: 0;
      overflow: hidden;
      transition:
        background 0.15s ease,
        border-color 0.15s ease,
        box-shadow 0.15s ease;

      &[data-status='invalid'] {
        --field-status-color: ${themeColors.status.danger};
        --field-status-bg: ${themeColors.status.danger}${alpha[10]};
      }

      &:hover {
        background: ${themeColors.interactive.subtleHover};
        border-color: ${themeColors.interactive.hoverBorder};
      }
    `,
    fieldRowSelected: css`
      background: ${themeColors.interactive.active};
      border-color: ${themeColors.interactive.activeBorder};

      &:hover {
        background: ${themeColors.interactive.active};
        border-color: ${themeColors.interactive.activeBorder};
      }
    `,
    fieldRowButton: css`
      align-items: stretch;
      appearance: none;
      background: transparent;
      border: 0;
      color: inherit;
      cursor: pointer;
      display: flex;
      flex: 1;
      font: inherit;
      margin: 0;
      min-width: 0;
      padding: 0;
      text-align: left;

      &:focus-visible {
        outline: 2px solid ${themeColors.border.focus};
        outline-offset: -2px;
      }
    `,
    fieldRowBody: css`
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: ${size[1]};
      justify-content: center;
      min-width: 0;
      padding: ${size[1.5]} ${size[2]};
    `,
    fieldPath: css`
      align-items: baseline;
      color: ${themeColors.text.primary};
      display: flex;
      font-family: ${font.fontFamily.mono};
      font-size: ${fontSize.xs};
      line-height: ${font.lineHeight.xs};
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
    `,
    fieldOwnerPath: css`
      color: ${themeColors.text.muted};
      flex: 0 1 auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    fieldLeafName: css`
      color: ${themeColors.text.primary};
      flex: 0 0 auto;
      max-width: 100%;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    fieldBadges: css`
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: ${size[1]};
      min-width: 0;
    `,
    fieldBadge: css`
      background: ${themeColors.surface.subtle};
      border: 1px solid ${themeColors.border.default};
      border-radius: ${border.radius.sm};
      color: ${themeColors.text.secondary};
      display: inline-flex;
      font-size: ${fontSize['2xs']};
      font-weight: ${font.weight.semibold};
      line-height: ${font.lineHeight['2xs']};
      max-width: 100%;
      overflow: hidden;
      padding: ${size[0.5]} ${size[1]};
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    fieldPinButton: css`
      align-items: center;
      appearance: none;
      align-self: stretch;
      background: transparent;
      border: 0;
      border-left: 1px solid ${themeColors.border.default};
      color: ${themeColors.text.muted};
      cursor: pointer;
      display: inline-flex;
      flex: 0 0 ${size[9]};
      font-size: ${fontSize.md};
      justify-content: center;
      margin: 0;
      padding: 0;
      transition:
        background 0.15s ease,
        color 0.15s ease;

      & > svg {
        display: block;
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
    fieldPinButtonPinned: css`
      color: ${themeColors.interactive.activeText};

      &:hover {
        color: ${themeColors.interactive.activeText};
      }
    `,
  }
}

export const useMountedFieldsListStyles = createStylesHook(
  createMountedFieldsStyles,
)
