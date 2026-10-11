/**
 * Let our normal `tsc` commands check TSRX implementations across the supported
 * TypeScript versions. TypeScript does not load language-service plugins in
 * `tsc`, so configuring @tsrx/typescript-plugin alone only enables editor support.
 *
 * ts-patch loads this program transformer, which connects TSRX's language plugin
 * to Volar using the compiler instance running the command. It discovers .tsrx
 * files, checks their implementations even when declaration companions exist,
 * and turns TSRX compiler failures into diagnostics that make `tsc` fail.
 *
 * This is our ts-patch integration, so we keep it local instead of patching the
 * TSRX dependency. It currently relies on an internal factory in TSRX 0.4.6;
 * keep the pinned dependency and factory import in sync when upgrading.
 */
import { createRequire } from 'node:module'
import { proxyCreateProgram } from '@volar/typescript'
import type {
  IScriptSnapshot,
  Language,
  LanguagePlugin,
  VirtualCode,
} from '@volar/language-core'
import type { ProgramTransformer } from 'ts-patch'
import type * as TypeScript from 'typescript'

type TypeScriptModule = typeof TypeScript

interface TsrxVirtualCode extends VirtualCode {
  fileName?: string
  compilerFailed?: boolean
  originalCode?: string
  fatalErrors?: ReadonlyArray<unknown>
  usageErrors?: ReadonlyArray<unknown>
}

type TsrxLanguagePlugin = LanguagePlugin<string, TsrxVirtualCode> & {
  createVirtualCode: NonNullable<
    LanguagePlugin<string, TsrxVirtualCode>['createVirtualCode']
  >
  updateVirtualCode: NonNullable<
    LanguagePlugin<string, TsrxVirtualCode>['updateVirtualCode']
  >
  typescript: NonNullable<LanguagePlugin<string>['typescript']>
}

interface TsrxLanguageModule {
  t(options: {
    ts: TypeScriptModule
    configFileName?: string
    configHost: TypeScript.System
  }): TsrxLanguagePlugin
}

type ConfiguredCompilerOptions = TypeScript.CompilerOptions & {
  configFilePath?: string
  configFile?: TypeScript.TsConfigSourceFile
}

type DiagnosticProgram = TypeScript.Program & {
  getBindAndCheckDiagnostics?: TypeScript.Program['getSemanticDiagnostics']
}

// TSRX 0.4.6 has no public factory export. Keep this version-specific boundary here.
const requireTsrx = createRequire(__filename)
const { t: createLanguagePlugin } = requireTsrx(
  '@tsrx/typescript-plugin/dist/language-CofXAudP.js',
) as TsrxLanguageModule

// Keep using the TypeScript version that invoked this ts-patch transformer.
const transformProgram: ProgramTransformer = (
  program,
  host,
  _config,
  { ts },
) => {
  const options: ConfiguredCompilerOptions = program.getCompilerOptions()
  const configFileName = options.configFilePath ?? options.configFile?.fileName
  const errors: Array<TypeScript.Diagnostic> = []
  // TypeScript's initial config scan does not discover .tsrx files.
  const parsed = configFileName
    ? ts.getParsedCommandLineOfConfigFile(
        configFileName,
        options,
        {
          ...ts.sys,
          onUnRecoverableConfigFileDiagnostic: (diagnostic) =>
            errors.push(diagnostic),
        },
        undefined,
        undefined,
        [
          {
            extension: '.tsrx',
            isMixedContent: false,
            scriptKind: ts.ScriptKind.Deferred,
          },
        ],
      )
    : undefined
  const compilerOptions = { ...options, allowNonTsExtensions: true }
  const compilerHost = { ...(host ?? ts.createCompilerHost(compilerOptions)) }
  // Volar wraps getSourceFile; the watch host's optional fast path bypasses it.
  delete compilerHost.getSourceFileByPath
  // Refresh stale TSRX ASTs through the original host, retaining watchers and versions.
  const getSourceFile = compilerHost.getSourceFile.bind(compilerHost)
  compilerHost.getSourceFile = (
    fileName,
    languageVersion,
    onError,
    shouldCreateNewSourceFile,
  ) =>
    getSourceFile(
      fileName,
      languageVersion,
      onError,
      fileName.endsWith('.tsrx') || shouldCreateNewSourceFile,
    )

  const plugin = guardLanguagePlugin(
    ts,
    createLanguagePlugin({ ts, configFileName, configHost: ts.sys }),
  )
  // Extra service scripts are for the editor, not Volar's program integration.
  delete plugin.typescript.getExtraServiceScripts
  let language: Language<string> | undefined
  // Rebuild from source instead of reusing the initial declaration-only program.
  const createProgram = proxyCreateProgram(ts, ts.createProgram, () => ({
    languagePlugins: [plugin],
    setup(value) {
      language = value
    },
  }))
  const result = createProgram({
    rootNames: parsed?.fileNames ?? program.getRootFileNames(),
    options: compilerOptions,
    host: compilerHost,
    configFileParsingDiagnostics: [
      ...(parsed?.errors ?? program.getConfigFileParsingDiagnostics()),
      ...errors,
    ],
    projectReferences: program.getProjectReferences(),
  })
  if (!language) throw new Error('Volar did not initialize the TSRX language')
  addDiagnostics(ts, language, result)
  return result
}

export default transformProgram

function getTsrxRoot(
  language: Language<string>,
  fileName: string,
): TsrxVirtualCode | undefined {
  return language.scripts.get(fileName)?.generated?.root
}

function addDiagnostics(
  ts: TypeScriptModule,
  language: Language<string>,
  program: DiagnosticProgram,
) {
  // Report the compiler error, not TSX errors caused by its raw TSRX fallback.
  const keepDiagnostic = (diagnostic: TypeScript.Diagnostic) => {
    if (!diagnostic.file?.fileName.endsWith('.tsrx')) return true
    return !getTsrxRoot(language, diagnostic.file.fileName)?.fatalErrors?.length
  }
  for (const method of [
    'getSemanticDiagnostics',
    'getBindAndCheckDiagnostics',
  ] as const) {
    const original = program[method]
    if (original)
      program[method] = (...args) => original(...args).filter(keepDiagnostic)
  }
  const getSyntacticDiagnostics = program.getSyntacticDiagnostics
  program.getSyntacticDiagnostics = (sourceFile, cancellationToken) => {
    const diagnostics = getSyntacticDiagnostics(
      sourceFile,
      cancellationToken,
    ).filter(keepDiagnostic)
    for (const file of sourceFile ? [sourceFile] : program.getSourceFiles()) {
      if (!file.fileName.endsWith('.tsrx')) continue
      const script = language.scripts.get(file.fileName)
      const root: TsrxVirtualCode | undefined = script?.generated?.root
      const errors = root
        ? [...(root.fatalErrors ?? []), ...(root.usageErrors ?? [])]
        : [{ message: 'No TSRX compiler could be loaded for this file.' }]
      if (!errors.length) continue
      const text =
        root?.originalCode ??
        script?.snapshot.getText(0, script.snapshot.getLength()) ??
        file.text
      const originalFile = ts.createSourceFile(
        file.fileName,
        text,
        ts.ScriptTarget.Latest,
        false,
        ts.ScriptKind.TSX,
      )
      for (const error of errors) {
        const detail = compilerErrorDetails(error)
        const start = Math.max(0, Math.min(detail.pos ?? 0, text.length))
        const end = Math.max(
          start,
          Math.min(detail.end ?? detail.raisedAt ?? start + 1, text.length),
        )
        diagnostics.push({
          file: originalFile,
          start,
          length: end - start,
          category: ts.DiagnosticCategory.Error,
          code: 90001,
          source: 'tsrx',
          messageText: detail.message,
        })
      }
    }
    return diagnostics
  }
}

function compilerErrorDetails(error: unknown) {
  if (typeof error !== 'object' || error === null) {
    return { message: String(error) }
  }
  return {
    message:
      'message' in error ? String(error.message ?? error) : String(error),
    pos:
      'pos' in error && typeof error.pos === 'number' ? error.pos : undefined,
    end:
      'end' in error && typeof error.end === 'number' ? error.end : undefined,
    raisedAt:
      'raisedAt' in error && typeof error.raisedAt === 'number'
        ? error.raisedAt
        : undefined,
  }
}

function guardLanguagePlugin(
  ts: TypeScriptModule,
  plugin: TsrxLanguagePlugin,
): TsrxLanguagePlugin {
  function failed(
    fileName: string,
    snapshot: IScriptSnapshot,
    error: unknown,
  ): TsrxVirtualCode {
    return {
      id: 'root',
      languageId: 'tsrx',
      fileName,
      compilerFailed: true,
      originalCode: snapshot.getText(0, snapshot.getLength()),
      snapshot: ts.ScriptSnapshot.fromString('export {};'),
      mappings: [],
      embeddedCodes: [],
      fatalErrors: [error],
      usageErrors: [],
    }
  }
  const createVirtualCode: TsrxLanguagePlugin['createVirtualCode'] = (
    fileName,
    languageId,
    snapshot,
    context,
  ) => {
    try {
      const code = plugin.createVirtualCode(
        fileName,
        languageId,
        snapshot,
        context,
      )
      if (code || languageId !== 'tsrx') return code
      throw new Error('No TSRX compiler could be loaded for this file.')
    } catch (error) {
      return failed(fileName, snapshot, error)
    }
  }
  return {
    ...plugin,
    createVirtualCode,
    updateVirtualCode(fileName, code, snapshot, context) {
      if (code.compilerFailed)
        return createVirtualCode(fileName, 'tsrx', snapshot, context)
      try {
        return plugin.updateVirtualCode(fileName, code, snapshot, context)
      } catch (error) {
        return failed(fileName, snapshot, error)
      }
    },
  }
}
