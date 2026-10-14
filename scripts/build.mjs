import { cp, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');

// Copy only the deployable sources, never the previous hosting metadata or originals.
await mkdir(path.join(output, 'assets'), { recursive: true });
await copyFile(path.join(root, 'src/index.html'), path.join(output, 'index.html'));
await cp(path.join(root, 'src/css'), path.join(output, 'assets/css'), { recursive: true });
await cp(path.join(root, 'src/js'), path.join(output, 'assets/js'), { recursive: true });
await cp(path.join(root, 'assets/images'), path.join(output, 'assets/images'), { recursive: true });
console.log('Build concluído: dist/');
