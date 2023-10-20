/* eslint-disable */
import { build } from 'esbuild'
import { glob } from 'glob'
const files = await glob('src/gql-functions/*.ts', {
  ignore: ['src/gql-functions/*.test.ts'],
})

console.log('files: ' + files)
console.log(files)

await build({
  sourcemap: 'inline',
  sourcesContent: false,
  format: 'esm',
  target: 'esnext',
  platform: 'node',
  external: ['@aws-appsync/utils'],
  outdir: 'lib/gql-functions',
  entryPoints: files,
  bundle: true,
})
