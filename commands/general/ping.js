const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "ping",
    description: "Pong!",
  },

  run: ({ interaction, client, handler }) => {
    const pingEmbed = new EmbedBuilder()
      .setTitle(":ping_pong: Ping :ping_pong:")
      .setDescription(`${client.ws.ping}ms`)
      .setColor("Green")
      .setTimestamp();

    interaction.reply({ embeds: [pingEmbed] });
  },

  options: {},
};
