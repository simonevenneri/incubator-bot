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
    
    // Test iniziale dei percorsi dei file
    const documentsPath = path.join(__dirname, 'templates');
    console.log('Path base:', __dirname);
    console.log('Documents path:', documentsPath);
    console.log('Contenuto cartella templates:', fs.readdirSync(documentsPath));
});

// Gestione nuovo membro
client.on('guildMemberAdd', async member => {
    try {
        console.log('Nuovo membro aggiunto:', member.displayName);
        console.log('Member ID:', member.id);

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

        console.log('Categoria creata:', category.name);
        // Array dei canali da creare
        const channels = ['generale', 'documenti', 'marketing', 'editing', 'vendita'];
        console.log('Canali da creare:', channels);
        
        // Definisci documentsPath qui, fuori dai blocchi if
        const documentsPath = path.join(__dirname, 'templates');
        console.log('Path documenti globale:', documentsPath);
        
        // Crea ogni canale nella categoria
        for (const channelName of channels) {
            try {
                console.log(`Tentativo creazione canale: \${channelName}`);
                const channel = await member.guild.channels.create({
                    name: channelName,
                    type: 0,
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
                console.log(`Canale creato con successo: \${channelName}`);

                // Se è il canale generale, invia il messaggio di benvenuto e i documenti
                if (channelName === 'generale') {
                    console.log('Invio messaggi nel canale generale');
                    
                    // Prima parte del messaggio
                    const welcomeMessage1 = `Ciao ${member.displayName}! 

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

                    // Aspetta 2 secondi prima di inviare i documenti
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    // Carica i documenti
                    console.log('Inizio caricamento documenti nel canale generale');
                    console.log('Path documenti:', documentsPath);
                    console.log('Contenuto cartella:', fs.readdirSync(documentsPath));

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
                        try {
                            const filePath = path.join(documentsPath, doc.filename);
                            console.log('Tentativo invio documento:', doc.filename);
                            console.log('Percorso file:', filePath);
                            console.log('File esiste:', fs.existsSync(filePath));
                            
                            if (fs.existsSync(filePath)) {
                                const attachment = new AttachmentBuilder(filePath);
                                await channel.send({
                                    content: doc.description,
                                    files: [attachment]
                                });
                                console.log('Documento inviato:', doc.filename);
                                
                                // Aspetta 1 secondo tra ogni documento
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        } catch (error) {
                            console.error(`Errore invio documento \${doc.filename}:`, error);
                        }
                    }
                }
                // Se è il canale marketing
                if (channelName === 'marketing') {
                    try {
                        console.log('⭐ Inizio configurazione canale marketing');
                        const marketingMessage = `📊 Benvenuto/a nel canale Marketing!

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

                        // Prima invia il messaggio
                        await channel.send(marketingMessage);
                        console.log('✅ Messaggio marketing inviato');

                        // Aspetta 2 secondi
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        // Tenta di inviare il file KPI
                        const kpiFilePath = path.join(documentsPath, 'KPI Template.xlsx');
                        console.log('📁 Tentativo invio KPI Template da:', kpiFilePath);
                        console.log('📂 File KPI esiste:', fs.existsSync(kpiFilePath));
                        
                        if (fs.existsSync(kpiFilePath)) {
                            const attachment = new AttachmentBuilder(kpiFilePath);
                            await channel.send({
                                content: '📊 **KPI Template**\nUtilizza questo file per tracciare le tue performance',
                                files: [attachment]
                            });
                            console.log('✅ KPI Template inviato con successo');
                        } else {
                            console.error('❌ File KPI non trovato:', kpiFilePath);
                            console.error('Files disponibili:', fs.readdirSync(documentsPath));
                        }
                    } catch (error) {
                        console.error('❌ Errore nel canale marketing:', error);
                        console.error('Dettagli errore:', error.message);
                    }
                }
                // Se è il canale vendita
                if (channelName === 'vendita') {
                    try {
                        console.log('⭐ Inizio configurazione canale vendita');
                        const salesMessage = `🎯 Benvenuto/a nel canale Vendite!

Mi chiamo Luca Testa e sono il Sales Manager del team. Questo canale è stato creato per supportarti in ogni aspetto del processo di vendita: dall'impostazione delle chiamate di vendita e di setting, fino all'utilizzo del CRM per analizzare i dati e migliorare le tue performance.

Inoltre, organizzeremo sessioni live di role play e di Q&A per aiutarti ad approcciare la vendita in maniera efficace e risolutiva. In questo canale, dovrai caricare le chiamate che farai, in modo che possano essere analizzate da me e dal team per fornirti feedback utili. Ti darò istruzioni da seguire che ci permetteranno di migliorare le tue performance e le tue offerte.  

Sentiti libero/a di fare domande, condividere le tue esperienze o chiedere consigli. Siamo qui per aiutarti a crescere e raggiungere i tuoi obiettivi di vendita insieme!

Di seguito trovi la roadmap con tutti i punti da seguire per implementare e migliorare i tuoi processi di vendita.

Non esitare a taggarmi per qualsiasi dubbio o domanda. Ancora una volta, benvenuto/a a bordo e complimenti per la scelta fatta!

Luca Testa`;
                        
                        // Prima invia il messaggio
                        await channel.send(salesMessage);
                        console.log('✅ Messaggio vendita inviato');

                        // Aspetta 2 secondi
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        // Tenta di inviare la Roadmap
                        const salesRoadmapPath = path.join(documentsPath, 'Roadmap Vendite Incubator.pdf');
                        console.log('📁 Tentativo invio Roadmap Vendite da:', salesRoadmapPath);
                        console.log('📂 File Roadmap esiste:', fs.existsSync(salesRoadmapPath));
                        
                        if (fs.existsSync(salesRoadmapPath)) {
                            const attachment = new AttachmentBuilder(salesRoadmapPath);
                            await channel.send({
                                content: '📊 **Roadmap Vendite**\nSegui questa roadmap per migliorare il tuo processo di vendita',
                                files: [attachment]
                            });
                            console.log('✅ Roadmap Vendite inviata con successo');
                        } else {
                            console.error('❌ File Roadmap non trovato:', salesRoadmapPath);
                            console.error('Files disponibili:', fs.readdirSync(documentsPath));
                        }
                    } catch (error) {
                        console.error('❌ Errore nel canale vendita:', error);
                        console.error('Dettagli errore:', error.message);
                    }
                }
            } catch (error) {
                console.error(`Errore nella gestione del canale \${channelName}:`, error);
                console.error('Dettagli errore:', error.message);
                if (error.code) console.error('Codice errore:', error.code);
            }
        }
    } catch (error) {
        console.error('Errore nella creazione della struttura:', error);
        console.error('Dettagli errore:', error.message);
        if (error.code) console.error('Codice errore:', error.code);
    }
});

// Gestione errori
client.on('error', error => {
    console.error('Errore del bot:', error);
    console.error('Dettagli errore:', error.message);
    if (error.code) console.error('Codice errore:', error.code);
});

// Login del bot
client.login(token);

