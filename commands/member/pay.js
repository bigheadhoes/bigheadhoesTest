const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const Member = require("../../models/member");

/**
 *
 * @param {Client} client
 * @param
 */

module.exports = {
  run: async ({ interaction }) => {
    await interaction.deferReply();
    const userToPay = interaction.options.get("member").value;
    const amountToPay = interaction.options.get("amount").value;

    const userPaying = interaction.user.id;

    try {
      const userToPayDB = await Member.findOne({ userId: userToPay });
      const userPayingDB = await Member.findOne({ userId: userPaying });

      if (!userPayingDB) {
        const noUserPayingEmbed = new EmbedBuilder()
          .setTitle(`**🏧 Cellblock Gaming Bank 🏧**`)
          .setColor(`Red`)
          .setDescription(
            `*💳Account: <@${userPaying}>*\n 🚫 ** Error: ** Could not pay <@${userToPay}>.\n **📝 Reason: ** You do not have a database save yet.\n \n **✅ How To Fix: ** Send some messages first.`
          );

        await interaction.editReply({ embeds: [noUserPayingEmbed] });
        return;
      }

      if (userPayingDB.balance < amountToPay) {
        const noUserToPayEmbed = new EmbedBuilder()
          .setTitle(`**🏧 Cellblock Gaming Bank 🏧**`)
          .setColor(`Red`)
          .setDescription(
            `*💳Account: <@${userPaying}>*\n 🚫 ** Error: ** Could not pay member.\n **📝 Reason: ** You do not have enough points.`
          );

        await interaction.editReply({ embeds: [noUserToPayEmbed] });
        return;
      }

      if (!userToPayDB) {
        const noUserToPayEmbed = new EmbedBuilder()
          .setTitle(`**🏧 Cellblock Gaming Bank 🏧**`)
          .setColor(`Red`)
          .setDescription(
            `*💳Account: <@${userToPay}>*\n 🚫 ** Error: ** Could not pay member.\n **📝 Reason: ** No database save for this member\n \n **✅ How To Fix: ** <@${userToPay}> needs to send a few messages first!!!.`
          );

        await interaction.editReply({ embeds: [noUserToPayEmbed] });
        return;
      }

      if (userToPay === userPaying) {
        const paidYourselfEmbed = new EmbedBuilder()
          .setTitle(`**🏧 Cellblock Gaming Bank 🏧**`)
          .setColor(`Red`)
          .setDescription(
            `*💳Account: <@${userToPay}>*\n 🚫 ** Error: ** You Cannot Pay Yourself.`
          );

        interaction.editReply({ embeds: [paidYourselfEmbed] });
        return;
      } else {
        userPayingDB.balance -= amountToPay;
        await userPayingDB.save().catch((e) => {
          console.log(`Error saving updated balance ${e}`);
          return;
        });

        userToPayDB.balance += amountToPay;
        await userToPayDB.save().catch((e) => {
          console.log(`Error saving updated balance ${e}`);
          return;
        });

        const formattedAmountToPay = amountToPay.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const paidYourselfEmbed = new EmbedBuilder()
          .setTitle(`**🏧 Cellblock Gaming Bank 🏧**`)
          .setColor(`Green`)
          .setDescription(`# ✅ Transaction Successful ✅\n**💳Account: <@${userPaying}>**\n # Successfully paid <@${userToPay}> the amount of $${formattedAmountToPay}`);


        interaction.editReply({ embeds: [paidYourselfEmbed] });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  },

  data: {
    name: "pay",
    description: "Pay another member points!",
    options: [
      {
        name: "member",
        description: "The member whose account you want to pay points too.",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "amount",
        description: "The amount you want to pay the member.",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },
};
