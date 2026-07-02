import { css } from 'goober'
import { createStylesHook } from './create-styles-hook'
import { tokens } from './tokens'
import type { ThemeName } from './create-styles-hook'

function createFieldDetailCardStyles(theme: ThemeName) {
  const { colors, size, font, border, alpha } = tokens
  const themeColors = colors.theme[theme]
  const { size: fontSize } = font

  return {
    panel: css`
      display: flex;
      flex-direction: column;
      min-width: 0;
      overflow: visible;
    `,
    emptyState: css`
      color: ${themeColors.text.secondary};
      font-size: ${fontSize.sm};
      line-height: ${font.lineHeight.md};
      padding: ${size[3]};
    `,
    grid: css`
      align-content: start;
      display: flex;
      flex-wrap: wrap;
      gap: ${size[3]};
      min-width: 0;
      overflow: visible;
      padding: ${size[3]};
    `,
    card: css`
      --field-status-color: ${themeColors.status.success};
      --field-status-bg: ${themeColors.status.success}${alpha[10]};

      background: ${themeColors.surface.card};
      border: 1px solid ${themeColors.border.default};
      border-radius: ${border.radius.md};
      display: flex;
      flex: 1 1 ${size[72]};
      flex-direction: column;
      gap: ${size[3]};
      max-width: 100%;
      min-width: min(100%, ${size[72]});
      min-height: 0;
      padding: ${size[3]};

      &[data-status='invalid'] {
        --field-status-color: ${themeColors.status.danger};
        --field-status-bg: ${themeColors.status.danger}${alpha[10]};
      }

      &[data-status='validating'] {
        --field-status-color: ${themeColors.status.warning};
        --field-status-bg: ${themeColors.status.warning}${alpha[10]};
      }
    `,
    cardPrimary: css`
      flex-basis: calc(50% - ${size[1.5]});
      min-width: min(100%, ${size[96]});
    `,
    cardSelected: css`
      border-color: ${themeColors.interactive.activeBorder};
      box-shadow: 0 0 0 2px ${themeColors.interactive.focusRing};
    `,
    cardHeaderSection: css`
      display: flex;
      flex-direction: column;
      gap: ${size[2]};
      min-width: 0;
    `,
    cardHeaderRow: css`
      align-items: flex-start;
      display: flex;
      flex-wrap: wrap;
      gap: ${size[1.5]} ${size[3]};
      justify-content: space-between;
      min-width: 0;
    `,
    cardHeaderTopRow: css`
      flex-wrap: nowrap;
    `,
    path: css`
      align-items: baseline;
      color: ${themeColors.text.primary};
      display: flex;
      flex: 1 1 ${size[48]};
      font-family: ${font.fontFamily.mono};
      font-size: ${fontSize.sm};
      font-weight: ${font.weight.semibold};
      line-height: ${font.lineHeight.sm};
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
    `,
    pathOwner: css`
      color: ${themeColors.text.muted};
      flex: 0 1 auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    pathLeaf: css`
      color: ${themeColors.text.primary};
      flex: 0 0 auto;
      max-width: 100%;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    formGroupName: css`
      background: ${themeColors.surface.subtle};
      border: 1px solid ${themeColors.border.default};
      border-radius: ${border.radius.sm};
      color: ${themeColors.text.secondary};
      display: inline-flex;
      flex: 0 1 auto;
      font-size: ${fontSize['2xs']};
      font-weight: ${font.weight.semibold};
      line-height: ${font.lineHeight['2xs']};
      margin-left: auto;
      max-width: 100%;
      min-width: 0;
      overflow: hidden;
      padding: ${size[0.5]} ${size[1]};
      text-align: right;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    cardHeaderActions: css`
      align-items: center;
      display: inline-flex;
      flex: 0 0 auto;
      flex-wrap: nowrap;
      gap: ${size[1]};
      justify-content: flex-end;
      min-width: 0;
    `,
    valuesButton: css`
      align-items: center;
      display: inline-flex;
      flex-shrink: 0;
      gap: ${size[1]};
      min-height: ${size[5]};
    `,
    valuesButtonIcon: css`
      display: inline-flex;
      font-size: ${fontSize.sm};
      line-height: 1;
    `,
    copyButton: css`
      align-items: center;
      appearance: none;
      background: ${themeColors.interactive.resting};
      border-radius: ${border.radius.sm};
      color: ${themeColors.text.secondary};
      cursor: pointer;
      display: inline-flex;
      flex-shrink: 0;
      font: inherit;
      font-size: ${fontSize.xs};
      font-weight: ${font.weight.semibold};
      gap: ${size[1]};
      justify-content: center;
      letter-spacing: 0;
      line-height: ${font.lineHeight['2xs']};
      margin: 0;
      min-height: ${size[5]};
      min-width: ${size[5]};
      padding: ${size[1.5]} ${size[3]};
      white-space: nowrap;

      & svg {
        height: ${size[4]};
        width: ${size[4]};
      }

      &:hover {
        background: ${themeColors.interactive.subtleHover};
        border-color: ${themeColors.interactive.hoverBorder};
        color: ${themeColors.text.primary};
      }

      &:focus-visible {
        outline: 2px solid ${themeColors.border.focus};
        outline-offset: 1px;
      }
    `,
    stateTags: css`
      align-items: center;
      display: flex;
      flex: 1 1 ${size[48]};
      flex-wrap: wrap;
      gap: ${size[1]};
      min-width: 0;
    `,
    valuesSection: css`
      border-top: 1px solid ${themeColors.border.default};
      display: flex;
      flex-direction: column;
      gap: ${size[3]};
      min-width: 0;
      padding-top: ${size[3]};
    `,
    valuesGrid: css`
      display: grid;
      gap: ${size[3]};
      grid-template-columns: repeat(
        auto-fit,
        minmax(min(100%, ${size[64]}), 1fr)
      );
      min-width: 0;
    `,
    valuePane: css`
      display: flex;
      flex-direction: column;
      gap: ${size[1]};
      min-width: 0;
    `,
    valuePaneLabel: css`
      color: ${themeColors.text.secondary};
      font-size: ${fontSize.xs};
      font-weight: ${font.weight.semibold};
      line-height: ${font.lineHeight.xs};
    `,
    valueTree: css`
      color: ${themeColors.text.primary};
      font-family: ${font.fontFamily.mono};
      font-size: ${fontSize.xs};
      line-height: ${font.lineHeight.sm};
      min-width: 0;
      overflow: auto;
    `,
    jsonStateSection: css`
      border-top: 1px solid ${themeColors.border.default};
      min-width: 0;
      padding-top: ${size[3]};
    `,
    jsonStateTree: css`
      color: ${themeColors.text.primary};
      font-family: ${font.fontFamily.mono};
      font-size: ${fontSize.xs};
      line-height: ${font.lineHeight.sm};
      min-width: 0;
      overflow: auto;
    `,
    dependenciesSection: css`
      border-top: 1px solid ${themeColors.border.default};
      display: flex;
      flex-direction: column;
      gap: ${size[2]};
      min-width: 0;
      padding-top: ${size[3]};
    `,
    dependenciesGrid: css`
      display: grid;
      gap: ${size[3]};
      grid-template-columns: repeat(
        auto-fit,
        minmax(min(100%, ${size[56]}), 1fr)
      );
      min-width: 0;
    `,
    dependencyGroup: css`
      display: flex;
      flex-direction: column;
      gap: ${size[1]};
      min-width: 0;
    `,
    dependencyGroupTitle: css`
      color: ${themeColors.text.secondary};
      font-size: ${fontSize.xs};
      font-weight: ${font.weight.semibold};
      line-height: ${font.lineHeight.xs};
    `,
    dependencyList: css`
      display: flex;
      flex-direction: column;
      gap: ${size[1]};
      list-style: none;
      margin: 0;
      min-width: 0;
      padding: 0;
    `,
    dependencyItem: css`
      align-items: flex-start;
      background: ${themeColors.surface.subtle};
      border: 1px solid ${themeColors.border.default};
      border-radius: ${border.radius.sm};
      display: flex;
      flex-direction: column;
      gap: ${size[0.5]};
      min-width: 0;
      padding: ${size[1]} ${size[1.5]};
    `,
    dependencyPathButton: css`
      appearance: none;
      background: transparent;
      border: 0;
      color: ${themeColors.interactive.activeText};
      cursor: pointer;
      display: inline;
      font: inherit;
      font-family: ${font.fontFamily.mono};
      font-size: ${fontSize.xs};
      font-weight: ${font.weight.semibold};
      line-height: ${font.lineHeight.sm};
      margin: 0;
      max-width: 100%;
      min-width: 0;
      overflow-wrap: anywhere;
      padding: 0;
      text-align: left;

      &:hover {
        text-decoration: underline;
      }

      &:focus-visible {
        border-radius: ${border.radius.xs};
        outline: 2px solid ${themeColors.border.focus};
        outline-offset: 2px;
      }
    `,
    dependencyPathText: css`
      color: ${themeColors.text.muted};
      font-family: ${font.fontFamily.mono};
      font-size: ${fontSize.xs};
      font-weight: ${font.weight.semibold};
      line-height: ${font.lineHeight.sm};
      min-width: 0;
      overflow-wrap: anywhere;
    `,
    dependencyMeta: css`
      align-items: center;
      color: ${themeColors.text.secondary};
      display: flex;
      flex-wrap: wrap;
      font-size: ${fontSize['2xs']};
      gap: ${size[1]};
      line-height: ${font.lineHeight['2xs']};
      min-width: 0;
    `,
    dependencyBadge: css`
      background: ${themeColors.surface.card};
      border: 1px solid ${themeColors.border.default};
      border-radius: ${border.radius.sm};
      color: ${themeColors.text.secondary};
      display: inline-flex;
      font-size: ${fontSize['2xs']};
      font-weight: ${font.weight.semibold};
      line-height: ${font.lineHeight['2xs']};
      padding: ${size[0.5]} ${size[1]};
      white-space: nowrap;
    `,
    dependencyConfiguredPath: css`
      font-family: ${font.fontFamily.mono};
      min-width: 0;
      overflow-wrap: anywhere;
    `,
    errorSection: css`
      display: flex;
      flex-direction: column;
      gap: ${size[2]};
      min-width: 0;
    `,
    errorSectionHeader: css`
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: ${size[1.5]} ${size[3]};
      justify-content: space-between;
      min-width: 0;
    `,
    errorSectionTitle: css`
      align-items: center;
      display: inline-flex;
      flex: 1 1 ${size[32]};
      flex-wrap: wrap;
      gap: ${size[1.5]};
      min-width: 0;
    `,
    errorVisibilityHint: css`
      background: ${themeColors.status.danger}${alpha[10]};
      border: 1px solid ${themeColors.status.danger}${alpha[30]};
      border-radius: ${border.radius.sm};
      color: ${themeColors.status.danger};
      display: inline-flex;
      font-size: ${fontSize['2xs']};
      font-weight: ${font.weight.semibold};
      line-height: ${font.lineHeight['2xs']};
      padding: ${size[0.5]} ${size[1]};
      white-space: nowrap;
    `,
    errorDisplayToggle: css`
      align-items: center;
      background: ${themeColors.surface.subtle};
      border: 1px solid ${themeColors.border.default};
      border-radius: ${border.radius.sm};
      display: inline-flex;
      flex: 0 0 auto;
      overflow: hidden;
    `,
    errorDisplayToggleButton: css`
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
    errorDisplayToggleButtonActive: css`
      background: ${themeColors.interactive.active};
      color: ${themeColors.interactive.activeText};
    `,
    errorMessageList: css`
      display: flex;
      flex-direction: column;
      gap: ${size[1]};
      list-style: none;
      margin: 0;
      min-width: 0;
      padding: 0;
    `,
    errorMessageItem: css`
      background: ${themeColors.status.danger}${alpha[10]};
      border-radius: ${border.radius.sm};
      color: ${themeColors.text.primary};
      font-size: ${fontSize.xs};
      line-height: ${font.lineHeight.sm};
      min-width: 0;
      padding: ${size[1]} ${size[1.5]};
      word-break: break-word;
    `,
  }
}

export const useFieldDetailCardStyles = createStylesHook(
  createFieldDetailCardStyles,
)
