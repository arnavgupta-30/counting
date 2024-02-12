const { SlashCommandBuilder, ActivityType } = require("discord.js");

var activityTypes = [
  { name: "Playing", value: ActivityType.Playing.toString() },
  { name: "Streaming", value: ActivityType.Streaming.toString() },
  { name: "Listening", value: ActivityType.Listening.toString() },
  { name: "Watching", value: ActivityType.Watching.toString() },
  { name: "Competing", value: ActivityType.Competing.toString() },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botpresence")
    .setDescription("Set the bot presence")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reset")
        .setDescription("Reset the bot presence to count value")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("status")
        .setDescription("Set the status of the bot")
        .addStringOption((option) =>
          option
            .setName("status")
            .setDescription("The status of the bot")
            .setRequired(true)
            .addChoices(
              { name: "Online", value: "online" },
              { name: "Idle", value: "idle" },
              { name: "Do Not Disturb", value: "dnd" },
              { name: "Invisible", value: "invisible" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("activity")
        .setDescription("Set the activity of the bot")
        .addStringOption((option) =>
          option
            .setName("activity")
            .setDescription("The activity of the bot")
            .setRequired(true)
            .addChoices(
              { name: "Playing", value: ActivityType.Playing.toString() },
              { name: "Streaming", value: ActivityType.Streaming.toString() },
              { name: "Listening", value: ActivityType.Listening.toString() },
              { name: "Watching", value: ActivityType.Watching.toString() },
              { name: "Competing", value: ActivityType.Competing.toString() }
            )
        )
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the activity")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "reset") {
      await interaction.client.db.set("customStatus", false);
      interaction.client.user.setStatus("idle");
      interaction.client.user.setActivity(
        "number " + ((await interaction.client.db.get("count")) + 1),
        {
          type: ActivityType.Listening,
        }
      );
      await interaction.reply({
        content: "The bot presence has been reset",
        ephemeral: true,
      });
    }
    if (subcommand === "status") {
      const status = interaction.options.getString("status");
      interaction.client.user.setStatus(status);
      await interaction.client.db.set(
        "customStatus",
        {
          status: status,
          activities: interaction.client.user.presence.activities,
        }
      );
      await interaction.reply({
        content: `The status of the bot has been set to ${status}`,
        ephemeral: true,
      });
    } else if (subcommand === "activity") {
      const activity = interaction.options.getString("activity");
      const name = interaction.options.getString("name");
      interaction.client.user.setActivity(name, { type: parseInt(activity) });
      await interaction.client.db.set(
        "customStatus",
        {
          status: interaction.client.user.presence.status,
          activities: [interaction.client.user.presence.activities[0]],
        }
      );
      await interaction.reply({
        content: `The activity of the bot has been set to ${
          activityTypes.find((type) => type.value === activity).name
        } ${name}`,
        ephemeral: true,
      });
    }
  },
};
