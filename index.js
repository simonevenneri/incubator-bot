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
});

// Gestione nuovo membro
client.on('guildMemberAdd', async member => {
    try {
        // Verifica se l'utente è già stato processato
        const existingCategory = member.guild.channels.cache.find(
            ch => ch.type === 4 && ch.name === `\${member.displayName} - Incubator Premium`
        );

        // Se esiste già una categoria per questo utente, non fare nulla
        if (existingCategory) {
            console.log(`Categoria già esistente per l'utente \${member.displayName}`);
            return;
        }

        // Se non esiste, procedi con la creazione
        const category = await member.guild.channels.create({
            name: member.displayName + " - Incubator Premium",
            type: 4,
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
        const channels = ['generale', 'documenti', 'marketing', 'editing', 'vendita'];
        
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
                // Prima parte del messaggio
                const welcomeMessage1 = `Ciao \${member.displayName}! 

Benvenuto/a all'interno di Incubator! 🚀

Dacci conferma che tu riesca a vedere 5 canali. Questo gruppo lo utilizziamo per gli aggiornamenti con tutto il team. 

Gli step da fare per partire sono: 
1. Compilare il questionario "Business Anamnesi PreCall che trovi qui sotto prima della call di onboarding ed inserirlo nel canale ⁠documenti;
2. Compilare il questionario "Marketing Strategy" che trovi qui sotto ed inserirlo nel canale documenti;
⁠3. Prenotare tramite questo link la call di onboarding direttamente con Amedeo: https://amedeopoletti.com/onboardingamedeo;

Info: Link al calendario di Simone: https://amedeopoletti.com/coach-dfy;
Info: Link al calendario di Luca: https://amedeopoletti.com/vendita-dfy;`;

                // Seconda parte del messaggio
                const welcomeMessage2 = `Intanto ti presento il team!

<@882008995919958067> è il project manager che coordina il tutto e si occupa della parte strategica
Io sono <@1230826624061014087>, il marketing manager e mi occupo di tutta la struttura marketing, quindi per qualsiasi domanda o dubbio riguardante le campagne pubblicitarie, funnel, contenuti organici etc chiedi pure a me
<@959471598149197854> è il sales manager, si occupa di tutta la parte di vendita
<@949255449985810472> è il video editor, si occupa di tutta la parte di editing degli script.

**Per chiedere delle domande ti chiediamo ti taggarci nel gruppo apposito per non perderci alcun messaggio dato che abbiamo diversi gruppi.**`;

                // Terza parte del messaggio
                const welcomeMessage3 = `📌 Nel "generale" ci saranno le discussioni generali.
📑 Nel "documenti" ci sarà l'inserimento di tutti i documenti che servono in modo da trovarli facilmente
📊 Nel "marketing" invece è il canale per quanto riguarda le Ads ed i vari Script
🎬 Nel "editing" inserirai gli script registrati come descritto nel documento "Info utili"
🎯 Nel "vendita" troverai tutto il supporto necessario per migliorare le tue performance di vendita

**Leggi bene tutti i documenti, ci sono molte info importanti. Per iniziare leggi la Roadmap.** :slight_smile:

Ancora complimenti per la scelta fatta e benvenuto/a!

Per qualsiasi domanda o dubbio rimaniamo tutti a disposizione.`;

                // Invia i messaggi uno dopo l'altro
                await channel.send(welcomeMessage1);
                await channel.send(welcomeMessage2);
                await channel.send(welcomeMessage3);
                // Carica i documenti
                const documentsPath = path.join(__dirname, 'templates');
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
                    },
                    {
                        filename: 'Roadmap.pdf',
                        description: '🗺️ Roadmap'
                    }
                ];

                // Invia ogni documento
                for (const doc of documents) {
                    const filePath = path.join(documentsPath, doc.filename);
                    if (fs.existsSync(filePath)) {
                        const attachment = new AttachmentBuilder(filePath);
                        await channel.send({
                            content: doc.description,
                            files: [attachment]
                        });
                    }
                }
            }

            // Se è il canale marketing, invia il messaggio e il file KPI
            if (channelName === 'marketing') {
                const marketingMessage = `📊 Benvenuto nel canale Marketing di Incubator!

🎯 Per ottimizzare le tue campagne e monitorare i risultati, è fondamentale compilare il file KPI seguendo questa video guida:
👉 https://www.loom.com/share/49488834370d44bd83dcafe5e5afdc39?sid=9c3990ab-9bcc-4232-a8a8-62cb67088b4a

📈 Il file KPI è uno strumento essenziale che ci permette di:
• Analizzare le performance delle tue campagne
• Identificare rapidamente eventuali criticità
• Ottimizzare il tuo processo di acquisizione clienti
• Massimizzare il ritorno sul tuo investimento pubblicitario

⚠️ Ti raccomandiamo di salvare sia il file che il link immediatamente, sono strumenti fondamentali per il tuo successo.

❓ Hai domande o bisogno di supporto?
Non esitare a contattare <@1230826624061014087>, il nostro Marketing Manager. Ricordati sempre di taggarlo nei messaggi per ricevere assistenza immediata.

💪 Siamo qui per supportarti nel raggiungere i tuoi obiettivi di marketing!`;

                await channel.send(marketingMessage);

                // Invia il file KPI
                const kpiFilePath = path.join(documentsPath, 'KPI Template.xlsx');
                if (fs.existsSync(kpiFilePath)) {
                    const attachment = new AttachmentBuilder(kpiFilePath);
                    await channel.send({
                        content: '📊 KPI Template',
                        files: [attachment]
                    });
                }
            }
            // Se è il canale vendita, invia il messaggio specifico
            if (channelName === 'vendita') {
                const salesMessage = `🎯 Ciao a tutti e benvenuti nel canale Vendite di Incubator!

Mi chiamo Luca Testa e sono il Sales Manager del team. Questo canale è stato creato per supportarvi in ogni aspetto del processo di vendita: dall'impostazione delle chiamate di vendita e di setting, fino all'utilizzo del CRM per analizzare i dati e migliorare le vostre performance.

Inoltre, organizzeremo sessioni live di role play e di Q&A per aiutarvi ad approcciare la vendita in maniera efficace e risolutiva. In questo canale, dovrete caricare le chiamate che farete, in modo che possano essere analizzate da me e dal team per fornirvi feedback utili. Vi darò istruzioni da seguire che ci permetteranno di migliorare le vostre performance e le vostre offerte.  

Sentitevi liberi di fare domande, condividere le vostre esperienze o chiedere consigli. Siamo qui per aiutarvi a crescere e raggiungere i vostri obiettivi di vendita insieme! 💪

Di seguito trovate la roadmap con tutti i punti da seguire per implementare e migliorare i vostri processi di vendita.

Non esitate a taggarmi per qualsiasi dubbio o domanda. Ancora una volta, benvenuti a bordo e complimenti per la scelta fatta! 🚀

Luca Testa`;
                
                await channel.send(salesMessage);

                // Invia la Roadmap Vendite
                const salesRoadmapPath = path.join(documentsPath, 'Roadmap Vendite Incubator.pdf');
                if (fs.existsSync(salesRoadmapPath)) {
                    const attachment = new AttachmentBuilder(salesRoadmapPath);
                    await channel.send({
                        content: '📊 Roadmap Vendite Incubator',
                        files: [attachment]
                    });
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
