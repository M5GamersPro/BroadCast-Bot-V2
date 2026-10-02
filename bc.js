const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ComponentType,
    PermissionFlagsBits
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = "+";
const TOKEN = "put-your-token-here";

client.once('ready', () => {
    console.log(`🚀 Bot online as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'bc') {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply("❌ You need Administrator permissions to use this command.");
        }

        const broadcastContent = args.join(' ');
        if (!broadcastContent) {
            return message.reply(`❌ Usage: \`${PREFIX}bc [your text]\``);
        }

        const confirmBtn = new ButtonBuilder()
            .setCustomId('confirm_bc')
            .setLabel('🚀 Confirm Launch')
            .setStyle(ButtonStyle.Success);

        const cancelBtn = new ButtonBuilder()
            .setCustomId('cancel_bc')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger);

        const controlRow = new ActionRowBuilder().addComponents(confirmBtn, cancelBtn);

        const previewEmbed = new EmbedBuilder()
            .setTitle("📢 Broadcast Content Confirmation")
            .setDescription(`Review your message payload below before distribution.\n\n**Message Content:**\n> ${broadcastContent}`)
            .setColor(0x5865F2)
            .setFooter({ text: "Click Confirm to initiate full server distribution queue." });

        const setupMessage = await message.reply({ 
            embeds: [previewEmbed], 
            components: [controlRow] 
        });

        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = setupMessage.createMessageComponentCollector({ 
            filter, 
            componentType: ComponentType.Button, 
            time: 60000 
        });

        collector.on('collect', async (interaction) => {
            await interaction.deferUpdate(); 
            collector.stop(); 

            if (interaction.customId === 'cancel_bc') {
                return setupMessage.edit({ content: "❌ Broadcast cancelled by operator.", embeds: [], components: [] });
            }

            await setupMessage.edit({ content: "⏳ Synchronizing server member rosters...", embeds: [], components: [] });

            await message.guild.members.fetch(); 
            const targets = message.guild.members.cache.filter(member => !member.user.bot);

            if (targets.size === 0) {
                return setupMessage.edit({ content: "⚠️ No valid human targets detected." });
            }

            let successCount = 0;
            let failCount = 0;

            const progressEmbed = new EmbedBuilder()
                .setTitle("📡 Transmission Pipeline Running")
                .setDescription(`Processing delivery queues safely...`)
                .setColor(0xFEE75C);

            await setupMessage.edit({ content: null, embeds: [progressEmbed] });

            for (const [id, member] of targets) {
                try {
                    const dmEmbed = new EmbedBuilder()
                        .setTitle(`📢 Important Update`)
                        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                        .setDescription(broadcastContent)
                        .setColor(0x5865F2)
                        .setTimestamp();

                    await member.send({ 
                        content: `Hello ${member.user}, you got a broadcast from ${message.guild.name} !`, 
                        embeds: [dmEmbed] 
                    });
                    
                    successCount++;
                } catch (err) {
                    failCount++;
                }

                progressEmbed.setDescription(`**Progress Matrix:**\n✅ Delivered: ${successCount}\n❌ Closed DMs/Blocked: ${failCount}`);
                await setupMessage.edit({ embeds: [progressEmbed] }).catch(() => {});

                await new Promise(resolve => setTimeout(resolve, 500));
            }

            const reportEmbed = new EmbedBuilder()
                .setTitle("✅ Operational Pipeline Concluded")
                .setColor(0x57F287)
                .addFields(
                    { name: "🎯 Total Roster", value: `${targets.size}`, inline: true },
                    { name: "🟩 Sent Successfully", value: `${successCount}`, inline: true },
                    { name: "🟥 Failed Delivery", value: `${failCount}`, inline: true }
                )
                .setTimestamp();

            await setupMessage.edit({ embeds: [reportEmbed] });
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time' && collected.size === 0) {
                await setupMessage.edit({ content: "⏱️ Confirmation timed out. Broadcast aborted.", embeds: [], components: [] });
            }
        });
    }
});

client.login(TOKEN);

