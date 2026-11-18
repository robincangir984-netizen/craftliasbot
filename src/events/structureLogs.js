const { Events, AuditLogEvent, ChannelType } = require("discord.js");
const config = require("../config");
const { sendLog, baseEmbed, auditExecutor } = require("../services/logService");

function getChannelType(channel) {
  if (channel.type === ChannelType.GuildVoice) return "ses";
  if (channel.type === ChannelType.GuildCategory) return "kategori";
  return "metin";
}

module.exports = [
  {
    name: Events.ChannelCreate,
    async execute(channel) {
      if (!channel.guild) return;
      const executor = await auditExecutor(channel.guild, AuditLogEvent.ChannelCreate, channel.id);
      await sendLog(channel.guild, "genel_log", {
        embeds: [baseEmbed("📁 Kanal oluşturuldu", config.colors.success).setDescription(`${channel} (${getChannelType(channel)})\nYetkili: ${executor || "bilinmiyor"}`)],
      });
    },
  },
  {
    name: Events.ChannelDelete,
    async execute(channel) {
      if (!channel.guild) return;
      const executor = await auditExecutor(channel.guild, AuditLogEvent.ChannelDelete, channel.id);
      await sendLog(channel.guild, "genel_log", {
        embeds: [baseEmbed("🗂️ Kanal silindi", config.colors.danger).setDescription(`\`${channel.name}\` (${getChannelType(channel)})\nYetkili: ${executor || "bilinmiyor"}`)],
      });
    },
  },
  {
    name: Events.RoleCreate,
    async execute(role) {
      if (!role.guild) return;
      const executor = await auditExecutor(role.guild, AuditLogEvent.RoleCreate, role.id);
      await sendLog(role.guild, "genel_log", {
        embeds: [baseEmbed("🎭 Rol oluşturuldu", config.colors.success).setDescription(`${role}\nYetkili: ${executor || "bilinmiyor"}`)],
      });
    },
  },
  {
    name: Events.RoleDelete,
    async execute(role) {
      if (!role.guild) return;
      const executor = await auditExecutor(role.guild, AuditLogEvent.RoleDelete, role.id);
      await sendLog(role.guild, "genel_log", {
        embeds: [baseEmbed("🎭 Rol silindi", config.colors.danger).setDescription(`\`${role.name}\`\nYetkili: ${executor || "bilinmiyor"}`)],
      });
    },
  },
];
