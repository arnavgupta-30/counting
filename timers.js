/* eslint-disable indent */
module.export = async (client, db) => {
  var timers = await db.get("timers");
  if (timers.length < 1) return;

  for (var i = 0; i < timers.length; i++) {
    var timer = timers[i];
    if (timer.expires > Date.now()) return;

    switch (timer.type) {
      case "pollend":
        var poll = await db.get(`poll_${timer.id}`);
        var totalVotes = Object.values(poll.votes).reduce((a, b) => a + b);
        var fields = poll.options.map((option) => {
          return {
            name: option,
            value: `${poll.votes[option]} votes (${(
              (poll.votes[option] / totalVotes) *
              100
            ).toFixed(2)}%)`,
            inline: true,
          };
        });
        var pollEmbed = poll.embed;
        pollEmbed.fields = fields;

        var channel = client.channels.cache.get(poll.channel);
        channel.messages.fetch(poll.message).then((msg) => {
          msg.edit({ embeds: [pollEmbed] });
        });

        db.delete(`poll_${timer.id}`);
        db.pull("timers", timer);
        break;
    }
  }
};
