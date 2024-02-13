const express = require("express");
const { process } = require("node");
const app = express();

module.exports = (client) => {
  const port = process.env.PORT || client.config.port || 3000;

  client.on("ready", () => {
    app.get("/", (req, res) => {
      res.send(
        "Hello World! This is a website for " + client.user.username + " bot!"
      );
    });

    app.listen(port, () => {
      console.log(`[🌐] Website on :${port}`);
    });
  });
};
