const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const Member = require("../../models/member");

module.exports = {
  /**
   *
   * @param {Object} param0
   * @param {ChatInputCommandInteraction} param0.interaction
   */
  run: async ({ interaction }) => {
    await interaction.deferReply();
    const mentionedUser = interaction.options.get("username").value;
    const amount = interaction.options.get("amount").value;
    const subcommand = interaction.options.getSubcommand();

    try {
      const fetchedMember = await Member.findOne({
        userId: mentionedUser,
      });

      if (!fetchedMember) {
        const noDbSaveEmbed = new EmbedBuilder()
          .setTitle(`**🏧 Cellblock Gaming Bank 🏧**`)
          .setColor(`Red`)
          .setDescription(
            `*💳Account: <@${mentionedUser}>*\n 🚫 ** Error: ** Could not configure members.\n **📝 Reason: ** No database save for this member\n \n **✅ How To Fix: ** <@${mentionedUser}> needs to send a few messages first!!!.`
          );

        interaction.editReply({ embeds: [noDbSaveEmbed] });
        return;
      }

      if (subcommand === "add") {
        if (mentionedUser === interaction.user.id) {
          const paidYourselfEmbed = new EmbedBuilder()
            .setTitle(`**🏧 Cellblock Gaming Bank 🏧**`)
            .setColor(`Red`)
            .setDescription(
              `*💳Account: <@${mentionedUser}>*\n 🚫 ** Error: ** You Cannot Give Yourself Points.`
            );

          interaction.editReply({ embeds: [paidYourselfEmbed] });
          return;
        }

        fetchedMember.balance += amount;
        await fetchedMember.save();

        const formattedBalance = fetchedMember.balance
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        const addPointsSuccessEmbed = new EmbedBuilder()
          .setTitle(`**🏧 Cellblock Gaming Bank 🏧**`)
          .setColor(`Green`)
          .setDescription(
            `# ✅ Transaction Successful ✅\n**💳Account: <@${mentionedUser}>**\nAmount Added: $${amount}\n🏦  Balance: $${formattedBalance}\n \n Added By: ${interaction.user}`
          );

        interaction.editReply({ embeds: [addPointsSuccessEmbed] });
        return;
      }

      if (subcommand === "remove") {
        if (mentionedUser === interaction.user.id) {
          const removedYourselfEmbed = new EmbedBuilder()
            .setTitle(`**🏧 Cellblock Gaming Bank 🏧**`)
            .setColor(`Red`)
            .setDescription(
              `*💳Account: <@${mentionedUser}>*\n 🚫 ** Error: ** You Cannot Remove Your Own Points.`
            );

          interaction.editReply({ embeds: [removedYourselfEmbed] });
          return;
        }

        fetchedMember.balance -= amount;
        await fetchedMember.save();

        const formattedBalance = fetchedMember.balance
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        const removePointsSuccessEmbed = new EmbedBuilder()
          .setTitle(`**🏧 Cellblock Gaming Bank 🏧**`)
          .setColor(`Green`)
          .setDescription(
            `# ✅ Transaction Successful ✅\n**💳Account: <@${mentionedUser}>**\nAmount Removed: $${amount}\n🏦  Balance: $${formattedBalance}\n \n Removed By: ${interaction.user}`
          );

        interaction.editReply({ embeds: [removePointsSuccessEmbed] });
        return;
      }

      if (subcommand === "set") {
        if (mentionedUser === interaction.user.id) {
          const setYourselfEmbed = new EmbedBuilder()
            .setTitle(`**🏧 Cellblock Gaming Bank 🏧**`)
            .setColor(`Red`)
            .setDescription(
              `*💳Account: <@${mentionedUser}>*\n 🚫 ** Error: ** You Cannot Set Your Own Points.`
            );

          interaction.editReply({ embeds: [setYourselfEmbed] });
          return;
        }

        fetchedMember.balance = amount;
        await fetchedMember.save();

        const formattedAmount = amount
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        const removePointsSuccessEmbed = new EmbedBuilder()
          .setTitle(`**🏧 Cellblock Gaming Bank 🏧**`)
          .setColor(`Green`)
          .setDescription(
            `# ✅ Transaction Successful ✅\n**💳Account: <@${mentionedUser}>**\n🏦 Balance Set To: $${formattedAmount}\n \n Set By: ${interaction.user}`
          );

        interaction.editReply({ embeds: [removePointsSuccessEmbed] });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  },

  options: {
    userPermissions: ["Administrator"],
  },

  data: new SlashCommandBuilder()
    .setName("points")
    .setDescription("Give, Set, and Remove members money!")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add Points to a members bank!")
        .addUserOption((option) =>
          option
            .setName("username")
            .setDescription("The member you want to recieve the points.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount you want to give the member.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a members points.")
        .addUserOption((option) =>
          option
            .setName("username")
            .setDescription("The member you want to remove the points frome.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount you want to give the member.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set a members points to a specific amount.")
        .addUserOption((option) =>
          option
            .setName("username")
            .setDescription("The member you want to set the points of.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription(
              "The amount you want to set the members balance to."
            )
            .setRequired(true)
        )
    ),
};
