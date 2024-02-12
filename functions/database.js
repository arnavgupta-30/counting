const { Database } = require("quickmongo");
const { ActivityType } = require("discord.js");

module.exports = async (client) => {
  const db = new Database(process.env.dburl);
  db.on("ready", async () => {
    console.log("[📂] Database is ready");
    client.on("ready", async () => {
      if ((await db.get("count")) === null) await db.set("count", 0);

      var customPresence = await db.get("customStatus");
      if (customPresence) {
        console.log("[📂] Custom presence is enabled");
        console.log(`[📂] Presence: ${JSON.stringify(await db.get("customStatus"))}`);
        client.user.presence.set(customPresence);
      } else {
        client.user.setStatus("idle");
        client.user.setActivity("number " + ((await db.get("count")) + 1), {
          type: ActivityType.Listening,
        });
      }

      setInterval(async () => {
        if (await db.get("customStatus")) return;
        var count = await db.get("count");
        var status = "number " + (count + 1);
        if (status !== client.user.presence.activities[0].name) {
          client.user.setActivity(status, {
            type: ActivityType.Listening,
          });
        }
      }, 2000);
    });
  });
  await db.connect();
  client.db = db;
};
