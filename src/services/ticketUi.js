const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
} = require("discord.js");
const config = require("../config");

function ticketModal(categoryKey) {
  const category = config.ticketCategories[categoryKey];
  return new ModalBuilder()
    .setCustomId(`ticket:modal:${categoryKey}`)
    .setTitle(`${category.emoji} ${category.label}`)
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("subject")
          .setLabel("Konu Başlığı")
          .setStyle(TextInputStyle.Short)
          .setMinLength(3)
          .setMaxLength(80)
          .setRequired(true),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("description")
          .setLabel("Detaylı Açıklama")
          .setStyle(TextInputStyle.Paragraph)
          .setMinLength(10)
          .setMaxLength(1000)
          .setRequired(true),
      ),
    );
}

function controlRows(ticket) {
  const claimed = Boolean(ticket.claimed_by);
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`ticket:profile:${ticket.id}`).setLabel("Profil").setEmoji("👤").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`ticket:notify:${ticket.id}`).setLabel("Bildirim Gönder").setEmoji("🔔").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`ticket:voice:${ticket.id}`).setLabel("Ses kanalı oluştur").setEmoji("📞").setStyle(ButtonStyle.Secondary),
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`ticket:claim:${ticket.id}`).setLabel(claimed ? "Talebi üstlenildi" : "Talebi al").setEmoji("➡️").setStyle(ButtonStyle.Primary).setDisabled(claimed),
      new ButtonBuilder().setCustomId(`ticket:close:${ticket.id}`).setLabel("Talebi kapat").setEmoji("🔴").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`ticket:advanced:${ticket.id}`).setLabel("Gelişmiş").setEmoji("⚙️").setStyle(ButtonStyle.Secondary),
    ),
  ];
}

function ticketEmbed(ticket, member, category) {
  return new EmbedBuilder()
    .setColor(config.colors.brand)
    .setTitle(`${category.emoji} ${category.label} • #${String(ticket.id).padStart(4, "0")}`)
    .setDescription(ticket.description)
    .addFields(
      { name: "Konu", value: ticket.subject, inline: false },
      { name: "Talep sahibi", value: `${member}`, inline: true },
      { name: "Durum", value: ticket.claimed_by ? `<@${ticket.claimed_by}> üstlendi` : "Bekliyor", inline: true },
    )
    .setImage("attachment://ticket-card.png")
    .setFooter({ text: "Destek talebi • yetkililer bu kanaldan yanıtlar" })
    .setTimestamp(ticket.created_at);
}

function ratingRow(ticketId) {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`ticket:rate:${ticketId}`)
      .setPlaceholder("Destek deneyimini 1-5 yıldız puanla")
      .addOptions([1, 2, 3, 4, 5].map((value) => ({
        label: `${value} yıldız`,
        value: String(value),
        emoji: "⭐",
      }))),
  );
}

function advancedRow(ticketId) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`ticket:adduser:${ticketId}`).setLabel("Üye ekle").setEmoji("➕").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(`ticket:rename:${ticketId}`).setLabel("Yeniden adlandır").setEmoji("✏️").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(`ticket:priority:${ticketId}`).setLabel("Öncelik bildir").setEmoji("🚨").setStyle(ButtonStyle.Danger),
  );
}

module.exports = { ticketModal, controlRows, ticketEmbed, ratingRow, advancedRow };
