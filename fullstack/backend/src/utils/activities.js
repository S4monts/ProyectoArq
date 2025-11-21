const db = require('../db');

async function log(action, byUserId, byUserName, targetType, targetId, details = {}) {
  try {
    const row = db.prepare('SELECT MAX(id) as maxId FROM activities_norm').get();
    const next = row && row.maxId ? Number(row.maxId) + 1 : 1;
    const item = { id: next, action, byUserId, byUserName, targetType, targetId, details, timestamp: new Date().toISOString() };
    db.prepare('INSERT INTO activities_norm (id, action, byUserId, byUserName, targetType, targetId, details, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(String(item.id), item.action, item.byUserId || null, item.byUserName || null, item.targetType || null, item.targetId || null, JSON.stringify(item.details || {}), item.timestamp);
    return item;
  } catch (e) {
    const rows = db.prepare('SELECT json FROM activities').all();
    const all = rows.map(r => JSON.parse(r.json));
    const id = (all.map(a=>Number(a.id)).filter(n=>Number.isInteger(n)&&n>0).sort((a,b)=>a-b).reduce((cur,n)=> n===cur?cur+1:cur,1));
    const item = { id, action, byUserId, byUserName, targetType, targetId, details, timestamp: new Date().toISOString() };
    db.prepare('INSERT INTO activities (id, json) VALUES (?, ?)').run(String(id), JSON.stringify(item));
    return item;
  }
}

module.exports = { log };
