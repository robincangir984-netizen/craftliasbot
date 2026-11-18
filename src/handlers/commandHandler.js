const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");
const config = require("../config");
const log = require("../utils/logger");

function loadCommands(client) {
  const commands = [];
  const dir = path.join(__dirname, "..", "commands");
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".js"))) {
    const command = require(path.join(dir, file));
    if (!command?.data || typeof command.execute !== "function") {
      throw new Error(`Geçersiz komut dosyası: ${file}`);
    }
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  }
  return commands;
}

async function registerCommands(commands) {
  const rest = new REST({ version: "10" }).setToken(config.token);
  await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands });
  log.info(`${commands.length} slash komut sunucuya kaydedildi.`);
}

module.exports = { loadCommands, registerCommands };
