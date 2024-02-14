const { Database } = require("quickmongo");

module.exports = async (client) => {
  const db = new Database(process.env.dburl);
  db.on("ready", async () => {
    console.log("[📂] Database is ready");
    client.db = db;
    client.emit("ready", client);
  });
  await db.connect();
};
