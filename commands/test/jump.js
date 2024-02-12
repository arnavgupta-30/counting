const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
	ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
	PermissionFlagsBits,
  TextInputStyle,
	ActivityType
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jump to a specific number"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Jump to a specific number")
      .setDescription("Please enter the number you want to jump to")
      .setColor("#ff0000");

    const actionRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("jump")
        .setLabel("Jump")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [actionRow],
    });

    const filter = (i) => i.customId === "jump";
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 5000,
    });

    collector.on("collect", async (i) => {
      var modal = new ModalBuilder()
        .setCustomId("modal")
        .setTitle("Jump to a specific number")
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("jump")
							.setLabel("Number")
              .setPlaceholder("Enter the number")
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          )
        );

			if (!i.member.permissions.has(PermissionFlagsBits.Administrator)) {
				return i.reply({
					content: "You do not have the required permissions to use this command",
					ephemeral: true
				});
			}

      await i.showModal(modal);

			const filter = (i) => i.customId === "modal";
			const modalData = await i.awaitModalSubmit({ filter, time: 15000 }).catch(() => {return;});
			
				await modalData.deferReply({
					ephemeral: true
				});
				var number = parseInt(modalData.fields.getField("jump").value);
				if (isNaN(number)) return modalData.editReply({
					content: "Please enter a valid number",
					ephemeral: true
				});
				await modalData.editReply({
					content: `Jumped to ${number}`,
					ephemeral: true
				});
				interaction.client.db.set("count", number);
				interaction.client.db.set("leader", modalData.user.id);
        if (await db.get("customStatus")) return;
				interaction.client.user.setActivity("number " + (number + 1), {
					type: ActivityType.Listening,
				});
    });

		collector.on("end", async (collected, reason) => {
			if (reason === "time") {
				await interaction.fetchReply().then((message) => {
					message.delete();
				});
			}
		});
  },
};
