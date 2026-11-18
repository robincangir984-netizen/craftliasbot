const {
  ActionRowBuilder,
  UserSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const db = require("../database/Database");
const { isStaff } = require("../utils/permissions");
const { safeReply } = require("../utils/safe");
const { advancedRow } = require("../services/ticketUi");
const { sendLog, baseEmbed } = require("../services/logService");
const config = require("../config");

async function showAdvanced(interaction, ticket) {
  if (!isStaff(interaction.member)) return safeReply(interaction, { content: "Gelişmiş menü yalnızca yetkililer içindir.", ephemeral: true });
  return safeReply(interaction, { content: "Gelişmiş ticket işlemleri:", components: [advancedRow(ticket.id)], ephemeral: true });
}

async function addUserPrompt(interaction) {
  const row = new ActionRowBuilder().addComponents(
    new UserSelectMenuBuilder()
      .setCustomId(`ticket:pickuser:${interaction.customId.split(":")[2]}`)
      .setPlaceholder("Kanala eklenecek üyeyi seç"),
  );
  return safeReply(interaction, { components: [row], ephemeral: true });
}

async function pickUser(interaction) {
  const ticket = db.getTicketById(Number(interaction.customId.split(":")[2]));
  const channel = interaction.guild.channels.cache.get(ticket?.channel_id);
  if (!ticket || !channel || !isStaff(interaction.member)) {
    return safeReply(interaction, { content: "İşlem yapılamadı.", ephemeral: true });
  }
  const user = interaction.users.first();
  await channel.permissionOverwrites.edit(user.id, {
    ViewChannel: true,
    SendMessages: true,
    ReadMessageHistory: true,
    AttachFiles: true,
  });
  await channel.send({ content: `${user} talebe eklendi.` });
  return interaction.update({ content: `${user} eklendi.`, components: [] });
}

async function renamePrompt(interaction) {
  const modal = new ModalBuilder()
    .setCustomId(`ticket:renamemodal:${interaction.customId.split(":")[2]}`)
    .setTitle("Kanalı yeniden adlandır")
    .addComponents(new ActionRowBuilder().addComponents(
      new TextInputBuilder().setCustomId("name").setLabel("Yeni kanal adı").setStyle(TextInputStyle.Short).setMinLength(3).setMaxLength(40).setRequired(true),
    ));
  return interaction.showModal(modal);
}

async function rename(interaction) {
  if (!isStaff(interaction.member)) return safeReply(interaction, { content: "Bu işlem yalnızca yetkililer içindir.", ephemeral: true });
  const name = interaction.fields.getTextInputValue("name").trim().toLowerCase().replace(/\s+/g, "-").slice(0, 80);
  await interaction.channel.setName(name);
  return safeReply(interaction, { content: `Kanal adı \`${name}\` olarak güncellendi.`, ephemeral: true });
}

async function priority(interaction, ticket) {
  if (!isStaff(interaction.member)) return safeReply(interaction, { content: "Bu işlem yalnızca yetkililer içindir.", ephemeral: true });
  await sendLog(interaction.guild, "destek_log", {
    embeds: [baseEmbed("🚨 Öncelikli ticket", config.colors.danger).setDescription(`${interaction.channel} öncelikli olarak işaretlendi.\nSahip: <@${ticket.owner_id}>\nİşaretleyen: ${interaction.user}`)],
  });
  return interaction.reply({ content: "Talep öncelikli olarak destek loguna bildirildi." });
}

module.exports = { showAdvanced, addUserPrompt, pickUser, renamePrompt, rename, priority };
