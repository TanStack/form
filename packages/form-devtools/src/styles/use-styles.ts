import * as goober from 'goober'
import { createSignal } from 'solid-js'
import { tokens } from './tokens'

const stylesFactory = () => {
  const { colors, font, size, alpha, border } = tokens
  const { fontFamily, size: fontSize } = font
  const css = goober.css

  return {
    devtoolsPanel: css`
      background: ${colors.darkGray[900]};
      color: ${colors.gray[100]};
      font-family: ${fontFamily.sans};
      font-size: ${fontSize.sm};
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: hidden;
    `,
    stickyHeader: css`
      position: sticky;
      top: 0;
      z-index: 10;
      background: ${colors.darkGray[900]};
      padding: ${size[2]};
      font-size: ${fontSize.lg};
      font-weight: ${font.weight.bold};
      color: #eeaf00;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      border-bottom: 1px solid ${colors.darkGray[700]};
      box-shadow: 0 2px 8px 0 ${colors.black + alpha[40]};
      flex-shrink: 0;
    `,
    mainContainer: css`
      display: flex;
      flex: 1;
      min-height: 0;
      overflow: hidden;
      padding: ${size[2]};
      padding-top: 0;
    `,
    dragHandle: css`
      width: 8px;
      background: ${colors.darkGray[600]};
      cursor: col-resize;
      position: relative;
      transition: all 0.2s ease;
      user-select: none;
      pointer-events: all;
      margin: 0 ${size[1]};
      border-radius: 2px;

      &:hover {
        background: ${colors.blue[500]};
        margin: 0 ${size[1]};
      }

      &.dragging {
        background: ${colors.blue[600]};
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
        background: ${colors.darkGray[400]};
        border-radius: 1px;
        pointer-events: none;
      }

      &:hover::after,
      &.dragging::after {
        background: ${colors.blue[300]};
      }
    `,
    leftPanel: css`
      background: ${colors.darkGray[800]};
      border-radius: ${border.radius.lg};
      border: 1px solid ${colors.darkGray[700]};
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0;
      flex-shrink: 0;
    `,
    rightPanel: css`
      background: ${colors.darkGray[800]};
      border-radius: ${border.radius.lg};
      border: 1px solid ${colors.darkGray[700]};
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0;
      flex: 1;
    `,
    panelHeader: css`
      font-size: ${fontSize.md};
      font-weight: ${font.weight.bold};
      color: ${colors.blue[400]};
      padding: ${size[2]};
      border-bottom: 1px solid ${colors.darkGray[700]};
      background: ${colors.darkGray[800]};
      flex-shrink: 0;
    `,
    utilList: css`
      flex: 1;
      overflow-y: auto;
      padding: ${size[1]};
      min-height: 0;
    `,
    utilGroup: css`
      margin-bottom: ${size[2]};
    `,
    utilGroupHeader: css`
      font-size: ${fontSize.xs};
      font-weight: ${font.weight.semibold};
      color: ${colors.gray[400]};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: ${size[1]};
      padding: ${size[1]} ${size[2]};
      background: ${colors.darkGray[700]};
      border-radius: ${border.radius.md};
    `,
    utilRow: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${size[2]};
      margin-bottom: ${size[1]};
      background: ${colors.darkGray[700]};
      border-radius: ${border.radius.md};
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;

      &:hover {
        background: ${colors.darkGray[600]};
        border-color: ${colors.darkGray[500]};
      }
    `,
    utilRowSelected: css`
      background: ${colors.blue[900] + alpha[20]};
      border-color: ${colors.blue[500]};
      box-shadow: 0 0 0 1px ${colors.blue[500] + alpha[30]};
    `,
    utilKey: css`
      font-family: ${fontFamily.mono};
      font-size: ${fontSize.xs};
      color: ${colors.gray[100]};
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    utilStatus: css`
      font-size: ${fontSize.xs};
      color: ${colors.gray[400]};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: ${size[1]} ${size[1]};
      background: ${colors.darkGray[600]};
      border-radius: ${border.radius.sm};
      margin-left: ${size[1]};
    `,
    stateDetails: css`
      flex: 1;
      overflow-y: auto;
      padding: ${size[2]};
      min-height: 0;
    `,
    stateHeader: css`
      margin-bottom: ${size[2]};
      padding-bottom: ${size[2]};
      border-bottom: 1px solid ${colors.darkGray[700]};
    `,
    stateTitle: css`
      font-size: ${fontSize.md};
      font-weight: ${font.weight.bold};
      color: ${colors.blue[400]};
      margin-bottom: ${size[1]};
    `,
    stateKey: css`
      font-family: ${fontFamily.mono};
      font-size: ${fontSize.xs};
      color: ${colors.gray[400]};
      word-break: break-all;
    `,
    stateContent: css`
      background: ${colors.darkGray[700]};
      border-radius: ${border.radius.md};
      padding: ${size[2]};
      border: 1px solid ${colors.darkGray[600]};
    `,
    detailsGrid: css`
      display: grid;
      grid-template-columns: 1fr;
      gap: ${size[2]};
      align-items: start;
    `,
    detailSection: css`
      background: ${colors.darkGray[700]};
      border: 1px solid ${colors.darkGray[600]};
      border-radius: ${border.radius.md};
      padding: ${size[2]};
    `,
    detailSectionHeader: css`
      font-size: ${fontSize.sm};
      font-weight: ${font.weight.bold};
      color: ${colors.gray[200]};
      margin-bottom: ${size[1]};
      text-transform: uppercase;
      letter-spacing: 0.04em;
    `,
    actionsRow: css`
      display: flex;
      flex-wrap: wrap;
      gap: ${size[2]};
    `,
    actionButton: css`
      display: inline-flex;
      align-items: center;
      gap: ${size[1]};
      padding: ${size[1]} ${size[2]};
      border-radius: ${border.radius.md};
      border: 1px solid ${colors.darkGray[500]};
      background: ${colors.darkGray[600]};
      color: ${colors.gray[100]};
      font-size: ${fontSize.xs};
      cursor: pointer;
      user-select: none;
      transition:
        background 0.15s,
        border-color 0.15s;
      &:hover {
        background: ${colors.darkGray[500]};
        border-color: ${colors.darkGray[400]};
      }
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        &:hover {
          background: ${colors.darkGray[600]};
          border-color: ${colors.darkGray[500]};
        }
      }
    `,
    actionDotBlue: css`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${colors.blue[400]};
    `,
    actionDotGreen: css`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${colors.green[400]};
    `,
    actionDotRed: css`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${colors.red[400]};
    `,
    actionDotYellow: css`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${colors.yellow[400]};
    `,
    actionDotOrange: css`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${colors.pink[400]};
    `,
    actionDotPurple: css`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${colors.purple[400]};
    `,
    infoGrid: css`
      display: grid;
      grid-template-columns: auto 1fr;
      gap: ${size[1]};
      row-gap: ${size[1]};
      align-items: center;
    `,
    infoLabel: css`
      color: ${colors.gray[400]};
      font-size: ${fontSize.xs};
      text-transform: uppercase;
      letter-spacing: 0.05em;
    `,
    infoValueMono: css`
      font-family: ${fontFamily.mono};
      font-size: ${fontSize.xs};
      color: ${colors.gray[100]};
      word-break: break-all;
    `,
    noSelection: css`
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${colors.gray[500]};
      font-style: italic;
      text-align: center;
      padding: ${size[4]};
    `,
    // Keep existing styles for backward compatibility
    sectionContainer: css`
      display: flex;
      flex-wrap: wrap;
      gap: ${size[4]};
    `,
    section: css`
      background: ${colors.darkGray[800]};
      border-radius: ${border.radius.lg};
      box-shadow: ${tokens.shadow.md(colors.black + alpha[80])};
      padding: ${size[4]};
      margin-bottom: ${size[4]};
      border: 1px solid ${colors.darkGray[700]};
      min-width: 0;
      max-width: 33%;
      max-height: fit-content;
    `,
    sectionHeader: css`
      font-size: ${fontSize.lg};
      font-weight: ${font.weight.bold};
      margin-bottom: ${size[2]};
      color: ${colors.blue[400]};
      letter-spacing: 0.01em;
      display: flex;
      align-items: center;
      gap: ${size[2]};
    `,
    sectionEmpty: css`
      color: ${colors.gray[500]};
      font-size: ${fontSize.sm};
      font-style: italic;
      margin: ${size[2]} 0;
    `,
    instanceList: css`
      display: flex;
      flex-direction: column;
      gap: ${size[2]};
    `,
    instanceCard: css`
      background: ${colors.darkGray[700]};
      border-radius: ${border.radius.md};
      padding: ${size[3]};
      border: 1px solid ${colors.darkGray[600]};
      font-size: ${fontSize.sm};
      color: ${colors.gray[100]};
      font-family: ${fontFamily.mono};
      overflow-x: auto;
      transition:
        box-shadow 0.3s,
        background 0.3s;
    `,
  }
}

export function useStyles() {
  const [_styles] = createSignal(stylesFactory())
  return _styles
}
