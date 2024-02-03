const { Collection, REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  // Slash commands

  client.commands = new Collection();
  var commands = [];
  const foldersPath = path.join(process.cwd(), "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
  const rest = new REST().setToken(client.config.token);
  (async () => {
    try {
      await rest.put(
        Routes.applicationGuildCommands(client.config.userID, client.config.guildID),
        { body: commands },
      );
      console.log(`[💽] Loaded ${commands.length} cmds`);
    } catch (error) {
      console.error(error);
    }
  })();


  // Events

  const eventsPath = path.join(process.cwd(), "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  console.log("[💿] Loaded " + eventFiles.length + " events");
};
