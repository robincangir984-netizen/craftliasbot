const { ChannelType, PermissionFlagsBits, OverwriteType } = require("discord.js");
const { ADMIN_AND_ABOVE, DEV_KEYS, TICKET_STAFF, FULL_TICKET_STAFF } = require("../structure/roles");
const layout = require("../structure/channels");
const db = require("../database/Database");
const { clearGuild } = require("./setupClear");
const { allow, deny, roleAllows, cloneOverwrites } = require("./setupHelpers");
const { createRoles, makeCategory, makeChild, addText } = require("./channelFactory");

async function setupGuild(guild) {
  await clearGuild(guild);
  await guild.channels.fetch().catch(() => null);
  await guild.roles.fetch().catch(() => null);

  const roles = await createRoles(guild);
  const everyone = guild.roles.everyone.id;
  const ids = {};
  const read = [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory];
  const write = read.concat([PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks]);
  const voicePerms = [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak, PermissionFlagsBits.Stream];

  const info = await makeCategory(guild, "📢 BİLGİLENDİRME & DUYURU", [
    allow(everyone, read),
    deny(everyone, [PermissionFlagsBits.SendMessages, PermissionFlagsBits.CreatePublicThreads]),
    ...roleAllows(roles, ADMIN_AND_ABOVE, write.concat(PermissionFlagsBits.ManageMessages)),
  ]);
  ids.kategori_bilgi = info.id;
  await addText(guild, info, layout.INFO_TEXT, ids, cloneOverwrites(info));

  const community = await makeCategory(guild, "💬 TOPLULUK ALANI", [
    deny(everyone, [PermissionFlagsBits.ViewChannel]),
    allow(roles.halk, write),
  ]);
  ids.kategori_topluluk = community.id;
  await addText(guild, community, layout.COMMUNITY_TEXT, ids);

  const support = await makeCategory(guild, "🎫 DESTEK MERKEZİ", [
    deny(everyone, [PermissionFlagsBits.ViewChannel]),
    allow(roles.halk, read),
    deny(roles.halk, [PermissionFlagsBits.SendMessages]),
    ...roleAllows(roles, TICKET_STAFF, write.concat(PermissionFlagsBits.ManageMessages)),
  ]);
  ids.kategori_destek = support.id;
  const panel = await makeChild(guild, support, {
    name: "📩・destek-oluştur",
    topic: "Destek paneli",
  }, ChannelType.GuildText, cloneOverwrites(support));
  ids.destek_olustur = panel.id;

  const voices = await makeCategory(guild, "🔊 SES KANALLARI (TOPLULUK)", [
    deny(everyone, [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect]),
    allow(roles.halk, voicePerms),
  ]);
  ids.kategori_ses = voices.id;
  for (const spec of layout.COMMUNITY_VOICE) {
    const channel = await makeChild(guild, voices, spec, ChannelType.GuildVoice);
    if (spec.key === "afk") await guild.setAFKChannel(channel).catch(() => null);
    ids[spec.key] = channel.id;
  }

  ids.kategori_yetkili = await buildStaff(guild, roles, ids, everyone, write, voicePerms);
  ids.kategori_log = await buildLogs(guild, roles, ids, everyone, read);
  db.saveStructure(guild.id, roles, ids);
  return { roles, channels: ids };
}

async function buildStaff(guild, roles, ids, everyone, write, voicePerms) {
  const staff = await makeCategory(guild, "🛡️ YETKİLİ ALANI", [
    deny(everyone, [PermissionFlagsBits.ViewChannel]),
    allow(roles.yetkili_kadrosu, write.concat(PermissionFlagsBits.Connect, PermissionFlagsBits.Speak)),
  ]);
  await addText(guild, staff, layout.STAFF_TEXT, ids);
  await addText(guild, staff, layout.DEV_TEXT, ids, [
    deny(everyone, [PermissionFlagsBits.ViewChannel]),
    deny(roles.yetkili_kadrosu, [PermissionFlagsBits.ViewChannel]),
    ...roleAllows(roles, DEV_KEYS, write.concat(PermissionFlagsBits.Connect, PermissionFlagsBits.Speak)),
  ]);
  for (const spec of layout.STAFF_VOICE) {
    const channel = await makeChild(guild, staff, spec, ChannelType.GuildVoice, voiceOverwrites(spec, roles, everyone, voicePerms));
    ids[spec.key] = channel.id;
  }
  return staff.id;
}

function voiceOverwrites(spec, roles, everyone, voicePerms) {
  if (spec.key === "mulakat_bekleme") {
    return [
      deny(everyone, [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect]),
      allow(roles.mulakat_bekleme, voicePerms),
      allow(roles.yetkili_kadrosu, voicePerms.concat(PermissionFlagsBits.MoveMembers)),
    ];
  }
  if (spec.key === "mulakat") {
    return [
      deny(everyone, [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect]),
      allow(roles.yetkili_kadrosu, voicePerms.concat(PermissionFlagsBits.MoveMembers)),
    ];
  }
  return undefined;
}

async function buildLogs(guild, roles, ids, everyone, read) {
  const logs = await makeCategory(guild, "📊 DENETİM & LOG KAYITLARI", [
    deny(everyone, [PermissionFlagsBits.ViewChannel]),
    ...roleAllows(roles, ADMIN_AND_ABOVE, read.concat(PermissionFlagsBits.SendMessages)),
  ]);
  await addText(guild, logs, layout.LOG_TEXT, ids);
  return logs.id;
}

function ticketStaffOverwrites(guild, ownerId) {
  const roles = db.getRoles(guild.id);
  const memberPerms = [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.AttachFiles,
    PermissionFlagsBits.EmbedLinks,
  ];
  const overwrites = [
    deny(guild.roles.everyone.id, [PermissionFlagsBits.ViewChannel]),
    allow(ownerId, memberPerms, OverwriteType.Member),
    ...roleAllows(roles, FULL_TICKET_STAFF, memberPerms.concat(PermissionFlagsBits.ManageMessages)),
  ];
  if (roles.deneme_bilgili) {
    overwrites.push(allow(roles.deneme_bilgili, [
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.ReadMessageHistory,
      PermissionFlagsBits.SendMessages,
    ]));
  }
  return overwrites;
}

module.exports = { setupGuild, ticketStaffOverwrites };
