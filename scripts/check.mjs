import { readFile, access, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { getCountdownState, COUNTDOWN_START, WEDDING_DATE } from '../src/js/countdown.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(path.join(root, 'src/index.html'), 'utf8');
const css = await readFile(path.join(root, 'src/css/style.css'), 'utf8');
const js = await readFile(path.join(root, 'src/js/app.js'), 'utf8');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(anchor)) throw new Error(`Âncora sem destino: #${anchor}`);
}
for (const [, asset] of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) {
  const source = asset.startsWith('assets/images/') ? asset : asset.replace(/^assets\//, 'src/');
  await access(path.join(root, source));
}
for (const [, asset] of css.matchAll(/url\(['"]?(\.\.\/images\/[^)'"\s]+)['"]?\)/g)) {
  await access(path.join(root, 'assets/images', path.basename(asset)));
}
for (const [, photo] of html.matchAll(/data-photo="([^"]+)"/g)) {
  await access(path.join(root, 'assets/images', `${photo}.webp`));
}
if (!js.includes('assets/images/${el.dataset.photo}.webp')) throw new Error('Caminho da galeria incorreto');
const images = await readdir(path.join(root, 'assets/images'));
const beginning = getCountdownState(COUNTDOWN_START);
const halfway = getCountdownState(new Date((COUNTDOWN_START.getTime() + WEDDING_DATE.getTime()) / 2));
const end = getCountdownState(WEDDING_DATE);
assert.equal(beginning.fraction, 1);
assert.equal(beginning.topY, 22);
assert.equal(beginning.bottomY, 140);
assert.equal(halfway.fraction, .5);
assert.ok(halfway.topY > beginning.topY && halfway.bottomY < beginning.bottomY);
assert.equal(end.days, 0);
assert.equal(end.topY, 78);
assert.equal(end.bottomY, 84);
assert.equal(end.finished, true);
assert.equal(getCountdownState(new Date('2028-01-01')).fraction, 0);
assert.equal(getCountdownState(new Date('2020-01-01')).fraction, 1);
console.log(`Verificado: âncoras, caminhos de CSS/JS, galeria e ${images.length} imagens.`);
console.log('Ampulheta: início, metade, fim e datas fora do intervalo verificados.');
