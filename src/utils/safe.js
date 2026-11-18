const { MessageFlags } = require("discord.js");

async function safeReply(interaction, payload) {
  const data = typeof payload === "string" ? { content: payload } : payload;
  if (data.ephemeral) {
    data.flags = (data.flags || 0) | MessageFlags.Ephemeral;
    delete data.ephemeral;
  }
  try {
    if (interaction.deferred || interaction.replied) return await interaction.followUp(data);
    if (interaction.isRepliable()) return await interaction.reply(data);
  } catch (error) {
    if (error?.code === 10062 || error?.code === 40060) return null;
    throw error;
  }
  return null;
}

async function safeDefer(interaction, ephemeral = false) {
  if (interaction.deferred || interaction.replied) return true;
  try {
    await interaction.deferReply(ephemeral ? { flags: MessageFlags.Ephemeral } : undefined);
    return true;
  } catch (error) {
    if (error?.code === 10062) return false;
    throw error;
  }
}

function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms < 0) return "bilinmiyor";
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days > 0) return `${days} gün ${hours} saat`;
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours} saat ${minutes} dk`;
  return `${Math.max(minutes, 1)} dk`;
}

function slugName(value) {
  const map = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "c",
    Ğ: "g",
    İ: "i",
    I: "i",
    Ö: "o",
    Ş: "s",
    Ü: "u",
  };
  const cleaned = String(value)
    .split("")
    .map((char) => map[char] || char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 18);
  return cleaned || "uye";
}

module.exports = { safeReply, safeDefer, formatDuration, slugName };
