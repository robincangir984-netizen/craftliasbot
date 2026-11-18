const { Events } = require("discord.js");
const db = require("../database/Database");
const config = require("../config");
const { sendLog, baseEmbed } = require("../services/logService");
const log = require("../utils/logger");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    if (member.user.bot) return;
    const roleId = db.getRoles(member.guild.id).halk;
    if (roleId) {
      await member.roles.add(roleId, "Otomatik üye rolü").catch((error) => {
        log.warn(`Halk rolü verilemedi (${member.id}): ${error.message}`);
      });
    }
    const created = `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`;
    await sendLog(member.guild, "genel_log", {
      embeds: [
        baseEmbed("📥 Üye katıldı", config.colors.success)
          .setThumbnail(member.displayAvatarURL({ size: 256 }))
          .addFields(
            { name: "Üye", value: `${member} (\`${member.id}\`)`, inline: false },
            { name: "Hesap", value: created, inline: true },
            { name: "Üye sayısı", value: `${member.guild.memberCount}`, inline: true },
          ),
      ],
    });
  },
};
