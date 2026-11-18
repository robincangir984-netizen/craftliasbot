const { Events, AuditLogEvent } = require("discord.js");
const config = require("../config");
const { sendLog, baseEmbed, auditExecutor } = require("../services/logService");

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    const kick = await auditExecutor(member.guild, AuditLogEvent.MemberKick, member.id);
    const title = kick ? "👢 Üye atıldı" : "📤 Üye ayrıldı";
    const embed = baseEmbed(title, kick ? config.colors.danger : config.colors.warning)
      .addFields({ name: "Üye", value: `${member.user?.tag || member.id} (\`${member.id}\`)` });
    if (kick) embed.addFields({ name: "Yetkili", value: `${kick}` });
    await sendLog(member.guild, "genel_log", { embeds: [embed] });
  },
};
