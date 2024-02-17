const { Events, PermissionFlagsBits } = require("discord.js");

var safeEval = require("safe-eval");
var currentCount;

var gemini;
import("gemini-ai").then((Gemini) => {
  gemini = new Gemini.default(process.env.gemnikey);
});

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const client = message.client;
    const db = client.db;

    if (message.author.id === client.user.id) return;
    if (message.author.bot) return;

    if (message.channel.id == client.config.aiChannel) {
      try {
        message.react("🤔");
        var response = await gemini.ask(message.content);

        if (response.length > 2000) {
          var responses = [];
          while (response.length > 2000) {
            responses.push(response.slice(0, 2000));
            response = response.slice(2000);
          }
          responses.push(response);
          for (var i = 0; i < responses.length; i++) {
            message.reply(responses[i]);
          }
        } else {
          message.reply(response);
        }
        message.reactions.removeAll();
      } catch (e) {
        console.log(e);
        message.reactions.removeAll();
        message.react("❌");
      }
    }

    if (message.content.startsWith(">")) {
      // check for a webhook named "Anonymous" in the message channel if not then create it in discord.js v14
      const channel = message.channel;
      // Fetch webhooks for the channel
      const webhooks = await channel.fetchWebhooks();
      let webhook = webhooks.find((w) => w.name === "Anonymous");

      // If the webhook doesn't exist, create it
      if (!webhook) {
        webhook = await channel.createWebhook({
          name: "Anonymous",
          avatar:
            "https://www.thetonyrobbinsfoundation.org/wp-content/uploads/2017/09/Cool-avatars-anonymous-avatar.jpg",
          reason: "Needed a webhook named Anonymous",
        });
      }

      webhook.send({
        content: message.content.slice(1),
        threadId: message.threadId ? message.threadId : null,
        files: message.attachments.map((file) => {
          return file.url;
        }),
      });
      message.delete();
    }

    if (message.channel.id === client.config.evalChannel) {
      var evalCnt;
      try {
        if (message.member.permissions.has(PermissionFlagsBits.Administrator)) {
          evalCnt = (await eval(message.content)).toString();
        } else {
          evalCnt = safeEval(message.content).toString();
        }
      } catch (e) {
        evalCnt = e.toString();
      }
      return message.reply(evalCnt);
    }

    if (message.channel.id === client.config.countChannel) {
      if (!currentCount) currentCount = await db.get("count");

      const guild = client.guilds.cache.get(client.config.guildID);
      const role = await guild.roles.fetch(client.config.sumanaRoleID);
      if (!message.member.roles.cache.has(role.id)) {
        console.log("[❌] User does not have the role");

        message.author
          .send("You must have `Sarkar` in your status to use this channel")
          .catch(() => {
            message
              .reply(
                "You must have `Sarkar` in your status to use this channel"
              )
              .then((msg) => {
                setTimeout(() => {
                  msg.delete();
                }, 5000);
              });
          });
        return message.delete();
      }

      var newCount = parseInt(message.content);

      if (isNaN(newCount)) {
        console.log("[❌] Message is not a number");
        return message.delete();
      }

      if (newCount === currentCount + 1) {
        var currentCountingLeader =
          (await db.get("leader")) ||
          (await db.set("leader", message.author.id));

        if (currentCountingLeader == message.author.id) {
          console.log("[❌] User is already the leader");
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
        console.log("[❌] Wrong Number inputed");
        message.delete();
      }
    }
  },
};
