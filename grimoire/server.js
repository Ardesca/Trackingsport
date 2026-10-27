// Serveur minimal sans dépendance : sert le site et stocke tout dans data.json
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');
const DB_FILE = path.join(__dirname, 'data.json');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function readDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return { exercises: [], programs: [] };
  }
}

function writeDb(data) {
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DB_FILE); // écriture atomique
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/api/data') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': TYPES['.json'] });
      return res.end(JSON.stringify(readDb()));
    }
    if (req.method === 'PUT') {
      let body = '';
      req.on('data', (c) => {
        body += c;
        if (body.length > 5e6) req.destroy();
      });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (!Array.isArray(data.exercises) || !Array.isArray(data.programs)) {
            throw new Error('format invalide');
          }
          writeDb({ exercises: data.exercises, programs: data.programs });
          res.writeHead(200, { 'Content-Type': TYPES['.json'] });
          res.end('{"ok":true}');
        } catch (e) {
          res.writeHead(400, { 'Content-Type': TYPES['.json'] });
          res.end(JSON.stringify({ ok: false, error: e.message }));
        }
      });
      return;
    }
    res.writeHead(405);
    return res.end();
  }

  // Fichiers statiques
  let file = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const full = path.normalize(path.join(PUBLIC, file));
  if (!full.startsWith(PUBLIC)) {
    res.writeHead(403);
    return res.end();
  }
  fs.readFile(full, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Introuvable');
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(full)] || 'application/octet-stream' });
    res.end(buf);
  });
});

server.listen(PORT, () => {
  console.log(`Grimoire ouvert sur http://localhost:${PORT}`);
});
