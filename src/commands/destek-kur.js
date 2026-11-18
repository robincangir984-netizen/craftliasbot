const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { panelPayload } = require("../services/panelService");
const db = require("../database/Database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("destek-kur")
    .setDescription("Seçilen kanala destek panelini gönderir.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addChannelOption((option) => option
      .setName("kanal")
      .setDescription("Panelin gönderileceği metin kanalı")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true)),

  async execute(interaction) {
    const channel = interaction.options.getChannel("kanal", true);
    const message = await channel.send(panelPayload());
    db.set("panel:channel", channel.id);
    db.set("panel:message", message.id);
    await interaction.reply({ content: `Destek paneli ${channel} kanalına gönderildi.`, ephemeral: true });
  },
};
