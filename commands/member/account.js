const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
    EmbedBuilder
} = require('discord.js');
const {Font, RankCardBuilder} = require('canvacord');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const Level = require('../../models/member');



module.exports = {
    /**
    *
    * @param {Client} client
    * @param {Interaction} interaction
    */
    run: async ({ interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply('You can only run this command inside a server.');
            return;
          }
      
          await interaction.deferReply();
      
          const mentionedUserId = interaction.options.get('member')?.value;
          const targetUserId = mentionedUserId || interaction.member.id;
          const targetUserObj = await interaction.guild.members.fetch(targetUserId);
      
          const fetchedLevel = await Level.findOne({
            userId: targetUserId,
          });
      
          if (!fetchedLevel) {

            const noDbSaveEmbed = new EmbedBuilder()
            .setTitle(`**🏧 Cellblock Gaming Bank 🏧**`)
            .setColor(`Red`)
            .setDescription(
              `** 💳Account: ** <@${targetUserId}>*\n 🚫 ** Error: ** Could not fetch members account.\n **📝 Reason: ** No database save for this member\n \n **✅ How To Fix: ** <@${targetUserId}> needs to send a few messages first!!!.`
            );

            const noUserSaveEmbed = new EmbedBuilder()
            .setTitle(`**🏧 Cellblock Gaming Bank 🏧**`)
            .setColor(`Red`)
            .setDescription(
              `** 💳Account: ** <@${targetUserId}>*\n 🚫 ** Error: ** Could not fetch your account.\n **📝 Reason: ** No database save for this member\n \n **✅ How To Fix: ** Try sending a few messages first!!!.`
            );

            interaction.editReply(
              mentionedUserId
                ? {embeds: [noDbSaveEmbed]}
                : {embeds: [noUserSaveEmbed]}
            );
            return;
          }
      
          let allLevels = await Level.find().select(
            '-_id userId level xp'
          );
      
          allLevels.sort((a, b) => {
            if (a.level === b.level) {
              return b.xp - a.xp;
            } else {
              return b.level - a.level;
            }
          });
      
          let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
          await Font.fromFile("./src/fonts/KOMIKAX_.ttf");


          const rank = new RankCardBuilder()
          .setDisplayName(targetUserObj.user.username) // Big name
          .setUsername(`Balance: $${fetchedLevel.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`) // small name, do not include it if you want to hide it
          .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256, forceStatic: true })) // user avatar
          .setCurrentXP(fetchedLevel.xp) // current xp
          .setRequiredXP(calculateLevelXp(fetchedLevel.level)) // required xp
          .setLevel(fetchedLevel.level) // user level
          .setRank(currentRank) // user rank
          .setBackground("#23272a") // set background color or,
          //.setBackground("./path/to/image.png") // set background image
          .setStatus("online"); // user status. Omit this if you want to hide it
      
          const data = await rank.build();
          const attachment = new AttachmentBuilder(data);
          interaction.editReply({ files: [attachment] });
    },

    data: {
        name: 'account',
        description: "Shows your discord rank card.",
        options: [
            {
                name: 'member',
                description: 'The member whose account you want to see.',
                type: ApplicationCommandOptionType.Mentionable,
            },
        ],
    }
}