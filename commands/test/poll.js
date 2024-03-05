/* eslint-disable indent */
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
        .setName("title")
        .setDescription("The title for the poll")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The description for the poll")
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName("image")
        .setDescription("The image for the poll")
        .setRequired(false)
    )
    .addAttachmentOption((option) =>
      option
        .setName("thumbnail")
        .setDescription("The thumbnail for the poll")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("expiry")
        .setDescription("Relative time for the poll to expire")
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("whitelist")
        .setDescription("The role to whitelist for voting")
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("blacklist")
        .setDescription("The role to blacklist for voting")
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("ping")
        .setDescription("The role to ping when the poll ends")
        .setRequired(false)
    ),
  async execute(interaction) {
    const client = interaction.client;
    const db = client.db;

    const cont = interaction.options.getString("title");
    const desc = interaction.options.getString("description");
    const emb = new EmbedBuilder()
      .setTitle(cont)
      .setDescription(desc)
      .addFields(
        interaction.options.getString("expiry")
          ? {
              name: "Timer",
              value: `<t:${(
                Date.now() + ms(interaction.options.getString("expiry"))
              )
                .toString()
                .slice(0, -4)}:R>`,
            }
          : null
      )
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
        url: `https://discord.com/users/${interaction.user.id}`,
      })
      .setFooter({
        text:
          "Set to expire in " + interaction.options.getString("expiry") ||
          "Never",
      })
      .setThumbnail(
        interaction.options.getAttachment("thumbnail")
          ? interaction.options.getAttachment("thumbnail").url
          : null
      )
      .setImage(
        interaction.options.getAttachment("image")
          ? interaction.options.getAttachment("image").url
          : null
      )
      .setColor("Blurple")
      .setTimestamp(
        interaction.options.getString("expiry")
          ? Date.now() + ms(interaction.options.getString("expiry"))
          : null
      );
    const btn = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setLabel("0")
        .setStyle(ButtonStyle.Success)
        .setEmoji("🔼")
        .setCustomId("vote:yes"),
      new ButtonBuilder()
        .setLabel("0")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🔽")
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

    if (interaction.options.getRole("whitelist")) {
      await db.set(
        `${msg.id}:vote:whitelist`,
        interaction.options.getRole("whitelist").id
      );
    }
    if (interaction.options.getRole("blacklist")) {
      await db.set(
        `${msg.id}:vote:blacklist`,
        interaction.options.getRole("blacklist").id
      );
    }
    if (interaction.options.getRole("ping")) {
      await db.set(
        `${msg.id}:vote:ping`,
        interaction.options.getRole("ping").id
      );
    }
  },
};
