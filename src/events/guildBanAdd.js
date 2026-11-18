const { Events, AuditLogEvent } = require("discord.js");
const config = require("../config");
const { sendLog, baseEmbed, auditExecutor } = require("../services/logService");

module.exports = {
  name: Events.GuildBanAdd,
  async execute(ban) {
    const executor = await auditExecutor(ban.guild, AuditLogEvent.MemberBanAdd, ban.user.id);
    await sendLog(ban.guild, "genel_log", {
      embeds: [
        baseEmbed("🔨 Üye yasaklandı", config.colors.danger).addFields(
          { name: "Üye", value: `${ban.user.tag} (\`${ban.user.id}\`)` },
          { name: "Yetkili", value: executor ? `${executor}` : "bilinmiyor", inline: true },
          { name: "Sebep", value: ban.reason || "belirtilmedi", inline: true },
        ),
      ],
    });
  },
};
