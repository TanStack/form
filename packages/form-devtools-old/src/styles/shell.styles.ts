import { css } from 'goober'
import { createStylesHook } from './create-styles-hook'
import { tokens } from './tokens'
import type { ThemeName } from './create-styles-hook'

function createShellStyles(theme: ThemeName) {
  const { colors, size, font, border } = tokens
  const themeColors = colors.theme[theme]
  const { size: fontSize } = font

  return {
    rootPanel: css`
      display: flex !important;
      flex-direction: column;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      overflow: hidden !important;
    `,
    tabBar: css`
      display: flex;
      align-items: flex-end;
      gap: ${size.default};
      flex-shrink: 0;
      overflow-x: auto;
      overflow-y: hidden;
      margin-bottom: calc((${size.default} * -2) - 1px);
      padding-bottom: calc(${size.default} * 2);
      padding-inline-end: ${size.default};
      pointer-events: none;
      position: relative;
      scrollbar-width: thin;
      z-index: 2;
    `,
    tabButton: css`
      appearance: none;
      border: 1px solid transparent;
      border-radius: ${size.default} ${size.default} 0 0;
      background: ${themeColors.interactive.resting};
      color: ${themeColors.text.primary};
      cursor: pointer;
      flex-shrink: 0;
      font-family: inherit;
      font-size: ${fontSize.md};
      font-weight: ${font.weight.semibold};
      letter-spacing: 0;
      line-height: ${font.lineHeight.xs};
      margin: 0;
      padding: ${size[2]} ${size[3]};
      pointer-events: auto;
      position: relative;
      transition:
        background 0.15s ease,
        border-color 0.15s ease,
        color 0.15s ease;
      z-index: 1;

      &:hover {
        background: ${themeColors.interactive.subtleHover};
        border-color: ${themeColors.interactive.hoverBorder};
        color: ${themeColors.text.primary};
      }

      &:focus-visible {
        outline: 2px solid ${themeColors.border.focus};
        outline-offset: -2px;
        box-shadow: 0 0 0 3px ${themeColors.interactive.focusRing};
      }

      &::before,
      &::after {
        bottom: -1px;
        content: '';
        height: ${size.default};
        opacity: 0;
        pointer-events: none;
        position: absolute;
        width: ${size.default};
      }

      &::before {
        border-bottom-right-radius: ${size.default};
        box-shadow: ${size.default} ${size.default} 0 ${size.default}
          transparent;
        left: calc(${size.default} * -1);
      }

      &::after {
        border-bottom-left-radius: ${size.default};
        box-shadow: calc(${size.default} * -1) ${size.default} 0 ${size.default}
          transparent;
        right: calc(${size.default} * -1);
      }
    `,
    tabButtonActive: css`
      background: ${themeColors.surface.panel};
      border-color: ${themeColors.border.default};
      border-bottom-color: ${themeColors.surface.panel};
      color: ${themeColors.text.primary};
      z-index: 3;

      &:hover {
        background: ${themeColors.surface.panel};
        border-color: ${themeColors.border.default};
        border-bottom-color: ${themeColors.surface.panel};
        color: ${themeColors.text.primary};
      }

      &::before,
      &::after {
        opacity: 1;
      }

      &::before {
        box-shadow: ${size.default} ${size.default} 0 ${size.default}
          ${themeColors.surface.panel};
      }

      &::after {
        box-shadow: calc(${size.default} * -1) ${size.default} 0 ${size.default}
          ${themeColors.surface.panel};
      }
    `,
    tabButtonActiveFirst: css`
      &::before {
        display: none;
      }
    `,
    mainContainer: css`
      background: ${themeColors.surface.chrome};
      border-radius: ${size.default};
      display: flex;
      flex: 1;
      min-height: 0;
      overflow: hidden;
      position: relative;
    `,
    mainContainerFirstTabActive: css`
      border-top-left-radius: 0;
    `,
    leftPanel: css`
      background: ${themeColors.surface.panel};
      border-radius: ${border.radius.lg};
      border: 1px solid ${themeColors.border.default};
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      overflow-y: auto;
      min-height: 0;
      flex-shrink: 0;
      scrollbar-width: thin;
    `,
    dragHandle: css`
      width: 8px;
      background: ${themeColors.handle.bg};
      cursor: col-resize;
      position: relative;
      transition: all 0.2s ease;
      user-select: none;
      pointer-events: all;
      margin: 0 ${size[1]};
      border-radius: 2px;
      z-index: 4;

      &:hover {
        background: ${themeColors.handle.hover};
        margin: 0 ${size[1]};
      }

      &.dragging {
        background: ${themeColors.handle.active};
        margin: 0 ${size[1]};
      }

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 2px;
        height: 20px;
        background: ${themeColors.handle.mark};
        border-radius: 1px;
        pointer-events: none;
      }

      &:hover::after,
      &.dragging::after {
        background: ${themeColors.handle.mark};
      }
    `,
    rightPanel: css`
      background: ${themeColors.surface.panel};
      border-radius: ${border.radius.lg};
      border: 1px solid ${themeColors.border.default};
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      overflow-y: auto;
      min-height: 0;
      min-width: 0;
      flex: 1;
      scrollbar-width: thin;
    `,
  }
}

export const useShellStyles = createStylesHook(createShellStyles)
