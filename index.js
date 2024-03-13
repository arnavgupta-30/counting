const { Client, GatewayIntentBits, Partials } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Channel, Partials.Message],
});

// {
//   "port": "6724",
//   "evalChannel": "1206602282205061150",
//   "aiChannel": "1201573269501923368",
//   "guildID": "1083399687467438182",
//   "sumanaRoleID": "1208400649692127232",
//   "userID": "1214625981059305503",
//   "countChannel": "1188425706888241253",
//   "countRole": "1087750196215156767"
// }
client.config = {
  port: process.env.port,
  evalChannel: process.env.evalChannel,
  aiChannel: process.env.aiChannel,
  guildID: process.env.guildID,
  sumanaRoleID: process.env.sumanaRoleID,
  userID: process.env.userID,
  countChannel: process.env.countChannel,
  countRole: process.env.countRole,
};

// Error handling
client.on("error", console.error);
process.on("unhandledRejection", console.error);

require("fs")
  .readdirSync("./functions")
  .forEach((file) => {
    require(`./functions/${file}`)(client);
  });

client.login(process.env.token);
