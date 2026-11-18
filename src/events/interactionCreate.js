const { Events, MessageFlags } = require("discord.js");
const { hit } = require("../utils/rateLimit");
const { safeReply } = require("../utils/safe");
const { ticketModal } = require("../services/ticketUi");
const { openTicket } = require("../services/ticketService");
const { handleSetup } = require("../interactions/setup");
const { handleTicketButton, rate } = require("../interactions/ticketActions");
const { pickUser, rename } = require("../interactions/ticketAdvanced");
const log = require("../utils/logger");

function limited(interaction) {
  const result = hit(`${interaction.user.id}:${interaction.customId || interaction.commandName}`, 4, 10000);
  return result.limited;
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    try {
      if (limited(interaction)) {
        return safeReply(interaction, { content: "Çok hızlı işlem yapıyorsun. Birkaç saniye sonra tekrar dene.", flags: MessageFlags.Ephemeral });
      }
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return safeReply(interaction, { content: "Komut bulunamadı.", ephemeral: true });
        return await command.execute(interaction);
      }
      if (interaction.isButton() && interaction.customId.startsWith("setup:")) return handleSetup(interaction);
      if (interaction.isButton() && interaction.customId.startsWith("ticket:open:")) {
        const key = interaction.customId.split(":")[2];
        return interaction.showModal(ticketModal(key));
      }
      if (interaction.isModalSubmit() && interaction.customId.startsWith("ticket:modal:")) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const channel = await openTicket(interaction, interaction.customId.split(":")[2]);
        return interaction.editReply({ content: `Talebin oluşturuldu: ${channel}` });
      }
      if (interaction.isModalSubmit() && interaction.customId.startsWith("ticket:renamemodal:")) return rename(interaction);
      if (interaction.isButton() && interaction.customId.startsWith("ticket:")) return handleTicketButton(interaction);
      if (interaction.isUserSelectMenu() && interaction.customId.startsWith("ticket:pickuser:")) return pickUser(interaction);
      if (interaction.isStringSelectMenu() && interaction.customId.startsWith("ticket:rate:")) return rate(interaction);
    } catch (error) {
      log.error("Etkileşim hatası:", error);
      return safeReply(interaction, { content: error.message || "İşlem sırasında bir hata oluştu.", ephemeral: true }).catch(() => null);
    }
  },
};
