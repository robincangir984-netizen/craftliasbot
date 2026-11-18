const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const config = require("../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sunucu-kur")
    .setDescription("Rolleri, kategorileri ve kanalları sıfırlayıp sunucu mimarisini kurar.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("setup:confirm").setLabel("Evet, Sunucuyu Sıfırla ve Kur").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("setup:cancel").setLabel("İptal").setStyle(ButtonStyle.Secondary),
    );
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(config.colors.danger)
          .setTitle("Sunucu kurulumu")
          .setDescription("Onaylarsan botun silebildiği mevcut kanallar ve roller silinir. Ardından rol hiyerarşisi, kategoriler, kanallar ve izinler yeniden oluşturulur. Bu işlem geri alınamaz."),
      ],
      components: [row],
      ephemeral: true,
    });
  },
};
