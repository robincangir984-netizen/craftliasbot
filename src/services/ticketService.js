const fs = require("node:fs");
const path = require("node:path");
const { ChannelType, AttachmentBuilder } = require("discord.js");
const discordTranscripts = require("discord-html-transcripts");
const config = require("../config");
const db = require("../database/Database");
const { slugName } = require("../utils/safe");
const { ticketStaffOverwrites } = require("./setupService");
const { buildTicketCard } = require("./cardService");
const { ticketEmbed, controlRows, ratingRow } = require("./ticketUi");
const { sendLog, baseEmbed } = require("./logService");
const { refreshPanels } = require("./panelService");

const transcriptDir = path.join(__dirname, "..", "..", "data", "transcripts");

async function openTicket(interaction, categoryKey) {
  const category = config.ticketCategories[categoryKey];
  const guild = interaction.guild;
  const parentId = db.getChannels(guild.id).kategori_destek;
  if (!parentId) throw new Error("Destek kategorisi bulunamadı. Önce /sunucu-kur çalıştır.");

  const open = db.getOpenTicketsByOwner(interaction.user.id);
  if (open.length >= 2) throw new Error("Aynı anda en fazla 2 açık talebin olabilir.");

  const number = db.nextTicketNumber();
  const name = `${category.prefix}-${slugName(interaction.user.username)}-${String(number).padStart(4, "0")}`;
  const channel = await guild.channels.create({
    name,
    type: ChannelType.GuildText,
    parent: parentId,
    topic: `${category.label} • ${interaction.user.tag}`,
    permissionOverwrites: ticketStaffOverwrites(guild, interaction.user.id),
    reason: `Destek talebi #${number}`,
  });

  const subject = interaction.fields.getTextInputValue("subject").trim();
  const description = interaction.fields.getTextInputValue("description").trim();
  const ticket = db.createTicket({
    guild_id: guild.id,
    channel_id: channel.id,
    owner_id: interaction.user.id,
    category: categoryKey,
    subject,
    description,
  });

  const member = interaction.member;
  const stats = db.getOwnerStats(interaction.user.id);
  const card = await buildTicketCard({ member, ticket, stats, category });
  await channel.send({
    content: `${member} yeni bir talep oluşturdu. Yetkili kadrosu bilgilendirildi.`,
    embeds: [ticketEmbed(ticket, member, category)],
    files: [card],
    components: controlRows(ticket),
  });

  await sendLog(guild, "destek_log", {
    embeds: [
      baseEmbed("🎫 Ticket açıldı", config.colors.success)
        .addFields(
          { name: "Kanal", value: `${channel}`, inline: true },
          { name: "Sahip", value: `${member}`, inline: true },
          { name: "Kategori", value: category.label, inline: true },
          { name: "Konu", value: subject },
        ),
    ],
  });
  await refreshPanels(interaction.client);
  return channel;
}

async function closeTicket(interaction, ticket) {
  const channel = interaction.channel;
  const guild = interaction.guild;
  fs.mkdirSync(transcriptDir, { recursive: true });
  const fileName = `ticket-${ticket.id}.html`;
  const attachment = await discordTranscripts.createTranscript(channel, {
    limit: -1,
    filename: fileName,
    saveImages: true,
    poweredBy: false,
    footerText: "Destek kaydı",
  });
  const filePath = path.join(transcriptDir, fileName);
  if (attachment?.attachment) fs.writeFileSync(filePath, attachment.attachment);

  const closed = db.closeTicket(ticket.id, interaction.user.id);
  await sendLog(guild, "destek_log", {
    embeds: [
      baseEmbed("🔴 Ticket kapatıldı", config.colors.danger)
        .addFields(
          { name: "Ticket", value: `#${String(ticket.id).padStart(4, "0")}`, inline: true },
          { name: "Sahip", value: `<@${ticket.owner_id}>`, inline: true },
          { name: "Kapatan", value: `${interaction.user}`, inline: true },
          { name: "Konu", value: ticket.subject },
        ),
    ],
    files: [new AttachmentBuilder(filePath, { name: fileName })],
  });

  const owner = await guild.members.fetch(ticket.owner_id).catch(() => null);
  if (owner) {
    await owner.send({
      embeds: [baseEmbed("Talebin kapatıldı", config.colors.brand).setDescription(`**${ticket.subject}** başlıklı talebin kapatıldı. Deneyimini puanlayabilirsin.`)],
      components: [ratingRow(closed.id)],
    }).catch(() => null);
  }

  if (ticket.voice_channel_id) {
    const voice = guild.channels.cache.get(ticket.voice_channel_id);
    await voice?.delete("Ticket kapatıldı").catch(() => null);
  }
  await refreshPanels(interaction.client);
  setTimeout(() => channel.delete("Ticket kapatıldı").catch(() => null), 5000);
}

module.exports = { openTicket, closeTicket };
