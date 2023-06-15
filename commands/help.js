// Dependencies
const { MessageEmbed, Message } = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'help', // Command name
	description: 'Display the command list.', // Command description

    /**
     * Command exetute
     * @param {Message} message The message sent by user
     */
	execute(message) {
        const { commands } = message.client; // Get commands from the client
    
        message.channel.send(
            new MessageEmbed()
                .setColor(config.color.default)
                .setTitle('Command list')
                .setDescription('Here is a list of available commands:')
                .addField('Free Commands', `\`${config.prefix}gen:\` Generate a specified service if stocked \n\`${config.prefix}stock:\` Display the service stock`)
                .addField('Premium Commands :star:', `\`${config.prefix}pgen:\` Generate a specified service if stocked \n\`${config.prefix}pstock:\` Display the service stock `)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
                .setImage(config.gifurl)
        );
    }
    
      
    
};