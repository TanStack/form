const path = require('path')
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
  'react-dom',
  'react-native',
  '@tanstack/react-store',
  'use-sync-external-store',
  'expo',
  'expo-router',
  'expo-modules-core',
  'expo-constants',
  '@expo/metro-runtime',
]
const resolvePackageRoot = (name) => {
  try {
    return path.dirname(
      require.resolve(`${name}/package.json`, { paths: [projectRoot] }),
    )
  } catch {
    return null
  }
}
const singletonPaths = singletons.reduce((acc, name) => {
  const packageRoot = resolvePackageRoot(name)

  if (packageRoot) {
    acc[name] = packageRoot
  }

  return acc
}, {})

config.resolver.extraNodeModules = singletons.reduce((acc, name) => {
  if (singletonPaths[name]) {
    acc[name] = singletonPaths[name]
  }

  return acc
}, {})

function getPackageName(moduleName) {
  if (moduleName.startsWith('@')) {
    return moduleName.split('/').slice(0, 2).join('/')
  }

  return moduleName.split('/')[0]
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const packageName = getPackageName(moduleName)
  const singletonPath = singletonPaths[packageName]

  if (singletonPath) {
    const subpath = moduleName.slice(packageName.length + 1)
    const target = subpath ? path.join(singletonPath, subpath) : singletonPath

    return context.resolveRequest(context, target, platform)
  }

  return context.resolveRequest(context, moduleName, platform)
}

// Wrap with NativeWind, then Reanimated
module.exports = wrapWithReanimatedMetroConfig(config)
