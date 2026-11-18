const log = require("../utils/logger");
const { sleep } = require("./setupHelpers");

async function clearGuild(guild) {
  const botRole = guild.members.me?.roles.highest;
  const channels = [...guild.channels.cache.values()].filter((channel) => channel.deletable);
  for (const channel of channels) {
    await channel.delete("Sunucu kurulumu sıfırlaması").catch((error) => {
      log.warn(`Kanal silinemedi (${channel.name}): ${error.message}`);
    });
    await sleep(350);
  }

  const roles = [...guild.roles.cache.values()]
    .filter((role) => role.id !== guild.id && !role.managed && botRole && role.position < botRole.position)
    .sort((left, right) => left.position - right.position);

  for (const role of roles) {
    await role.delete("Sunucu kurulumu sıfırlaması").catch((error) => {
      log.warn(`Rol silinemedi (${role.name}): ${error.message}`);
    });
    await sleep(350);
  }
}

module.exports = { clearGuild };
