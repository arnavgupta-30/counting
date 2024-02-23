/* eslint-disable indent */
const {
  Events,
  ActivityType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
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
      client.user.presence.set(customPresence);
    } else {
      console.log("[📂] Custom presence is disabled");
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
      if (!(await db.get("customStatus"))) {
        var count = await db.get("count");
        var status = "number " + (count + 1);
        if (status !== client.user.presence.activities[0].name) {
          client.user.setActivity(status, {
            type: ActivityType.Listening,
          });
        }
      }

      // Timers
      var timers = await db.get("timers");
      if (!timers) {
        await db.set("timers", []);
        timers = [];
      }

      for (var i = 0; i < timers.length; i++) {
        var timer = timers[i];
        if (timer.expires > Date.now()) return;

        switch (timer.type) {
          case "pollend":
            (async () => {
              var id = timer.id;
              var message = await (
                await client.channels.fetch(timer.channel)
              ).messages.fetch(id);

              await db.set(
                "timers",
                timers.filter((t) => t.id !== timer.id)
              );

              var nb = message.components[0].components;
              const yes = parseInt(nb[0].label);
              const no = parseInt(nb[1].label);
              const total = yes + no;

              const p1 = (yes / total) * 100;
              const p2 = (no / total) * 100;

              var color = null;
              if (yes > no) color = "Green";
              else color = "Red";

              const emb = new EmbedBuilder(message.embeds[0])
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

              message.edit({
                content: (await db.get(`${message.id}:vote:ping`))
                  ? `<@&${await db.get(`${message.id}:vote:ping`)}>`
                  : null,
                components: [row],
                embeds: [emb],
              });
              db.delete(`${message.id}`);
            })();
        }
      }
    }, 2000);

    console.log("[🕒] Listening for timers");
  },
};
