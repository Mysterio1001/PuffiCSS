import { mkdir, cp, writeFile } from 'node:fs/promises';
import { logo } from './src/brand.js';
const mark = logo.replace(' class="logo-mark"', '').replace(' aria-hidden="true"', ' role="img" aria-label="PuffiCSS 河豚標誌"');
await mkdir(new URL('./assets/', import.meta.url), { recursive: true });
await writeFile(new URL('./favicon.svg', import.meta.url), mark);
await writeFile(new URL('./assets/pufficss-mark.svg', import.meta.url), mark);
await mkdir(new URL('./dist/', import.meta.url), { recursive: true });
for (const file of ['index.html', 'favicon.svg', 'assets', 'src', 'LICENSE']) {
  await cp(new URL(file, import.meta.url), new URL(`dist/${file}`, import.meta.url), { recursive: true });
}
console.log('Static site built in dist/');
