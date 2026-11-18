const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require("../config");
const { setupGuild } = require("../services/setupService");
const { safeReply, safeDefer } = require("../utils/safe");
const { botCan } = require("../utils/permissions");
const log = require("../utils/logger");

async function handleSetup(interaction) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    return safeReply(interaction, { content: "Bu işlemi yalnızca yöneticiler kullanabilir.", ephemeral: true });
  }
  if (interaction.customId === "setup:cancel") {
    return interaction.update({
      embeds: [new EmbedBuilder().setColor(config.colors.warning).setTitle("Kurulum iptal edildi").setDescription("Sunucuda hiçbir değişiklik yapılmadı.")],
      components: [],
    });
  }

  const needed = [PermissionFlagsBits.Administrator, PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageChannels];
  if (!botCan(interaction.guild, needed)) {
    return safeReply(interaction, { content: "Botun Yönetici, Rol Yönetimi ve Kanal Yönetimi izinleri olmalı. Rolü diğer rollerin üstünde olmalı.", ephemeral: true });
  }
  if (!(await safeDefer(interaction, true))) return;

  try {
    const result = await setupGuild(interaction.guild);
    return safeReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setColor(config.colors.success)
          .setTitle("Sunucu kuruldu")
          .setDescription(`${Object.keys(result.roles).length} rol ve ${Object.keys(result.channels).length} kanal kaydı veritabanına yazıldı. Destek paneli için \`/destek-kur\` kullan.`),
      ],
    });
  } catch (error) {
    log.error("Kurulum hatası:", error);
    return safeReply(interaction, { content: `Kurulum tamamlanamadı: ${error.message}`, ephemeral: true });
  }
}

module.exports = { handleSetup };
