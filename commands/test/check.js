const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("count")
    .setDescription("Get the current count"),
  async execute(interaction) {
    const count = await interaction.client.db.get("count");
    const leader = await interaction.client.db.get("leader");
    const embed = new EmbedBuilder()
      .setTitle("Current count")
      .setDescription(
        `The current count is \`${count}\`\nNext number to enter is \`${
          count + 1
        }\`\nCurrent leader is <@!${leader}>`
      )
      .setColor("#ff0000");

    await interaction.reply({ embeds: [embed] });
  },
};
