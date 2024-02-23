const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageDelete,
  async execute(message) {
    if (message.author?.id === message.client.user.id) return;
    if (message.channel.id === message.client.config.countChannel) {
      var currentCount = await message.client.db.get("count");
      var lastmsg = (
        await message.channel.messages.fetch({ limit: 1 })
      ).first();

      if ((lastmsg?.content || -10) !== currentCount.toString()) {
        message.channel.send({
          content: currentCount.toString(),
          embeds: [
            {
              title: `Next count is **${currentCount + 1}**!`,
              description: `Please continue from **${
                currentCount + 1
              }**!\nLast count was by <@!${await message.client.db.get(
                "leader"
              )}>.`,
              color: 0xff0000,
            },
          ],
        });
      }
    }
  },
};
