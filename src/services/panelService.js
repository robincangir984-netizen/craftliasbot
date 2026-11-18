const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const config = require("../config");
const db = require("../database/Database");

function disabledStat(id, label) {
  return new ButtonBuilder().setCustomId(id).setLabel(label).setStyle(ButtonStyle.Secondary).setDisabled(true);
}

function panelPayload() {
  const stats = db.getTicketStats();
  const average = stats.ratings ? stats.average.toFixed(1) : "0.0";
  const embed = new EmbedBuilder()
    .setColor(config.colors.brand)
    .setTitle("Destek Merkezi / Help Center")
    .setDescription("Aşağıdaki menüden talep türünü seçerek yeni bir talep oluşturabilirsin. Sana en uygun olanı seç. Ayrıntıları bir sonraki ekranda ekleyebilirsin.")
    .setImage(config.bannerUrl)
    .setFooter({ text: "Sunucu Destek Sistemi • yetkililer bu kanaldan yanıtlar" });

  const categories = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("ticket:open:order").setLabel("Özel Sipariş").setEmoji("🛒").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("ticket:open:support").setLabel("Genel Destek").setEmoji("🛠️").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("ticket:open:partner").setLabel("İş Birliği").setEmoji("💠").setStyle(ButtonStyle.Secondary),
  );
  const live = new ActionRowBuilder().addComponents(
    disabledStat("ticket:stats:count", `🎫 Açık ${stats.open} / ${stats.total} toplam`),
    disabledStat("ticket:stats:rating", `⭐ ${average} / 5 • ${stats.ratings} puan`),
  );
  return { embeds: [embed], components: [categories, live] };
}

async function refreshPanels(client) {
  const channelId = db.get("panel:channel");
  const messageId = db.get("panel:message");
  if (!channelId || !messageId) return;
  const channel = await client.channels.fetch(channelId).catch(() => null);
  const message = await channel?.messages.fetch(messageId).catch(() => null);
  if (message) await message.edit(panelPayload()).catch(() => null);
}

module.exports = { panelPayload, refreshPanels };
