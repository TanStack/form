import { compile as compileToReact } from '@tsrx/react';
import { transformSync } from 'esbuild';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const fixtureDirectory = join(dirname(fileURLToPath(import.meta.url)), '../_fixtures');
const cacheDirectory = join(dirname(fileURLToPath(import.meta.url)), '.react-cache');

function hashString(value: string): string {
	let hash = 5381;
	for (let index = 0; index < value.length; index++) {
		hash = ((hash << 5) + hash + value.charCodeAt(index)) | 0;
	}
	return Math.abs(hash).toString(36);
}

function compileFixture(sourcePath: string): void {
	const compiled = compileToReact(readFileSync(sourcePath, 'utf8'), sourcePath);
	if (compiled.errors?.length) {
		throw new Error(`Unable to compile ${sourcePath} for React:\n${compiled.errors.join('\n')}`);
	}

	const transformed = transformSync(compiled.code, {
		loader: 'tsx',
		jsx: 'automatic',
		jsxImportSource: 'react',
		target: 'esnext',
		format: 'esm',
		sourcefile: sourcePath,
	});
	const rewritten = transformed.code
		.replace(
			/from\s+["']@octanejs\/tanstack-form(\/[^"']*)?["']/g,
			(_match, subpath) => `from "@tanstack/react-form${subpath || ''}"`,
		)
		.replace(/from\s+["']octane["']/g, 'from "react"');
	const slug = basename(sourcePath).replace(/\.tsrx$/, '');
	writeFileSync(join(cacheDirectory, `${slug}-${hashString(sourcePath)}.js`), rewritten);
}

export async function setup(): Promise<void> {
	rmSync(cacheDirectory, { recursive: true, force: true });
	mkdirSync(cacheDirectory, { recursive: true });
	const fixture = join(fixtureDirectory, 'parity.tsrx');
	if (!existsSync(fixture))
		throw new Error(`Missing declared TanStack Form parity fixture: ${fixture}`);
	compileFixture(fixture);
}

export async function teardown(): Promise<void> {}
