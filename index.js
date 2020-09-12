'use strict';

/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */

// Import the discord.js module
const Discord = require('discord.js');
const { prefix, token, w2gKey } = require('./config.json');
const axios = require('axios');
const cheerio = require('cheerio')

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

    //gets args by slicing off the prefix entirely, removes the leftover whitespaces and then splits it into an array by spaces.
    const args = message.content.slice(prefix.length).trim().split(' ');
    
    //removes the first element of the array which which will be the command text and assigns it to a cmd var
	const command = args.shift().toLowerCase();

	if (command === 'w2g') {
        console.log(args[0])
        axios.post("https://w2g.tv/rooms/create.json", { "w2g_api_key": w2gKey, "share":args[0] })
        .then(res => {
            console.log(res.data);
            message.channel.send("https://w2g.tv/rooms/" + res.data.streamkey + "?lang=en");
        })
        .catch(error => {
            if (error.response){
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                message.channel.send("Woops. Seems an error occured here: " + error.response.status)
                
            }

            else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
                message.channel.send("I asked the server for a W2G room but received no response...")
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error: ', error.message);
                message.channel.send("An unknown error occured!")
              }
            
        });

        
		
	} 
	// other commands...
});

client.login(token)


