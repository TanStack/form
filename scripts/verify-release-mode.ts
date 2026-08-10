import fs from 'node:fs'
import path from 'node:path'

const releaseBranch = process.env.RELEASE_BRANCH
const prereleaseBranches = new Set(['alpha', 'beta', 'rc'])
const preStatePath = path.resolve('.changeset/pre.json')

if (!releaseBranch) {
  throw new Error('Expected the RELEASE_BRANCH environment variable')
}

if (releaseBranch === 'main') {
  if (fs.existsSync(preStatePath)) {
    throw new Error(
      'Refusing to publish main while .changeset/pre.json exists. Exit prerelease mode before releasing from main.',
    )
  }

  console.log('Verified stable release mode for main')
  process.exit(0)
}

if (!prereleaseBranches.has(releaseBranch)) {
  throw new Error(`Unsupported release branch: ${releaseBranch}`)
}

if (!fs.existsSync(preStatePath)) {
  throw new Error(
    `Refusing to publish ${releaseBranch} without .changeset/pre.json`,
  )
}

const preState = JSON.parse(fs.readFileSync(preStatePath, 'utf8')) as {
  mode?: string
  tag?: string
}

if (preState.mode !== 'pre') {
  throw new Error(
    `Refusing to publish ${releaseBranch} while prerelease mode is ${String(preState.mode)}`,
  )
}

if (preState.tag !== releaseBranch) {
  throw new Error(
    `Refusing to publish ${releaseBranch} with the ${String(preState.tag)} npm dist-tag`,
  )
}

console.log(
  `Verified prerelease mode for ${releaseBranch} with the ${preState.tag} npm dist-tag`,
)
