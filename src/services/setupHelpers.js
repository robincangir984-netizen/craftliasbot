const { OverwriteType } = require("discord.js");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function allow(id, permissions, type = OverwriteType.Role) {
  return { id, type, allow: permissions, deny: [] };
}

function deny(id, permissions, type = OverwriteType.Role) {
  return { id, type, allow: [], deny: permissions };
}

function roleAllows(roleMap, keys, permissions) {
  return keys.filter((key) => roleMap[key]).map((key) => allow(roleMap[key], permissions));
}

function cloneOverwrites(channel) {
  return channel.permissionOverwrites.cache.map((overwrite) => ({
    id: overwrite.id,
    type: overwrite.type,
    allow: overwrite.allow.bitfield,
    deny: overwrite.deny.bitfield,
  }));
}

module.exports = { sleep, allow, deny, roleAllows, cloneOverwrites };
