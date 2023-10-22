/* eslint-disable */
import { build } from 'esbuild'
import { glob } from 'glob'
const files = await glob('src/*.ts')

console.log('Bundling files... ')
console.log(files)

await build({
  sourcemap: 'inline',
  sourcesContent: false,
  format: 'esm',
  target: 'esnext',
  platform: 'node',
  external: ['@aws-appsync/utils'],
  outdir: 'lib/gql',
  entryPoints: files,
  bundle: true,
})
