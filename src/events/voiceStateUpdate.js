const { Events } = require("discord.js");
const config = require("../config");
const { sendLog, baseEmbed } = require("../services/logService");

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(before, after) {
    if (before.channelId === after.channelId) return;
    let title = "🔊 Ses kanalı değiştirildi";
    let description = `${after.member} ${before.channel || "yok"} → ${after.channel || "yok"}`;
    if (!before.channelId && after.channelId) {
      title = "🔊 Sese katıldı";
      description = `${after.member} ${after.channel} kanalına katıldı.`;
    } else if (before.channelId && !after.channelId) {
      title = "🔇 Sesten ayrıldı";
      description = `${before.member} ${before.channel} kanalından ayrıldı.`;
    }
    await sendLog(after.guild, "ses_log", {
      embeds: [baseEmbed(title, config.colors.info).setDescription(description)],
    });
  },
};
