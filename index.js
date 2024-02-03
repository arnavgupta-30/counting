const { Client, Events, GatewayIntentBits } = require("discord.js");
const config_json = require("./config.json");

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildMessageTyping,
] });

client.config = config_json;

// Error handling
client.on("error", console.error);
process.on("unhandledRejection", console.error);

require("fs")
  .readdirSync("./functions")
  .forEach((file) => {
    require(`./functions/${file}`)(client);
  });

client.login(process.env.token);
