const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const DATA_DIR = path.join(__dirname, "..", "..", "data");

class Store {
  constructor() {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    this.db = new Database(path.join(DATA_DIR, "bot.db"));
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("foreign_keys = ON");
    this.migrate();
    this.prepare();
  }

  migrate() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS kv (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        channel_id TEXT UNIQUE,
        owner_id TEXT NOT NULL,
        category TEXT NOT NULL,
        subject TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        claimed_by TEXT,
        voice_channel_id TEXT,
        rating INTEGER,
        created_at INTEGER NOT NULL,
        closed_at INTEGER,
        closed_by TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
      CREATE INDEX IF NOT EXISTS idx_tickets_owner ON tickets(owner_id);
    `);
  }

  prepare() {
    this.stmts = {
      getKv: this.db.prepare("SELECT value FROM kv WHERE key = ?"),
      setKv: this.db.prepare(
        "INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      ),
      createTicket: this.db.prepare(`
        INSERT INTO tickets (guild_id, channel_id, owner_id, category, subject, description, status, created_at)
        VALUES (@guild_id, @channel_id, @owner_id, @category, @subject, @description, 'open', @created_at)
      `),
      getByChannel: this.db.prepare("SELECT * FROM tickets WHERE channel_id = ?"),
      getById: this.db.prepare("SELECT * FROM tickets WHERE id = ?"),
      openByOwner: this.db.prepare("SELECT * FROM tickets WHERE owner_id = ? AND status = 'open'"),
      stats: this.db.prepare(`
        SELECT
          SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open_count,
          COUNT(*) AS total_count,
          AVG(CASE WHEN rating IS NOT NULL THEN rating END) AS avg_rating,
          SUM(CASE WHEN rating IS NOT NULL THEN 1 ELSE 0 END) AS rating_count
        FROM tickets
      `),
      ownerStats: this.db.prepare(`
        SELECT
          COUNT(*) AS total_count,
          SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open_count,
          AVG(CASE WHEN rating IS NOT NULL THEN rating END) AS avg_rating
        FROM tickets WHERE owner_id = ?
      `),
      claim: this.db.prepare("UPDATE tickets SET claimed_by = ? WHERE id = ? AND status = 'open'"),
      setVoice: this.db.prepare("UPDATE tickets SET voice_channel_id = ? WHERE id = ?"),
      close: this.db.prepare(
        "UPDATE tickets SET status = 'closed', closed_at = ?, closed_by = ?, rating = COALESCE(?, rating) WHERE id = ?",
      ),
      rate: this.db.prepare("UPDATE tickets SET rating = ? WHERE id = ?"),
    };
  }

  get(key, fallback = null) {
    const row = this.stmts.getKv.get(key);
    if (!row) return fallback;
    try {
      return JSON.parse(row.value);
    } catch {
      return fallback;
    }
  }

  set(key, value) {
    this.stmts.setKv.run(key, JSON.stringify(value));
  }

  saveStructure(guildId, roles, channels) {
    this.set(`roles:${guildId}`, roles);
    this.set(`channels:${guildId}`, channels);
    this.set(`setup:${guildId}`, { at: Date.now() });
  }

  getRoles(guildId) {
    return this.get(`roles:${guildId}`, {});
  }

  getChannels(guildId) {
    return this.get(`channels:${guildId}`, {});
  }

  nextTicketNumber() {
    const current = this.get("ticket:seq", 0) + 1;
    this.set("ticket:seq", current);
    return current;
  }

  createTicket(data) {
    const info = this.stmts.createTicket.run({
      ...data,
      created_at: Date.now(),
    });
    return this.stmts.getById.get(info.lastInsertRowid);
  }

  getTicketByChannel(channelId) {
    return this.stmts.getByChannel.get(channelId) || null;
  }

  getTicketById(id) {
    return this.stmts.getById.get(id) || null;
  }

  getOpenTicketsByOwner(ownerId) {
    return this.stmts.openByOwner.all(ownerId);
  }

  getTicketStats() {
    const row = this.stmts.stats.get();
    return {
      open: row.open_count || 0,
      total: row.total_count || 0,
      average: row.avg_rating ? Number(row.avg_rating) : 0,
      ratings: row.rating_count || 0,
    };
  }

  getOwnerStats(ownerId) {
    const row = this.stmts.ownerStats.get(ownerId);
    return {
      total: row.total_count || 0,
      open: row.open_count || 0,
      average: row.avg_rating ? Number(row.avg_rating) : 0,
    };
  }

  claimTicket(id, userId) {
    this.stmts.claim.run(userId, id);
    return this.getTicketById(id);
  }

  setVoiceChannel(id, channelId) {
    this.stmts.setVoice.run(channelId, id);
  }

  closeTicket(id, closedBy, rating = null) {
    this.stmts.close.run(Date.now(), closedBy, rating, id);
    return this.getTicketById(id);
  }

  rateTicket(id, rating) {
    this.stmts.rate.run(rating, id);
  }
}

module.exports = new Store();
