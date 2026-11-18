const { Events, ActivityType } = require("discord.js");
const log = require("../utils/logger");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    log.info(`${client.user.tag} olarak giriş yapıldı.`);
    client.user.setPresence({
      activities: [{ name: "Minecraft destek", type: ActivityType.Watching }],
      status: "online",
    });
  },
};
