import { MarkdownPageEvent } from 'typedoc-plugin-markdown'
import path from 'node:path'

/**
 * @param {import("typedoc-plugin-markdown").MarkdownApplication} app
 */
export function load(app) {
  app.renderer.on(
    MarkdownPageEvent.BEGIN,
    /**
     * @param {import("typedoc-plugin-markdown").MarkdownPageEvent} page
     */
    (page) => {
      const dirname = path.dirname(page.filename)
      const basename = path.basename(page.filename)
      const name = basename.split('.')
      if (name[0] !== 'index') {
        name.splice(0, 1)
      }
      const newBasename = name.join('.').toLowerCase();
      page.filename = path.join(dirname, newBasename)
    },
  )
}
