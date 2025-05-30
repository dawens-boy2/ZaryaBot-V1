const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch GitHub repository information",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/dawens-boy2/ZaryaBot-V1'; // 🔁 Updated repo name

    try {
        const match = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return reply("❌ Erreur : L'URL du repo est invalide.");

        const [, username, repoName] = match;

        const response = await fetch(`https://api.github.com/repos/${dawens-boy2}/${ZaryaBot-V1}`, {
            headers: { 'User-Agent': 'ZaryaBot-V1' }
        });

        if (response.status === 503) {
            return reply("❌ GitHub est temporairement indisponible (503). Réessaie plus tard.");
        }

        if (!response.ok) {
            return reply(`❌ Échec de récupération des infos du repo. Code: ${response.status}`);
        }

        const repoData = await response.json();

        const message = `┌──────────────────────┐
│  💫 𝐙𝐀𝐑𝐘𝐀𝐁𝐎𝐓-𝗩𝟏 𝗥𝗘𝗣𝗢 💫  
├──────────────────────
│ • Name: ${repoData.name}
│ • Owner: ${repoData.owner.login}
│ • Stars: ${repoData.stargazers_count}
│ • Forks: ${repoData.forks_count}
│ • URL: ${repoData.html_url}
│ • Desc: ${repoData.description || 'None'}
└──────────────────────┘
> *Powered by 𝐙𝐚𝐫𝐲𝐚𝐁𝐨𝐭-𝐕𝟏 🔧*`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/pbamxw.jpeg' },
            caption: message,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401658098220@newsletter',
                    newsletterName: config.OWNER_NAME || '𝐙𝐚𝐫𝐲𝐚𝐁𝐨𝐭-𝐕𝟏',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Repo command error:", error);
        reply("❌ Une erreur est survenue lors de la récupération du dépôt.");
    }
});
