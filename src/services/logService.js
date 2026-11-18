const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const db = require("../database/Database");
const config = require("../config");

async function sendLog(guild, key, payload) {
  const channelId = db.getChannels(guild.id)[key];
  if (!channelId) return null;
  const channel = guild.channels.cache.get(channelId) || (await guild.channels.fetch(channelId).catch(() => null));
  if (!channel?.isTextBased()) return null;
  return channel.send(payload).catch(() => null);
}

function baseEmbed(title, color = config.colors.info) {
  return new EmbedBuilder().setColor(color).setTitle(title).setTimestamp();
}

async function auditExecutor(guild, type, targetId) {
  const logs = await guild.fetchAuditLogs({ type, limit: 5 }).catch(() => null);
  const entry = logs?.entries.find((item) => item.target?.id === targetId && Date.now() - item.createdTimestamp < 15000);
  return entry?.executor || null;
}

module.exports = { sendLog, baseEmbed, auditExecutor, AuditLogEvent };
