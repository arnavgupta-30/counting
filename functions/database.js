const { Database } = require("quickmongo");
const { ActivityType } = require("discord.js");

module.exports = async (client) => {
  const db = new Database(process.env.dburl);
  db.on("ready", async () => {
    console.log("[📂] Database is ready");
    client.on("ready", async () => {
      if ((await db.get("count")) === null) await db.set("count", 0);
      client.user.setStatus("idle");

      setInterval(async () => {
        client.user.setActivity("number " + (await db.get("count")), {
          type: ActivityType.Watching,
        });
      }, 5000);

    });
  });
  await db.connect();
  client.db = db;
};
