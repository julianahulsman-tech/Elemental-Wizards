const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '1mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'progress.json');
const CHAR_FILE = path.join(DATA_DIR, 'characters.json');
const FRIENDS_FILE = path.join(DATA_DIR, 'friends.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({}), 'utf8');
if (!fs.existsSync(CHAR_FILE)) fs.writeFileSync(CHAR_FILE, JSON.stringify({}), 'utf8');
if (!fs.existsSync(FRIENDS_FILE)) fs.writeFileSync(FRIENDS_FILE, JSON.stringify({}), 'utf8');

function readDB(){
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8') || '{}'); }
  catch(e){ return {}; }
}

function writeDB(obj){
  fs.writeFileSync(DB_FILE, JSON.stringify(obj, null, 2), 'utf8');
}

function readChars(){
  try { return JSON.parse(fs.readFileSync(CHAR_FILE, 'utf8') || '{}'); }
  catch(e){ return {}; }
}

function writeChars(obj){
  fs.writeFileSync(CHAR_FILE, JSON.stringify(obj, null, 2), 'utf8');
}

function readFriends(){
  try { return JSON.parse(fs.readFileSync(FRIENDS_FILE, 'utf8') || '{}'); }
  catch(e){ return {}; }
}

function writeFriends(obj){
  fs.writeFileSync(FRIENDS_FILE, JSON.stringify(obj, null, 2), 'utf8');
}

// Serve the existing static site so client can call relative paths
app.use(express.static(path.join(__dirname), { extensions: ['html'] }));

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

// --- Character endpoints --------------------------------------------------
// List characters for a user
app.get('/api/characters/:user', (req, res) => {
  const user = req.params.user.toLowerCase();
  const chars = readChars();
  return res.json({ characters: chars[user] || [] });
});

// Create a character for a user
app.post('/api/characters/:user', (req, res) => {
  const user = req.params.user.toLowerCase();
  const body = req.body || {};
  if (!body.name) return res.status(400).json({ error: 'missing name' });
  const chars = readChars();
  const id = Date.now().toString(36) + '-' + Math.floor(Math.random()*10000).toString(36);
  const rec = { id, name: body.name, element: body.element || null, data: body.data || {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  chars[user] = chars[user] || [];
  chars[user].push(rec);
  try { writeChars(chars); return res.json(rec); } catch(e){ return res.status(500).json({ error: 'write failed' }); }
});

// Get a single character
app.get('/api/characters/:user/:id', (req, res) => {
  const user = req.params.user.toLowerCase();
  const id = req.params.id;
  const chars = readChars();
  const list = chars[user] || [];
  const found = list.find(c=>c.id===id);
  if(!found) return res.status(404).json({ error: 'not found' });
  return res.json(found);
});

// Update a character
app.put('/api/characters/:user/:id', (req, res) => {
  const user = req.params.user.toLowerCase();
  const id = req.params.id;
  const body = req.body || {};
  const chars = readChars();
  const list = chars[user] || [];
  const idx = list.findIndex(c=>c.id===id);
  if(idx<0) return res.status(404).json({ error: 'not found' });
  const updated = Object.assign({}, list[idx], body, { updatedAt: new Date().toISOString() });
  list[idx] = updated;
  chars[user] = list;
  try { writeChars(chars); return res.json(updated); } catch(e){ return res.status(500).json({ error: 'write failed' }); }
});

// Delete a character
app.delete('/api/characters/:user/:id', (req, res) => {
  const user = req.params.user.toLowerCase();
  const id = req.params.id;
  const chars = readChars();
  const list = chars[user] || [];
  const idx = list.findIndex(c=>c.id===id);
  if(idx<0) return res.status(404).json({ error: 'not found' });
  list.splice(idx,1);
  chars[user]=list;
  try{ writeChars(chars); return res.json({ ok:true }); }catch(e){ return res.status(500).json({ error: 'write failed' }); }
});

// --- Friends endpoints ---------------------------------------------------
// Get friends list for a user
app.get('/api/friends/:user', (req, res) => {
  const user = req.params.user.toLowerCase();
  const friends = readFriends();
  const userFriends = friends[user] || { list: [], pending: [] };
  return res.json(userFriends);
});

// A user is "known" to the server once they have any saved data
function isKnownUser(name){
  const n = name.toLowerCase();
  return !!(readDB()[n] || readChars()[n] || readFriends()[n]);
}

// Send friend request (one user to another)
app.post('/api/friends/:user/request', (req, res) => {
  const user = req.params.user.toLowerCase();
  const { target } = req.body || {};
  if (!target) return res.status(400).json({ error: 'missing target' });
  const targetLower = target.toLowerCase();
  if (user === targetLower) return res.status(400).json({ error: 'cannot friend self' });
  if (!isKnownUser(targetLower)) return res.status(404).json({ error: 'user not found' });

  const friends = readFriends();
  friends[user] = friends[user] || { list: [], pending: [] };
  friends[targetLower] = friends[targetLower] || { list: [], pending: [] };
  
  // Add to target's pending requests
  if (!friends[targetLower].pending) friends[targetLower].pending = [];
  if (!friends[targetLower].pending.includes(user)) friends[targetLower].pending.push(user);
  
  try { writeFriends(friends); return res.json({ ok: true }); }
  catch(e){ return res.status(500).json({ error: 'write failed' }); }
});

// Accept friend request
app.post('/api/friends/:user/accept', (req, res) => {
  const user = req.params.user.toLowerCase();
  const { from } = req.body || {};
  if (!from) return res.status(400).json({ error: 'missing from' });
  const fromLower = from.toLowerCase();
  
  const friends = readFriends();
  friends[user] = friends[user] || { list: [], pending: [] };
  friends[fromLower] = friends[fromLower] || { list: [], pending: [] };

  // Only accept a request that actually exists
  if (!friends[user].pending) friends[user].pending = [];
  if (!friends[user].pending.includes(fromLower)) return res.status(404).json({ error: 'no pending request from that user' });
  friends[user].pending = friends[user].pending.filter(f => f !== fromLower);

  // Add to both lists
  if (!friends[user].list) friends[user].list = [];
  if (!friends[fromLower].list) friends[fromLower].list = [];
  if (!friends[user].list.includes(fromLower)) friends[user].list.push(fromLower);
  if (!friends[fromLower].list.includes(user)) friends[fromLower].list.push(user);
  
  try { writeFriends(friends); return res.json({ ok: true }); }
  catch(e){ return res.status(500).json({ error: 'write failed' }); }
});

// Reject/decline friend request
app.post('/api/friends/:user/decline', (req, res) => {
  const user = req.params.user.toLowerCase();
  const { from } = req.body || {};
  if (!from) return res.status(400).json({ error: 'missing from' });
  const fromLower = from.toLowerCase();
  
  const friends = readFriends();
  friends[user] = friends[user] || { list: [], pending: [] };
  
  if (!friends[user].pending) friends[user].pending = [];
  friends[user].pending = friends[user].pending.filter(f => f !== fromLower);
  
  try { writeFriends(friends); return res.json({ ok: true }); }
  catch(e){ return res.status(500).json({ error: 'write failed' }); }
});

// Remove friend
app.delete('/api/friends/:user/:friend', (req, res) => {
  const user = req.params.user.toLowerCase();
  const friend = req.params.friend.toLowerCase();
  
  const friends = readFriends();
  friends[user] = friends[user] || { list: [], pending: [] };
  friends[friend] = friends[friend] || { list: [], pending: [] };
  
  if (!friends[user].list) friends[user].list = [];
  if (!friends[friend].list) friends[friend].list = [];
  
  friends[user].list = friends[user].list.filter(f => f !== friend);
  friends[friend].list = friends[friend].list.filter(f => f !== user);
  
  try { writeFriends(friends); return res.json({ ok: true }); }
  catch(e){ return res.status(500).json({ error: 'write failed' }); }
});

// Serve small client helper file
app.get('/save-progress.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'save-progress.js'));
});

// Serve characters helper
app.get('/characters.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'characters.js'));
});

// Serve friends helper
app.get('/friends.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'friends.js'));
});

app.listen(PORT, () => console.log(`Elemental Wizards backend listening on http://localhost:${PORT}`));
