// @ts-check

import { publish } from '@tanstack/config/publish'
import { branchConfigs, packages, rootDir } from './config.js'

publish({
  branchConfigs,
  packages,
  rootDir,
  branch: process.env.BRANCH,
  tag: process.env.TAG,
  ghToken: process.env.GH_TOKEN,
}).catch((err) => {
  console.info(err)
  process.exit(1)
})
