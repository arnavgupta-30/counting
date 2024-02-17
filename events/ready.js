/* eslint-disable indent */
const { Events, ActivityType } = require("discord.js");
var index = 0;

module.exports = {
  name: Events.ClientReady,
  async execute(client) {
    index++;

    if (index === 1) return;

    console.log(`[🤖] Online as ${client.user.tag}`);
    const db = client.db;

    if ((await db.get("count")) === null) await db.set("count", 0);

    var customPresence = await db.get("customStatus");
    if (customPresence) {
      console.log("[📂] Custom presence is enabled");
      console.log(
        `[📂] Presence: ${JSON.stringify(await db.get("customStatus"))}`
      );
      client.user.presence.set(customPresence);
    } else {
      client.user.setStatus("idle");
      client.user.setActivity("number " + ((await db.get("count")) + 1), {
        type: ActivityType.Listening,
      });
    }

    // Check if any user has sumana in their status if so, give them the role
    const guild = client.guilds.cache.get(client.config.guildID);
    const role = await guild.roles.fetch(client.config.sumanaRoleID);
    (await guild.members.fetch()).map((member) => {
      if (
        member.presence?.activities.some((activity) =>
          activity.state?.toLowerCase().includes("sarkar")
        )
      ) {
        if (member.roles.cache.has(role.id)) return;
        member.roles.add(role);
      } else {
        if (!member.roles.cache.has(role.id)) return;
        member.roles.remove(role);
      }
    });

    setInterval(async () => {
      // Custom presence
      if (await db.get("customStatus")) return;
      var count = await db.get("count");
      var status = "number " + (count + 1);
      if (status !== client.user.presence.activities[0].name) {
        client.user.setActivity(status, {
          type: ActivityType.Listening,
        });
      }

      // Timers
      var timers = await db.get("timers");
      if (timers.length < 1) return;

      for (var i = 0; i < timers.length; i++) {
        var timer = timers[i];
        if (timer.expires > Date.now()) return;

        switch (timer.type) {
          case "pollend":
            var poll = await db.get(`poll_${timer.id}`);
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
            var pollEmbed = poll.embed;
            pollEmbed.fields = fields;

            var channel = client.channels.cache.get(poll.channel);
            channel.messages.fetch(poll.message).then((msg) => {
              msg.edit({ embeds: [pollEmbed] });
            });

            db.delete(`poll_${timer.id}`);
            db.pull("timers", timer);
            break;
        }
      }
    }, 2000);
  },
};
