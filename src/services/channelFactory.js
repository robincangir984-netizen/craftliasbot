const { ChannelType } = require("discord.js");
const { ROLES } = require("../structure/roles");
const { sleep } = require("./setupHelpers");

async function createRoles(guild) {
  const created = {};
  for (const spec of [...ROLES].reverse()) {
    const role = await guild.roles.create({
      name: spec.name,
      colors: { primaryColor: spec.color },
      hoist: spec.hoist,
      permissions: spec.permissions,
      mentionable: false,
      reason: "Otomatik sunucu kurulumu",
    });
    created[spec.key] = role.id;
    await sleep(400);
  }
  return created;
}

async function makeCategory(guild, name, permissionOverwrites) {
  const category = await guild.channels.create({
    name,
    type: ChannelType.GuildCategory,
    permissionOverwrites,
    reason: "Otomatik sunucu kurulumu",
  });
  await sleep(400);
  return category;
}

async function makeChild(guild, parent, spec, type, permissionOverwrites) {
  const channel = await guild.channels.create({
    name: spec.name,
    type,
    parent: parent.id,
    topic: spec.topic,
    userLimit: spec.userLimit || undefined,
    permissionOverwrites,
    reason: "Otomatik sunucu kurulumu",
  });
  await sleep(400);
  return channel;
}

async function addText(guild, parent, specs, ids, overwrites) {
  for (const spec of specs) {
    const channel = await makeChild(guild, parent, spec, ChannelType.GuildText, overwrites);
    ids[spec.key] = channel.id;
  }
}

module.exports = { createRoles, makeCategory, makeChild, addText };
