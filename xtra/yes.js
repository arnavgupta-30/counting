const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  type: "button",
  filter: "vote:yes",
  run: async (client, interaction) => {
    const db = client.db;
    var voteIdentifier = `${interaction.message.id}:${interaction.user.id}:vote`;
    const voteChoice = await db.get(voteIdentifier);

    var row = interaction.message.components[0];
    var buttons = row.components;

    var yesButtonValue = parseInt(buttons[0].label);
    var noButtonValue = parseInt(buttons[1].label);

    if (voteChoice == "no") {
      noButtonValue -= 1;
      yesButtonValue += 1;
      await db.set(voteIdentifier, "yes");
    } else if (voteChoice == "yes") {
      yesButtonValue -= 1;
      await db.set(voteIdentifier, "null");
    } else {
      yesButtonValue += 1;
      await db.set(voteIdentifier, "yes");
    }

    row = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setLabel(yesButtonValue.toString())
        .setStyle(ButtonStyle.Success)
        .setEmoji("👍")
        .setCustomId("vote:yes"),
      new ButtonBuilder()
        .setLabel(noButtonValue.toString())
        .setStyle(ButtonStyle.Danger)
        .setEmoji("👎")
        .setCustomId("vote:no"),
      new ButtonBuilder()
        .setLabel("END POLL")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("vote:end")
    );

    interaction.update({ components: [row] });
  },
};
