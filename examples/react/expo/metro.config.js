const path = require('path')
const fs = require('fs')
const { getDefaultConfig } = require('expo/metro-config')
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../../..')

// Set EXPO_ROUTER_APP_ROOT to absolute path BEFORE config is created
// This ensures require.context resolves correctly with pnpm symlinks
const appRoot = path.resolve(projectRoot, 'app')
process.env.EXPO_ROUTER_APP_ROOT = appRoot
process.env.EXPO_ROUTER_IMPORT_MODE = 'sync'

const config = getDefaultConfig(projectRoot)

config.projectRoot = projectRoot

config.watchFolders = [
  path.resolve(monorepoRoot, 'packages'),
  path.resolve(monorepoRoot, 'node_modules/.pnpm'),
]

config.resolver.unstable_enableSymlinks = true
config.resolver.unstable_enablePackageExports = true

// Resolve from app's node_modules first, then root .pnpm for transitive deps
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules/.pnpm/node_modules'),
]
// Pin singletons and expo packages to prevent duplicate instances and ensure resolution
const singletons = [
  'react',
  'react-native',
  'expo',
  'expo-router',
  'expo-modules-core',
  'expo-constants',
  '@expo/metro-runtime',
]
config.resolver.extraNodeModules = singletons.reduce((acc, name) => {
  acc[name] = path.resolve(projectRoot, 'node_modules', name)
  return acc
}, {})

// Wrap with NativeWind, then Reanimated
module.exports = wrapWithReanimatedMetroConfig(config)
