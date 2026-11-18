const { ChannelType, EmbedBuilder } = require("discord.js");
const config = require("../config");
const db = require("../database/Database");
const { isStaff, isFullTicketStaff } = require("../utils/permissions");
const { safeReply } = require("../utils/safe");
const { buildTicketCard } = require("../services/cardService");
const { closeTicket } = require("../services/ticketService");
const { controlRows, ticketEmbed } = require("../services/ticketUi");
const { refreshPanels } = require("../services/panelService");
const { sendLog, baseEmbed } = require("../services/logService");
const advanced = require("./ticketAdvanced");

async function profile(interaction, ticket) {
  const member = await interaction.guild.members.fetch(ticket.owner_id);
  const category = config.ticketCategories[ticket.category];
  const card = await buildTicketCard({ member, ticket, stats: db.getOwnerStats(ticket.owner_id), category });
  return safeReply(interaction, { files: [card], ephemeral: true });
}

async function notifyOwner(interaction, ticket) {
  if (!isStaff(interaction.member)) return safeReply(interaction, { content: "Bu buton yalnızca yetkililer içindir.", ephemeral: true });
  const member = await interaction.guild.members.fetch(ticket.owner_id).catch(() => null);
  if (!member) return safeReply(interaction, { content: "Talep sahibi bulunamadı.", ephemeral: true });
  const sent = await member.send({
    embeds: [baseEmbed("Destek bildirimi", config.colors.warning).setDescription(`${interaction.user} talebine yanıt bekliyor: ${interaction.channel}`)],
  }).catch(() => null);
  return safeReply(interaction, { content: sent ? "Bildirim gönderildi." : "Kullanıcının özel mesajları kapalı.", ephemeral: true });
}

async function createVoice(interaction, ticket) {
  if (!isFullTicketStaff(interaction.member)) {
    return safeReply(interaction, { content: "Ses kanalı oluşturmak için tam ticket yetkisi gerekir.", ephemeral: true });
  }
  if (ticket.voice_channel_id && interaction.guild.channels.cache.has(ticket.voice_channel_id)) {
    return safeReply(interaction, { content: `Ses kanalı zaten var: <#${ticket.voice_channel_id}>`, ephemeral: true });
  }
  const voice = await interaction.guild.channels.create({
    name: `🎫・ticket-${String(ticket.id).padStart(4, "0")}`,
    type: ChannelType.GuildVoice,
    parent: db.getChannels(interaction.guild.id).kategori_destek,
    userLimit: 5,
    permissionOverwrites: interaction.channel.permissionOverwrites.cache.map((overwrite) => ({
      id: overwrite.id,
      type: overwrite.type,
      allow: overwrite.allow.bitfield,
      deny: overwrite.deny.bitfield,
    })),
  });
  db.setVoiceChannel(ticket.id, voice.id);
  return interaction.reply({ content: `Ses kanalı oluşturuldu: ${voice}` });
}

async function claim(interaction, ticket) {
  if (!isStaff(interaction.member)) return safeReply(interaction, { content: "Talebi yalnızca yetkililer alabilir.", ephemeral: true });
  const updated = db.claimTicket(ticket.id, interaction.user.id);
  const member = await interaction.guild.members.fetch(ticket.owner_id);
  const category = config.ticketCategories[ticket.category];
  await interaction.message.edit({ embeds: [ticketEmbed(updated, member, category)], components: controlRows(updated) }).catch(() => null);
  await sendLog(interaction.guild, "destek_log", {
    embeds: [baseEmbed("➡️ Ticket üstlenildi").addFields(
      { name: "Ticket", value: `#${ticket.id}`, inline: true },
      { name: "Yetkili", value: `${interaction.user}`, inline: true },
    )],
  });
  return interaction.reply({ content: `${interaction.user} talebi üstlendi.` });
}

async function rate(interaction) {
  const ticket = db.getTicketById(Number(interaction.customId.split(":")[2]));
  if (!ticket || ticket.owner_id !== interaction.user.id) {
    return safeReply(interaction, { content: "Bu puanlamayı yalnızca talep sahibi yapabilir.", ephemeral: true });
  }
  const rating = Number(interaction.values[0]);
  db.rateTicket(ticket.id, rating);
  const guild = await interaction.client.guilds.fetch(ticket.guild_id);
  await sendLog(guild, "destek_log", {
    embeds: [baseEmbed("⭐ Ticket puanlandı", config.colors.warning).addFields(
      { name: "Ticket", value: `#${ticket.id}`, inline: true },
      { name: "Puan", value: `${rating}/5`, inline: true },
      { name: "Kullanıcı", value: `${interaction.user}`, inline: true },
    )],
  });
  await refreshPanels(interaction.client);
  return interaction.update({ content: `Teşekkürler, ${rating}/5 puanın kaydedildi.`, components: [], embeds: [] });
}

async function handleTicketButton(interaction) {
  const action = interaction.customId.split(":")[1];
  const id = interaction.customId.split(":")[2];
  if (action === "adduser") return advanced.addUserPrompt(interaction);
  if (action === "rename") return advanced.renamePrompt(interaction);

  const ticket = db.getTicketById(Number(id));
  if (!ticket || ticket.status !== "open") return safeReply(interaction, { content: "Bu talep artık açık değil.", ephemeral: true });
  if (action === "profile") return profile(interaction, ticket);
  if (action === "notify") return notifyOwner(interaction, ticket);
  if (action === "voice") return createVoice(interaction, ticket);
  if (action === "claim") return claim(interaction, ticket);
  if (action === "advanced") return advanced.showAdvanced(interaction, ticket);
  if (action === "priority") return advanced.priority(interaction, ticket);
  if (action === "close") {
    await interaction.reply({ embeds: [new EmbedBuilder().setColor(config.colors.danger).setDescription("Talep kapatılıyor, kayıt alınıyor...")], ephemeral: true });
    return closeTicket(interaction, ticket);
  }
  return null;
}

module.exports = { handleTicketButton, rate };
