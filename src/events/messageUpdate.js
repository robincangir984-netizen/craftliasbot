const { Events } = require("discord.js");
const config = require("../config");
const { sendLog, baseEmbed } = require("../services/logService");

function clip(value) {
  const text = value || "*boş*";
  return text.length > 1000 ? `${text.slice(0, 997)}...` : text;
}

module.exports = {
  name: Events.MessageUpdate,
  async execute(before, after) {
    if (!after.guild || after.author?.bot || before.content === after.content) return;
    await sendLog(after.guild, "genel_log", {
      embeds: [
        baseEmbed("✏️ Mesaj düzenlendi", config.colors.warning)
          .addFields(
            { name: "Kanal", value: `${after.channel}`, inline: true },
            { name: "Yazan", value: `${after.author}`, inline: true },
            { name: "Önce", value: clip(before.content) },
            { name: "Sonra", value: clip(after.content) },
          ),
      ],
    });
  },
};
