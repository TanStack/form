import {
  branchConfigs,
  examplesDirs,
  latestBranch,
  packages,
  rootDir,
} from './config'
import { BranchConfig, Commit } from './types'

// Originally ported to TS from https://github.com/remix-run/router/tree/main/scripts/{version,publish}.js
import path from 'path'
import { exec, execSync } from 'child_process'
import fsp from 'fs/promises'
import chalk from 'chalk'
import jsonfile from 'jsonfile'
import semver from 'semver'
import currentGitBranch from 'current-git-branch'
import parseCommit from '@commitlint/parse'
import log from 'git-log-parser'
import streamToArray from 'stream-to-array'
import axios from 'axios'
import { DateTime } from 'luxon'

import { PackageJson } from 'type-fest'

const releaseCommitMsg = (version: string) => `release: v${version}`

async function run() {
  const branchName: string =
    process.env.BRANCH ??
    // (process.env.PR_NUMBER ? `pr-${process.env.PR_NUMBER}` : currentGitBranch())
    (currentGitBranch() as string)

  const branchConfig: BranchConfig = branchConfigs[branchName]

  if (!branchConfig) {
    console.log(`No publish config found for branch: ${branchName}`)
    console.log('Exiting...')
    process.exit(0)
  }

  const isLatestBranch = branchName === latestBranch
  const npmTag = isLatestBranch ? 'latest' : branchName

  let remoteURL = execSync('git config --get remote.origin.url').toString()

  remoteURL = remoteURL.substring(0, remoteURL.indexOf('.git'))

  // Get tags
  let tags: string[] = execSync('git tag').toString().split('\n')

  // Filter tags to our branch/pre-release combo
  tags = tags
    .filter((tag) => semver.valid(tag))
    .filter((tag) => {
      if (isLatestBranch) {
        return semver.prerelease(tag) == null
      }

      return tag.includes(`-${branchName}`)
    })
    // sort by latest
    .sort(semver.compare)

  // Get the latest tag
  let latestTag = [...tags].pop()

  let range = `${latestTag}..HEAD`
  // let range = ``;

  let SKIP_TESTS = false

  if (!latestTag || process.env.TAG) {
    if (process.env.TAG) {
      if (!process.env.TAG.startsWith('v')) {
        throw new Error(
          `process.env.TAG must start with "v", eg. v0.0.0. You supplied ${process.env.TAG}`,
        )
      }
      console.info(
        chalk.yellow(
          `Tag is set to ${process.env.TAG}. This will force release all packages. Publishing...`,
        ),
      )

      // Is it a major version?
      if (!semver.patch(process.env.TAG) && !semver.minor(process.env.TAG)) {
        range = `beta..HEAD`
        latestTag = process.env.TAG
      }
    } else {
      throw new Error(
        'Could not find latest tag! To make a release tag of v0.0.1, run with TAG=v0.0.1',
      )
    }
  }

  console.info(`Git Range: ${range}`)

  // Get the commits since the latest tag
  const commitsSinceLatestTag = (
    await new Promise<Commit[]>((resolve, reject) => {
      const strm = log.parse({
        _: range,
      })

      streamToArray(strm, function (err: any, arr: any[]) {
        if (err) return reject(err)

        Promise.all(
          arr.map(async (d) => {
            const parsed = await parseCommit(d.subject)

            return { ...d, parsed }
          }),
        ).then((res) => resolve(res.filter(Boolean)))
      })
    })
  ).filter((commit: Commit) => {
    const exclude = [
      commit.subject.startsWith('Merge branch '), // No merge commits
      commit.subject.startsWith(releaseCommitMsg('')), // No example update commits
    ].some(Boolean)

    return !exclude
  })

  console.info(
    `Parsing ${commitsSinceLatestTag.length} commits since ${latestTag}...`,
  )

  // Pares the commit messsages, log them, and determine the type of release needed
  let recommendedReleaseLevel: number = commitsSinceLatestTag.reduce(
    (releaseLevel, commit) => {
      if (['fix', 'refactor', 'perf'].includes(commit.parsed.type!)) {
        releaseLevel = Math.max(releaseLevel, 0)
      }
      if (['feat'].includes(commit.parsed.type!)) {
        releaseLevel = Math.max(releaseLevel, 1)
      }
      if (commit.body.includes('BREAKING CHANGE')) {
        releaseLevel = Math.max(releaseLevel, 2)
      }
      if (
        commit.subject.includes('SKIP_TESTS') ||
        commit.body.includes('SKIP_TESTS')
      ) {
        SKIP_TESTS = true
      }

      return releaseLevel
    },
    -1,
  )

  if (!process.env.TAG) {
    if (recommendedReleaseLevel === 2) {
      console.info(
        `Major versions releases must be tagged and released manually.`,
      )
      return
    }

    if (recommendedReleaseLevel === -1) {
      console.info(
        `There have been no changes since the release of ${latestTag} that require a new version. You're good!`,
      )
      return
    }
  }

  function getSorterFn<TItem>(sorters: ((d: TItem) => any)[]) {
    return (a: TItem, b: TItem) => {
      let i = 0

      sorters.some((sorter) => {
        const sortedA = sorter(a)
        const sortedB = sorter(b)
        if (sortedA > sortedB) {
          i = 1
          return true
        }
        if (sortedA < sortedB) {
          i = -1
          return true
        }
        return false
      })

      return i
    }
  }

  const changelogCommitsMd = process.env.TAG
    ? `Manual Release: ${process.env.TAG}`
    : await Promise.all(
        Object.entries(
          commitsSinceLatestTag.reduce(
            (acc, next) => {
              const type = next.parsed.type?.toLowerCase() ?? 'other'

              return {
                ...acc,
                [type]: [...(acc[type] || []), next],
              }
            },
            {} as Record<string, Commit[]>,
          ),
        )
          .sort(
            getSorterFn([
              ([d]) =>
                [
                  'other',
                  'examples',
                  'docs',
                  'chore',
                  'refactor',
                  'perf',
                  'fix',
                  'feat',
                ].indexOf(d),
            ]),
          )
          .reverse()
          .map(async ([type, commits]) => {
            return Promise.all(
              commits.map(async (commit) => {
                let username = ''

                if (process.env.GH_TOKEN) {
                  const query = `${
                    commit.author.email ?? commit.committer.email
                  }`

                  const res = await axios.get(
                    'https://api.github.com/search/users',
                    {
                      params: {
                        q: query,
                      },
                      headers: {
                        Authorization: `token ${process.env.GH_TOKEN}`,
                      },
                    },
                  )

                  username = res.data.items[0]?.login
                }

                const scope = commit.parsed.scope
                  ? `${commit.parsed.scope}: `
                  : ''
                const subject = commit.parsed.subject ?? commit.subject
                // const commitUrl = `${remoteURL}/commit/${commit.commit.long}`;

                return `- ${scope}${subject} (${commit.commit.short}) ${
                  username
                    ? `by @${username}`
                    : `by ${commit.author.name ?? commit.author.email}`
                }`
              }),
            ).then((commits) => [type, commits] as const)
          }),
      ).then((groups) => {
        return groups
          .map(([type, commits]) => {
            return [`### ${capitalize(type)}`, commits.join('\n')].join('\n\n')
          })
          .join('\n\n')
      })

  if (process.env.TAG && recommendedReleaseLevel === -1) {
    recommendedReleaseLevel = 0
  }

  const releaseType = branchConfig.prerelease
    ? 'prerelease'
    : ({ 0: 'patch', 1: 'minor', 2: 'major' } as const)[recommendedReleaseLevel]

  if (!releaseType) {
    throw new Error(`Invalid release level: ${recommendedReleaseLevel}`)
  }

  const version = process.env.TAG
    ? semver.parse(process.env.TAG)?.version
    : semver.inc(latestTag!, releaseType, npmTag)

  if (!version) {
    throw new Error(
      `Invalid version increment from semver.inc(${[
        latestTag,
        recommendedReleaseLevel,
        branchConfig.prerelease,
      ].join(', ')}`,
    )
  }

  const changelogMd = [
    `Version ${version} - ${DateTime.now().toLocaleString(
      DateTime.DATETIME_SHORT,
    )}`,
    `## Changes`,
    changelogCommitsMd,
    `## Packages`,
    packages.map((d) => `- ${d.name}@${version}`).join('\n'),
  ].join('\n\n')

  console.info('Generating changelog...')
  console.info()
  console.info(changelogMd)
  console.info()

  console.info('Building packages...')
  execSync(`pnpm build`, { encoding: 'utf8', stdio: 'inherit' })
  console.info('')

  console.info('Testing packages...')
  execSync(`pnpm test:ci ${SKIP_TESTS ? '|| exit 0' : ''}`, {
    encoding: 'utf8',
  })
  console.info('')

  console.info(`Updating all changed packages to version ${version}...`)
  // Update each package to the new version
  for (const pkg of packages) {
    console.info(`  Updating ${pkg.name} version to ${version}...`)

    await updatePackageJson(
      path.resolve(rootDir, 'packages', pkg.packageDir, 'package.json'),
      (config) => {
        config.version = version
      },
    )
  }

  if (!process.env.CI) {
    console.warn(
      `This is a dry run for version ${version}. Push to CI to publish for real or set CI=true to override!`,
    )
    return
  }

  // Tag and commit
  console.info(`Creating new git tag v${version}`)
  execSync(`git tag -a -m "v${version}" v${version}`)

  const taggedVersion = getTaggedVersion()
  if (!taggedVersion) {
    throw new Error(
      'Missing the tagged release version. Something weird is afoot!',
    )
  }

  console.info()
  console.info(`Publishing all packages to npm with tag "${npmTag}"`)

  // Publish each package
  packages.map((pkg) => {
    const packageDir = path.join(rootDir, 'packages', pkg.packageDir)
    const cmd = `cd ${packageDir} && pnpm publish --tag ${npmTag} --access=public --no-git-checks`
    console.info(
      `  Publishing ${pkg.name}@${version} to npm with tag "${npmTag}"...`,
    )
    // execSync(`${cmd} --token ${process.env.NPM_TOKEN}`)
    execSync(cmd)
  })

  console.info()

  console.info(`Pushing new tags to branch.`)
  execSync(`git push --tags`)
  console.info(`  Pushed tags to branch.`)

  if (branchConfig.ghRelease) {
    console.info(`Creating github release...`)
    // Stringify the markdown to excape any quotes
    execSync(
      `gh release create v${version} ${
        !isLatestBranch ? '--prerelease' : ''
      } --notes '${changelogMd}'`,
    )
    console.info(`  Github release created.`)

    console.info(`Committing changes...`)
    execSync(`git add -A && git commit -m "${releaseCommitMsg(version)}"`)
    console.info()
    console.info(`  Committed Changes.`)
    console.info(`Pushing changes...`)
    execSync(`git push`)
    console.info()
    console.info(`  Changes pushed.`)
  } else {
    console.info(`Skipping github release and change commit.`)
  }

  console.info(`Pushing tags...`)
  execSync(`git push --tags`)
  console.info()
  console.info(`  Tags pushed.`)
  console.info(`All done!`)
}

run().catch((err) => {
  console.info(err)
  if (err.stdout) {
    console.log(err.stdout.toString())
  }
  if (err.stderr) {
    console.log(err.stderr.toString())
  }
  process.exit(1)
})

function capitalize(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1)
}

async function readPackageJson(pathName: string) {
  return (await jsonfile.readFile(pathName)) as PackageJson
}

async function updatePackageJson(
  pathName: string,
  transform: (json: PackageJson) => Promise<void> | void,
) {
  const json = await readPackageJson(pathName)
  await transform(json)
  await jsonfile.writeFile(pathName, json, {
    spaces: 2,
  })
}

function updateExampleLockfile(example: string) {
  // execute npm to update lockfile, ignoring any stdout or stderr
  const exampleDir = path.join(rootDir, 'examples', example)
  execSync(`cd ${exampleDir} && pnpm install`, { stdio: 'ignore' })
}

function getPackageNameDirectory(pathName: string) {
  return pathName
    .split('/')
    .filter((d) => !d.startsWith('@'))
    .join('/')
}

function getTaggedVersion() {
  const output = execSync('git tag --list --points-at HEAD').toString()
  return output.replace(/^v|\n+$/g, '')
}
