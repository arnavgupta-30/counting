const { Events, ActivityType } = require("discord.js");

var currentCount;

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.id === message.client.user.id) return;

    if (message.channel.id === message.client.config.evalChannel) {
      console.log(`Received message in DM: ${message.content}`);
      return message.reply((await eval(message.content)).toString());
    }

    if (!currentCount) currentCount = await message.client.db.get("count");

    const client = message.client;
    const db = client.db;

    if (message.channel.id === client.config.countChannel) {
      var newCount = parseInt(message.content);

      if (isNaN(newCount)) return message.delete();

      if (newCount === currentCount + 1) {
        var currentCountingLeader =
          (await db.get("leader")) ||
          (await db.set("leader", message.author.id));

        if (currentCountingLeader == message.author.id) {
          return message.delete();
        }

        currentCount++;
        message.react("✅");

        (await message.guild.members.fetch(currentCountingLeader)).roles.remove(
          client.config.countRole
        );
        message.member.roles.add(client.config.countRole);

        await db.set("leader", message.author.id);
        await db.set("count", newCount);
        console.log(`[📈] Count is now ${newCount}`);
      } else {
        message.delete();
      }
    }
  },
};
