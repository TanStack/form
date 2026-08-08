import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, relative, resolve, sep } from 'node:path'
import { glob } from 'tinyglobby'
// @ts-ignore Could not find a declaration file for module 'markdown-link-extractor'.
import markdownLinkExtractor from 'markdown-link-extractor'

const errors: Array<{
  file: string
  link: string
  resolvedPath: string
  reason: string
  nav?: string
}> = []

function isRelativeLink(link: string) {
  return (
    !link.startsWith('/') &&
    !link.startsWith('http://') &&
    !link.startsWith('https://') &&
    !link.startsWith('//') &&
    !link.startsWith('#') &&
    !link.startsWith('mailto:')
  )
}

/** Remove any trailing .md */
function stripExtension(p: string): string {
  return p.replace(`${extname(p)}`, '')
}

/**
 * Map a resolved `/docs` path to the file or directory that actually serves it,
 * and report whether that target exists.
 */
function resolveDocTarget(absPath: string): { path: string; exists: boolean } {
  // Examples live outside /docs: /docs/framework/{framework}/examples/{name}
  // is served from /examples/{framework}/{name}
  const [root, framework, section, ...rest] = relative(
    resolve('docs'),
    absPath,
  ).split(sep)

  if (root === 'framework' && framework && section === 'examples') {
    const examplePath = resolve('examples', framework, ...rest)
    return {
      path: examplePath,
      exists: existsSync(examplePath) && statSync(examplePath).isDirectory(),
    }
  }

  // Everything else is a markdown page
  const mdPath = absPath.endsWith('.md') ? absPath : `${absPath}.md`
  return { path: mdPath, exists: existsSync(mdPath) }
}

function relativeLinkExists(link: string, file: string): boolean {
  // Remove hash if present
  const linkWithoutHash = link.split('#')[0]
  // If the link is empty after removing hash, it's not a file
  if (!linkWithoutHash) return false

  // Strip the file/link extensions
  const filePath = stripExtension(file)
  const linkPath = stripExtension(linkWithoutHash)

  // Resolve the path relative to the markdown file's directory
  // Nav up a level to simulate how links are resolved on the web
  const absPath = resolve(filePath, '..', linkPath)

  // Ensure the resolved path is within /docs
  const docsRoot = resolve('docs')
  if (!absPath.startsWith(docsRoot)) {
    errors.push({
      link,
      file,
      resolvedPath: absPath,
      reason: 'Path outside /docs',
    })
    return false
  }

  const { path: resolvedPath, exists } = resolveDocTarget(absPath)

  if (!exists) {
    errors.push({
      link,
      file,
      resolvedPath,
      reason: 'Not found',
    })
  }
  return exists
}

async function verifyMarkdownLinks() {
  // Find all markdown files in docs directory
  const markdownFiles = await glob('docs/**/*.md', {
    ignore: ['**/node_modules/**'],
  })

  console.log(`Found ${markdownFiles.length} markdown files\n`)

  // Process each file
  for (const file of markdownFiles) {
    const content = readFileSync(file, 'utf-8')
    const links: Array<string> = markdownLinkExtractor(content)

    const relativeLinks = links.filter((link: string) => {
      return isRelativeLink(link)
    })

    if (relativeLinks.length > 0) {
      relativeLinks.forEach((link) => {
        relativeLinkExists(link, file)
      })
    }
  }
}

interface ConfigNode {
  label?: string
  to?: string
  children?: Array<ConfigNode>
  frameworks?: Array<ConfigNode>
}

/**
 * Every `to` in docs/config.json becomes a sidebar link on tanstack.com, so an
 * entry pointing at a page that no longer exists renders as a 404. These are
 * invisible to the markdown scan above, which only reads links written inside
 * .md files.
 */
function verifyConfigLinks() {
  const configPath = 'docs/config.json'
  const config = JSON.parse(readFileSync(configPath, 'utf-8')) as {
    sections?: Array<ConfigNode>
  }

  const docsRoot = resolve('docs')
  let checked = 0

  function walk(node: ConfigNode, breadcrumb: Array<string>) {
    const trail = node.label ? [...breadcrumb, node.label] : breadcrumb

    if (node.to) {
      checked++
      const { path: resolvedPath, exists } = resolveDocTarget(
        resolve(docsRoot, node.to),
      )

      if (!exists) {
        errors.push({
          file: configPath,
          link: node.to,
          resolvedPath,
          reason: 'Not found',
          nav: trail.join(' > '),
        })
      }
    }

    node.children?.forEach((child) => walk(child, trail))
    node.frameworks?.forEach((framework) => walk(framework, trail))
  }

  const sections = config.sections ?? []
  sections.forEach((section) => walk(section, []))

  console.log(`Found ${checked} nav entries in ${configPath}\n`)
}

async function verifyLinks() {
  await verifyMarkdownLinks()
  verifyConfigLinks()

  if (errors.length > 0) {
    console.log(`\n❌ Found ${errors.length} broken links:`)
    errors.forEach((err) => {
      console.log(
        `${err.file}${err.nav ? `\n  nav:       ${err.nav}` : ''}\n  link:      ${err.link}\n  resolved:  ${err.resolvedPath}\n  why:       ${err.reason}\n`,
      )
    })
    process.exit(1)
  } else {
    console.log('\n✅ No broken links found!')
  }
}

verifyLinks().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
