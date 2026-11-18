const { Events } = require("discord.js");
const config = require("../config");
const { sendLog, baseEmbed, auditExecutor, AuditLogEvent } = require("../services/logService");

function clip(value) {
  const text = value || "*boş*";
  return text.length > 1000 ? `${text.slice(0, 997)}...` : text;
}

module.exports = {
  name: Events.MessageDelete,
  async execute(message) {
    if (!message.guild || message.author?.bot) return;
    const executor = await auditExecutor(message.guild, AuditLogEvent.MessageDelete, message.author?.id);
    await sendLog(message.guild, "genel_log", {
      embeds: [
        baseEmbed("🗑️ Mesaj silindi", config.colors.danger).addFields(
          { name: "Kanal", value: `${message.channel}`, inline: true },
          { name: "Yazan", value: message.author ? `${message.author}` : "bilinmiyor", inline: true },
          { name: "Silen", value: executor ? `${executor}` : "bilinmiyor", inline: true },
          { name: "İçerik", value: clip(message.content) },
        ),
      ],
    });
  },
};
