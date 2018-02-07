const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const PREFIX = "$"

function generateHex() {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if(server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

var fortunes = [
    "Ja",
    "Nein",
    "Vielleicht",
    "fick dich lel"
];

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
    console.log("Logged in as:");
    console.log(bot.user.username);
    console.log("ID:");
    console.log(bot.user.id);
});


bot.on("message", function(message) {
    if(message.author.equals(bot.user)) return;

    if(!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "ping":
            var ping = new Discord.RichEmbed()
                .addField("Ping", message.member.client.ping)
                .setImage("https://hugelolcdn.com/i/312914.gif")
                .setFooter("Nice Ping :D")

            message.channel.send(ping);
            break;
        case "info":
            message.channel.send("I'm the best Discord bot created by DerJanikGurke!");
            break;
        case "8ball":
            if(args[1]) message.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)]);
            else message.channel.send("Can't read that");
            break;
        case "profile":
            var embed = new Discord.RichEmbed()
                .addField("Name", message.author.username)
                .addField("Tag", message.author)
                .addField("Joined Discord", message.author.createdAt.getUTCDay() + "." + message.author.createdAt.getUTCMonth() + "." + message.author.createdAt.getFullYear() + " - " + message.author.createdAt.getUTCHours() + ":" + message.author.createdAt.getUTCMinutes() + ":" + message.author.createdAt.getUTCSeconds())
                .setColor("0x" +Math.floor(Math.random()*16777215).toString(16))
                .setThumbnail(message.author.avatarURL)
            message.channel.send(embed);
            break; 
        case "noticeme":
            message.channel.send(message.author.toString() + ", get noticed!")
            break;
        case "avatar":
            var avatar = new Discord.RichEmbed()
                .addField("Avatar", "This is your avatar:")
                .setImage(message.author.avatarURL)
                .setFooter("You got an dope avatar :D")
                .setColor(0x3B931C)
            message.channel.send(avatar)
            break;
        case "play":
            if(!args[1]) {
                message.channel.send("please provide a yt link");
                return;
            }

            if(!message.member.voiceChannel) {
                message.channel.send("You have to be in a voice channel!")
            } else {
            
            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
        }
            break;
        case "skip":

            var server = servers[message.guild.id];

            if(server.dispatcher) server.dispatcher.end();
            break;
        case "stop":
        var server = servers[message.guild.id];

            if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
        case "clear":
        message.delete();
            async function purge() {

                if(isNaN(args[1])) {
                    message.channel.send("Please provide a number!");
                } else {
                    const fetched = await message.channel.fetchMessages({limit: args[1]});
                console.log(fetched.size + " messages found, deleting ...")
                message.channel.bulkDelete(fetched)
                    .catch(error => message.channel.send(`Error: ${error}`));
                }

                
            }
            purge();
            var clearchannel = new Discord.RichEmbed()
                .addField("Done.",  "Messages deleted.")
                .setThumbnail("https://cdn.pixabay.com/photo/2014/10/24/09/03/quality-500950_960_720.png")
                .setFooter("Fixed!")
            message.channel.send(clearchannel);
            break;
        default:
            message.channel.send("Invalid command!")
    }
}); 

bot.login(process.env.BOT_TOKEN);
