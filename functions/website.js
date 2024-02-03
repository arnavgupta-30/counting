const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

module.exports = (client) => {
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
