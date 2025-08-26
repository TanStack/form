import { JsonTree } from '@tanstack/devtools-ui'
import { useStyles } from '../styles/use-styles'

type DetailsPanelProps = {
  selectedInstance: () => { instance: any; type: string } | null
  utilState: () => { lastUpdatedByKey: Record<string, number> }
}

export function DetailsPanel(props: DetailsPanelProps) {
  const styles = useStyles()

  return (
    <div class={styles().stateDetails}>
      {(() => {
        const entry = props.selectedInstance()
        if (!entry) {
          return (
            <div class={styles().noSelection}>
              Select a util from the left panel to view its state
            </div>
          )
        }

        return (
          <>
            {/* <StateHeader
              selectedInstance={props.selectedInstance}
              utilState={props.utilState}
            /> */}

            <div class={styles().detailsGrid}>
              <div class={styles().detailSection}>
                <div class={styles().detailSectionHeader}>Actions</div>
                {/* <ActionButtons
                  instance={entry.instance}
                  utilName={entry.type}
                /> */}
              </div>

              <div class={styles().detailSection}>
                <div class={styles().detailSectionHeader}>State</div>
                <div class={styles().stateContent}>
                  <JsonTree value={entry.instance.store?.state} />
                </div>
              </div>

              <div class={styles().detailSection}>
                <div class={styles().detailSectionHeader}>Options</div>
                <div class={styles().stateContent}>
                  <JsonTree value={entry.instance.options} />
                </div>
              </div>
            </div>
          </>
        )
      })()}
    </div>
  )
}
