require("dotenv").config();

const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
const config = require("./config");
const { loadCommands, registerCommands } = require("./handlers/commandHandler");
const { loadEvents } = require("./handlers/eventHandler");
const { handleTicketButton, rate } = require("./interactions/ticketActions");
const { pickUser, rename } = require("./interactions/ticketAdvanced");
const { closeTicket } = require("./services/ticketService");
const log = require("./utils/logger");

// Express uptime web sunucusu (Render/UptimeRobot ping için)
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("CraftLias Bot Aktif ve Çalışıyor!");
});

app.listen(PORT, () => {
  log.info(`Web sunucusu ${PORT} portunda dinlemede.`);
});

if (config.missing.length > 0) {
  log.error(`Eksik veya geçersiz .env alanları: ${config.missing.join(", ")}`);
  log.error(".env.example dosyasını kopyalayıp .env olarak doldurun.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Map();

client.on("ready", () => {
  require("./events/clientReady").execute(client);
});

client.on("interactionCreate", async (interaction) => {
  require("./events/interactionCreate").execute(interaction);
});

client.on("guildMemberAdd", (member) =>
  require("./events/guildMemberAdd").execute(member)
);

client.on("guildMemberRemove", (member) =>
  require("./events/guildMemberRemove").execute(member)
);

client.on("messageDelete", (message) =>
  require("./events/messageLogs").execute(message)
);

client.on("messageUpdate", (before, after) =>
  require("./events/messageUpdate").execute(before, after)
);

client.on("guildBanAdd", (ban) =>
  require("./events/guildBanAdd").execute(ban)
);

client.on("voiceStateUpdate", (before, after) =>
  require("./events/voiceStateUpdate").execute(before, after)
);

for (const event of require("./events/structureLogs")) {
  const runner = (...args) => event.execute(...args);
  if (event.once) client.once(event.name, runner);
  else client.on(event.name, runner);
}

async function start() {
  loadEvents(client);
  const commands = loadCommands(client);
  await registerCommands(commands);

  await client.login(config.token);
}

start().catch((error) => {
  log.error("Bot başlatılamadı:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  log.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  log.error("Uncaught Exception:", error);
  process.exit(1);
});
