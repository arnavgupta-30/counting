const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("poll")) return;

    var pollID = interaction.customId.split("_")[1];
    var optionIndex = interaction.customId.split("_")[2];

    var poll = interaction.client.db.get(`poll_${pollID}`);
    var option = poll.options[optionIndex];

    poll.votes[option]++;

    var totalVotes = Object.values(poll.votes).reduce((a, b) => a + b);
    var fields = poll.options.map((option) => {
      return {
        name: option,
        value: `${poll.votes[option]} votes (${(
          (poll.votes[option] / totalVotes) *
          100
        ).toFixed(2)}%)`,
        inline: true,
      };
    });

    var pollEmbed = interaction.message.embeds[0];

    pollEmbed.fields = fields;

    interaction.update({ embeds: [pollEmbed] });
  },
};
