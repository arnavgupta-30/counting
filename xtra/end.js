const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  type: "button",
  filter: "vote:end",
  run: async (client, interaction) => {
    const db = client.db;

    var nb = interaction.message.components[0].components;
    const yes = parseInt(nb[0].label);
    const no = parseInt(nb[1].label);
    const total = yes + no;

    const p1 = (yes / total) * 100;
    const p2 = (no / total) * 100;

    var color = null;
    if (yes > no) color = "Green";
    else color = "Red";

    const emb = new EmbedBuilder(interaction.message.embeds[0])
      .setColor(color)
      .addFields(
        {
          name: "Upvotes",
          value: `${yes} (${p1.toFixed(2)}%)`,
          inline: true,
        },
        {
          name: "Downvotes",
          value: `${no} (${p2.toFixed(2)}%)`,
          inline: true,
        }
      );

    var row = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setDisabled(true)
        .setLabel(`${yes}/${total} (${p1.toFixed(2)}%)`)
        .setStyle(ButtonStyle.Success)
        .setEmoji("🔼")
        .setCustomId("vote:yes"),
      new ButtonBuilder()
        .setDisabled(true)
        .setLabel(`${no}/${total} (${p2.toFixed(2)}%)`)
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🔽")
        .setCustomId("vote:no"),
      new ButtonBuilder()
        .setDisabled(true)
        .setLabel("END POLL")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("vote:end")
    );

    interaction.update({
      content: (await db.get(`${interaction.message.id}:vote:ping`))
        ? `<@&${await db.get(`${interaction.message.id}:vote:ping`)}>`
        : null,
      components: [row],
      embeds: [emb],
    });
    db.delete(`${interaction.message.id}`);
  },
};
