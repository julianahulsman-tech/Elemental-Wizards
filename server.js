const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '1mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'progress.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({}), 'utf8');

function readDB(){
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8') || '{}'); }
  catch(e){ return {}; }
}

function writeDB(obj){
  fs.writeFileSync(DB_FILE, JSON.stringify(obj, null, 2), 'utf8');
}

// Serve the existing static site so client can call relative paths
app.use(express.static(path.join(__dirname)));

// API: save progress
app.post('/api/progress', (req, res) => {
  const { id, progress } = req.body || {};
  if (!id) return res.status(400).json({ error: 'missing id' });
  const db = readDB();
  db[id] = { progress, updatedAt: new Date().toISOString() };
  try { writeDB(db); return res.json({ ok: true }); }
  catch(err){ console.error(err); return res.status(500).json({ error: 'write failed' }); }
});

// API: get progress
app.get('/api/progress/:id', (req, res) => {
  const id = req.params.id;
  const db = readDB();
  if (!db[id]) return res.status(404).json({ error: 'not found' });
  return res.json(db[id]);
});

// Serve small client helper file
app.get('/save-progress.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'save-progress.js'));
});

app.listen(PORT, () => console.log(`Elemental Wizards backend listening on http://localhost:${PORT}`));
