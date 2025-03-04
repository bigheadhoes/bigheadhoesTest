const calculateLevelXp = require("../../utils/calculateLevelXp");
const Level = require("../../models/member");
const { EmbedBuilder } = require("discord.js");
const cooldowns = new Set();

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = async (message) => {
  if (message.author.bot || cooldowns.has(message.author.id)) return;

  const xpToGive = getRandomXp(10, 100);
  const xpQuery = {
    userId: message.author.id,
  };

  try {
    const level = await Level.findOne(xpQuery);

    if (level) {
      level.xp += xpToGive;

      if (level.xp > calculateLevelXp(level.level)) {
        level.xp = 0;
        level.level += 1;
        const levelUpEmbed = new EmbedBuilder()
          .setTitle(`**⬆️ Rank Up ⬆️**`)
          .setColor("Random")
          .setDescription(
            `*** Account: ${message.author} ***\n**${level.level - 1}** ➡️ ** ${
              level.level
            }**.`
          );
        message.channel.send({ embeds: [levelUpEmbed] });
      }

      await level.save().catch((e) => {
        console.log(`Error saving updated level ${e}`);
        return;
      });
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60000);
    } else {
      // create new level
      const newLevel = new Level({
        username: message.author.username,
        userId: message.author.id,
        guildId: message.guild.id,
        xp: xpToGive,
      });

      await newLevel.save();
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60);
    }
  } catch (error) {
    console.log(`Error giving xp: ${error}`);
  }
};
