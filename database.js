const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'crm.sqlite'));
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, businessName TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('New','Contacted','Converted')), createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
module.exports = db;
