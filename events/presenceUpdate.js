const { Events } = require("discord.js");

module.exports = {
  name: Events.PresenceUpdate,
  async execute(oldPresence, newPresence) {
    if (newPresence.member.user.bot) return;

    const client = newPresence.client;
    const role = await (
      await client.guilds.fetch(client.config.guildID)
    ).roles.fetch(client.config.sumanaRoleID);

    if (
      newPresence.activities.some((activity) =>
        activity.state?.toLowerCase().includes("sarkar")
      )
    ) {
      if (newPresence.member.roles.cache.has(role.id)) return;
      newPresence.member.roles.add(role);
    } else {
      if (!newPresence.member.roles.cache.has(role.id)) return;
      newPresence.member.roles.remove(role);
    }
  },
};
