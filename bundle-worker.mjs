import { build } from 'esbuild';
import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const distDir = path.join(__dirname, '.vercel/output/static/_worker.js/__next-on-pages-dist__');

// Plugin to resolve bare specifier imports for next-on-pages modules
const nextOnPagesPlugin = {
  name: 'next-on-pages-resolver',
  setup(build) {
    // Resolve __next-on-pages-dist__ bare specifiers
    build.onResolve({ filter: /^__next-on-pages-dist__/ }, (args) => {
      const relativePath = args.path.replace('__next-on-pages-dist__/', '');
      const fullPath = path.join(distDir, relativePath);
      return { path: fullPath };
    });
  },
};

await build({
  entryPoints: ['.vercel/output/static/_worker.js/index.js'],
  bundle: true,
  outfile: '.vercel/output/static/_worker.js/bundle.js',
  format: 'esm',
  platform: 'browser',
  conditions: ['workerd', 'worker', 'browser'],
  external: ['node:*', 'cloudflare:*'],
  minify: false,
  plugins: [nextOnPagesPlugin],
  logLevel: 'info',
});

console.log('Bundle created successfully!');
