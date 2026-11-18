const fs = require("node:fs");
const path = require("node:path");

function registerEvent(client, event) {
  const runner = (...args) => event.execute(...args, client);
  if (event.once) client.once(event.name, runner);
  else client.on(event.name, runner);
}

function loadEvents(client) {
  const dir = path.join(__dirname, "..", "events");
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".js"))) {
    const loaded = require(path.join(dir, file));
    const events = Array.isArray(loaded) ? loaded : [loaded];
    for (const event of events) {
      if (!event.name || typeof event.execute !== "function") {
        throw new Error(`Geçersiz olay dosyası: ${file}`);
      }
      registerEvent(client, event);
    }
  }
}

module.exports = { loadEvents };
