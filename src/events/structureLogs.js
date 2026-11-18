const { Events, AuditLogEvent, ChannelType } = require("discord.js");
const config = require("../config");
const { sendLog, baseEmbed, auditExecutor } = require("../services/logService");

function getChannelType(channel) {
  if (channel.type === ChannelType.GuildVoice) return "ses";
  if (channel.type === ChannelType.GuildCategory) return "kategori";
  return "metin";
}

module.exports = {
  name: "structureLogs",
  once: false,
  async execute(client) {
    // Bot açıldığında bu event dosyası yüklenir ve alt eventler client'a bağlanır
    client.on(Events.ChannelCreate, async (channel) => {
      if (!channel.guild) return;
      try {
        const executor = await auditExecutor(channel.guild, AuditLogEvent.ChannelCreate, channel.id);
        await sendLog(channel.guild, "genel_log", {
          embeds: [baseEmbed("📁 Kanal oluşturuldu", config.colors.success).setDescription(`${channel} (${getChannelType(channel)})\nYetkili: ${executor || "bilinmiyor"}`)],
        });
      } catch (err) {
        console.error("ChannelCreate log hatası:", err);
      }
    });

    client.on(Events.ChannelDelete, async (channel) => {
      if (!channel.guild) return;
      try {
        const executor = await auditExecutor(channel.guild, AuditLogEvent.ChannelDelete, channel.id);
        await sendLog(channel.guild, "genel_log", {
          embeds: [baseEmbed("🗂️ Kanal silindi", config.colors.danger).setDescription(`\`${channel.name}\` (${getChannelType(channel)})\nYetkili: ${executor || "bilinmiyor"}`)],
        });
      } catch (err) {
        console.error("ChannelDelete log hatası:", err);
      }
    });

    client.on(Events.RoleCreate, async (role) => {
      if (!role.guild) return;
      try {
        const executor = await auditExecutor(role.guild, AuditLogEvent.RoleCreate, role.id);
        await sendLog(role.guild, "genel_log", {
          embeds: [baseEmbed("🎭 Rol oluşturuldu", config.colors.success).setDescription(`${role}\nYetkili: ${executor || "bilinmiyor"}`)],
        });
      } catch (err) {
        console.error("RoleCreate log hatası:", err);
      }
    });

    client.on(Events.RoleDelete, async (role) => {
      if (!role.guild) return;
      try {
        const executor = await auditExecutor(role.guild, AuditLogEvent.RoleDelete, role.id);
        await sendLog(role.guild, "genel_log", {
          embeds: [baseEmbed("🎭 Rol silindi", config.colors.danger).setDescription(`\`${role.name}\`\nYetkili: ${executor || "bilinmiyor"}`)],
        });
      } catch (err) {
        console.error("RoleDelete log hatası:", err);
      }
    });
  },
};
