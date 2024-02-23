const { Collection, REST, Routes, Events } = require("discord.js");
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
  const rest = new REST().setToken(process.env.token);
  (async () => {
    try {
      await rest.put(
        Routes.applicationGuildCommands(
          client.config.userID,
          client.config.guildID
        ),
        { body: commands }
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

  // Xtra

  client.xtra = new Collection();
  const xtraPath = path.join(process.cwd(), "xtra");
  const xtraFiles = fs
    .readdirSync(xtraPath)
    .filter((file) => file.endsWith(".js"));

  Array.from(xtraFiles).forEach((file) => {
    const filePath = path.join(xtraPath, file);
    const xtra = require(filePath);
    client.xtra.set(xtra.filter, xtra);
  });

  console.log("[💾] Loaded " + xtraFiles.length + " xtra");

  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isCommand()) return;

    if (interaction.isButton()) {
      const xtra = client.xtra.find((x) => {
        if (typeof x.filter === "function") {
          return x.filter(interaction.customId) && x.type === "button";
        } else {
          return x.filter === interaction.customId && x.type === "button";
        }
      });
      if (xtra) {
        xtra.run(client, interaction);
      }
    }
  });
};
