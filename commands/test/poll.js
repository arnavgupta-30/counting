const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question for the poll")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("expiry")
        .setDescription("Relative time for the poll to expire")
        .setRequired(false)
    ),
  async execute(interaction) {
    const client = interaction.client;
    const db = client.db;

    const cont = interaction.options.getString("question");
    const emb = new EmbedBuilder()
      .setTitle("Poll by " + interaction.user.username)
      .setDescription(`${cont}`)
      .setColor("Blurple");
    const btn = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setLabel("0")
        .setStyle(ButtonStyle.Success)
        .setEmoji("👍")
        .setCustomId("vote:yes"),
      new ButtonBuilder()
        .setLabel("0")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("👎")
        .setCustomId("vote:no"),
      new ButtonBuilder()
        .setLabel("END POLL")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("vote:end")
    );

    const msg = await (
      await interaction.reply({
        embeds: [emb],
        components: [btn],
      })
    ).fetch();

    if (interaction.options.getString("expiry")) {
      await db.push("timers", {
        type: "pollend",
        id: msg.id,
        channel: msg.channel.id,
        expires: Date.now() + ms(interaction.options.getString("expiry")),
      });
    }
    await db.set(`${msg.id}:vote:owner`, interaction.user.id);
  },
};
