const Member = require("../../models/member");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param
 */

module.exports = {
  run: async ({ interaction }) => {
    await interaction.deferReply();
    const mentionedUser = interaction.options.get("username")?.value;
    const targetUserId = mentionedUser || interaction.user.id;

    try {
      const fetchedUser = await Member.findOne({ userId: targetUserId });

      if (!fetchedUser) {
        const noDbSaveEmbed = new EmbedBuilder()
          .setTitle(`**🏧 Cellblock Gaming Bank 🏧**`)
          .setColor(`Red`)
          .setDescription(
            `*💳Account: <@${targetUserId}>*\n 🚫 ** Error: ** Could not fetch members bank.\n **📝 Reason: ** No database save for this member\n \n **✅ How To Fix: ** <@${targetUserId}> needs to send a few messages first!!!.`
          );

        interaction.editReply({ embeds: [noDbSaveEmbed] });
        return;
      } else {
        const balance = fetchedUser.balance;
        const formattedBalance = balance
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        const bankEmbed = new EmbedBuilder()
          .setTitle(`***🏧 Cellblock Gaming Bank 🏧***`)
          .setColor(`Green`)
          .setDescription(
            `**💳Account: **<@${targetUserId}>\n ** 🏦  Balance: ** $${formattedBalance}`
          );
        await interaction.editReply({ embeds: [bankEmbed] });
      }
    } catch (error) {
      console.log(error);
    }
  },

  data: {
    name: "balance",
    description: "Check a players balance.",
    options: [
      {
        name: "username",
        description: "Members Discord Username",
        type: ApplicationCommandOptionType.User,
      },
    ],
  },
};
