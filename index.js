const { Client, GatewayIntentBits, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;
const path = require('path');
const fs = require('fs');

// Creazione del client Discord con gli intents necessari
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Evento quando il bot è online
client.once('ready', () => {
    console.log('Bot online come: ' + client.user.tag);
    console.log('Server connessi: ' + client.guilds.cache.size);
    console.log('Nome del bot: ' + client.user.username);
    console.log('Bot ID: ' + client.user.id);

    // Debug info per templates
    const documentsPath = path.join(__dirname, 'templates');
    console.log('=== DEBUG INFO ===');
    console.log('Current directory:', __dirname);
    console.log('Documents path:', documentsPath);

    try {
        console.log('Checking directory structure...');
        console.log('Root files:', fs.readdirSync(__dirname));
        
        if (fs.existsSync(documentsPath)) {
            console.log('Templates directory exists');
            console.log('Templates files:', fs.readdirSync(documentsPath));
        } else {
            console.log('Templates directory not found');
            console.log('Trying alternate path: /app/templates');
            const altPath = '/app/templates';
            if (fs.existsSync(altPath)) {
                console.log('Found templates at alternate path');
                console.log('Templates files:', fs.readdirSync(altPath));
            }
        }
    } catch (error) {
        console.error('Error checking directories:', error);
    }
});

// Gestione nuovo membro
client.on('guildMemberAdd', async member => {
    try {
        // Crea la categoria personalizzata
        const category = await member.guild.channels.create({
            name: member.displayName + " - Incubator Premium",  // Cambiato qui
            type: 4, // 4 = categoria
            permissionOverwrites: [
                {
                    id: member.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: member.user.id,
                    allow: [PermissionFlagsBits.ViewChannel]
                }
            ]
        });

        // Array dei canali da creare
        const channels = ['generale', 'documenti', 'marketing', 'editing'];
        
        // Crea ogni canale nella categoria
        for (const channelName of channels) {
            const channel = await member.guild.channels.create({
                name: channelName,
                type: 0, // 0 = canale testuale
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: member.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: member.user.id,
                        allow: [PermissionFlagsBits.ViewChannel]
                    }
                ]
            });

            // Se è il canale generale, invia il messaggio di benvenuto e i documenti
            if (channelName === 'generale') {
                const welcomeMessage = `
Ciao ${member.displayName}! 

Benvenuto/a all'interno di Incubator! 🚀

Dacci conferma che tu riesca a vedere 4 canali. Questo gruppo lo utilizziamo per gli aggiornamenti con tutto il team. 

Gli step da fare per partire sono: 
1. Compilare il questionario "Business Anamnesi PreCall che trovi qui sotto prima della call di onboarding ed inserirlo nel canale ⁠documenti;
2. Compilare il questionario "Marketing Strategy" che trovi qui sotto ed inserirlo nel canale documenti;
⁠3. Prenotare tramite questo link la call di onboarding direttamente con Amedeo: https://amedeopoletti.com/onboardingamedeo;


Intanto ti presento il team!

<@882008995919958067> è il project manager che coordina il tutto e si occupa della parte strategica
Io sono <@1230826624061014087>, il marketing manager e mi occupo di tutta la struttura marketing, quindi per qualsiasi domanda o dubbio riguardante le campagne pubblicitarie, funnel, contenuti organici etc chiedi pure a me
<@959471598149197854> è il sales manager, si occupa di tutta la parte di vendita
Per chiedere delle domande ti chiediamo ti taggarci nel gruppo apposito per non perderci alcun messaggio dato che abbiamo diversi gruppi. 
<@949255449985810472> è il video editor, si occupa di tutta la parte di editing degli script.

📌 Nel "generale" ci saranno le discussioni generali.
📑 Nel "documenti" ci sarà l'inserimento di tutti i documenti che servono in modo da trovarli facilmente
📊 Nel "marketing" invece è il canale per quanto riguarda le Ads ed i vari Script
🎬 Nel "editing" inserirai gli script registrati come descritto nel documento "Info utili"

Nel documento "Checklist" troverai i punti con le cose da fare :slight_smile:

Ancora complimenti per la scelta fatta e benvenuto/a!

Per qualsiasi domanda o dubbio rimaniamo tutti a disposizione.
`;
                await channel.send(welcomeMessage);

                // Carica i documenti
                const documentsPath = path.join(__dirname, 'templates');
                console.log('Loading documents from:', documentsPath);
                
                const documents = [
                    {
                        filename: 'Business Anamnesi Pre call.docx',
                        description: '📋 Business Anamnesi Pre call'
                    },
                    {
                        filename: 'Marketing Strategy.docx',
                        description: '🎯 Marketing Strategy'
                    },
                    {
                        filename: 'Checklist per i Clienti.pdf',
                        description: '✅ Checklist Operativa'
                    },
                    {
                        filename: 'Info utili.pdf',
                        description: '📚 Info utili'
                    }
                ];

                // Invia ogni documento
                for (const doc of documents) {
                    const filePath = path.join(documentsPath, doc.filename);
                    console.log(`Checking file: \${doc.filename}`);
                    console.log(`Full path: \${filePath}`);
                    console.log(`File exists: \${fs.existsSync(filePath)}`);
                    
                    if (fs.existsSync(filePath)) {
                        console.log(`Loading file: \${doc.filename}`);
                        const attachment = new AttachmentBuilder(filePath);
                        await channel.send({
                            content: doc.description,
                            files: [attachment]
                        });
                        console.log(`File sent: \${doc.filename}`);
                    } else {
                        console.log(`File not found: \${doc.filename}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Errore nella creazione della struttura:', error);
    }
});

// Gestione errori
client.on('error', error => {
    console.error('Errore del bot:', error);
});

// Login del bot
client.login(token);