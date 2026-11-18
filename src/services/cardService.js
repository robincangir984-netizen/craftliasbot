const { AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { formatDuration } = require("../utils/safe");

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function drawStat(ctx, x, label, value) {
  ctx.fillStyle = "#949ba4";
  ctx.font = "18px sans-serif";
  ctx.fillText(label, x, 248);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText(String(value), x, 282);
}

async function buildTicketCard({ member, ticket, stats, category }) {
  const canvas = createCanvas(980, 340);
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 980, 340);
  gradient.addColorStop(0, "#1e1f22");
  gradient.addColorStop(1, "#2b2d31");
  ctx.fillStyle = gradient;
  roundRect(ctx, 0, 0, 980, 340, 28);
  ctx.fill();

  ctx.fillStyle = "#5865f2";
  roundRect(ctx, 0, 0, 14, 340, 0);
  ctx.fill();

  const avatar = await loadImage(member.displayAvatarURL({ extension: "png", size: 256 }));
  ctx.save();
  ctx.beginPath();
  ctx.arc(110, 120, 68, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 42, 52, 136, 136);
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px sans-serif";
  ctx.fillText(member.displayName.slice(0, 28), 210, 95);
  ctx.fillStyle = "#b5bac1";
  ctx.font = "22px sans-serif";
  ctx.fillText(`@${member.user.username}  •  #${String(ticket.id).padStart(4, "0")}`, 210, 132);
  ctx.fillStyle = "#5865f2";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText(`${category.emoji} ${category.label}`, 210, 172);

  const accountAge = formatDuration(Date.now() - member.user.createdTimestamp);
  const memberAge = member.joinedTimestamp ? formatDuration(Date.now() - member.joinedTimestamp) : "bilinmiyor";
  drawStat(ctx, 48, "HESAP YAŞI", accountAge);
  drawStat(ctx, 290, "SUNUCUDA", memberAge);
  drawStat(ctx, 530, "TICKET", `${stats.total} toplam`);
  drawStat(ctx, 760, "PUAN ORT.", stats.average ? stats.average.toFixed(1) : "-");

  return new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "ticket-card.png" });
}

module.exports = { buildTicketCard };
