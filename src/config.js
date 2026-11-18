require("dotenv").config();

const required = ["DISCORD_TOKEN", "CLIENT_ID", "GUILD_ID"];
const missing = required.filter((key) => !process.env[key] || process.env[key].startsWith("buraya_"));

module.exports = {
  token: process.env.DISCORD_TOKEN || "",
  clientId: process.env.CLIENT_ID || "",
  guildId: process.env.GUILD_ID || "",
  bannerUrl: process.env.BANNER_URL || "https://i.imgur.com/8Km9tLL.png",
  missing,
  colors: {
    brand: 0x5865f2,
    success: 0x57f287,
    danger: 0xed4245,
    warning: 0xfee75c,
    info: 0x3498db,
    dark: 0x1e1f22,
  },
  ticketCategories: {
    order: { key: "order", label: "Özel Sipariş", emoji: "🛒", prefix: "siparis" },
    support: { key: "support", label: "Genel Destek", emoji: "🛠️", prefix: "destek" },
    partner: { key: "partner", label: "İş Birliği", emoji: "💠", prefix: "isbirligi" },
  },
};
