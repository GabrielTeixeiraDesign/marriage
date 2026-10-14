import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const preview = process.argv.includes('--preview');
const port = Number(process.env.PORT || (preview ? 4173 : 5173));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.webp': 'image/webp' };

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    let directory, relative;
    if (preview) {
      directory = path.join(root, 'dist');
      relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    } else if (pathname === '/' || pathname === '/index.html') {
      directory = path.join(root, 'src'); relative = 'index.html';
    } else if (pathname.startsWith('/assets/css/') || pathname.startsWith('/assets/js/')) {
      directory = path.join(root, 'src'); relative = pathname.slice('/assets/'.length);
    } else if (pathname.startsWith('/assets/images/')) {
      directory = path.join(root, 'assets'); relative = pathname.slice('/assets/'.length);
    } else {
      res.writeHead(404).end('Página não encontrada'); return;
    }
    const file = path.resolve(directory, relative);
    if (!file.startsWith(directory + path.sep)) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  } catch (error) {
    res.writeHead(error.code === 'ENOENT' ? 404 : 400).end('Arquivo indisponível');
  }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
