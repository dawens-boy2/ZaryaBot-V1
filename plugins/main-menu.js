const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');

cmd({
  pattern: "menu",
  alias: ["allmenu", "Zarya"],
  use: '.menu',
  desc: "Show all bot commands",
  category: "menu",
  react: "⚡",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const totalCommands = commands.length;
    const date = moment().tz("America/Port-au-Prince").format("dddd, DD MMMM YYYY");

    // Calculate uptime in h m s
    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    // Build the menu header
    let menuText = `
*╭══ 𝐙𝐀𝐑𝐘𝐀𝐁𝐎𝐓-𝐕𝟏*
*┃❃* *User:* @${m.sender.split("@")[0]}
*┃❃* *Date:* ${date}
*┃❃* *Uptime:* ${uptime()}
*┃❃* *Mode:* *${config.MODE}*
*┃❃* *Prefix:* *${config.PREFIX}*
*┃❃* *Plugins:* ${totalCommands}
*┃❃* *Developer:* *dawens*
*┃❃* *Version:* *1.0.0*
*╰════════════════⊷*
`;

    // Organize commands by category
    let category = {};
    for (let cmd of commands) {
      if (!cmd.category) continue;
      if (!category[cmd.category]) category[cmd.category] = [];
      category[cmd.category].push(cmd);
    }

    // Sort and append categories and commands to menu text
    const keys = Object.keys(category).sort();
    for (let k of keys) {
      menuText += `\n\n*╭─* ${k.toUpperCase()} MENU*`;
      const cmds = category[k].filter(c => c.pattern).sort((a, b) => a.pattern.localeCompare(b.pattern));
      cmds.forEach((cmd) => {
        const usage = cmd.pattern.split('|')[0];
        menuText += `\n├❃ \`${config.PREFIX}${usage}\``;
      });
      menuText += `\n*┕──────────────❒*`;
    }

    // Send image with menu text as caption
    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/pbamxw.jpeg' },
      caption: menuText,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363401658098220@newsletter',
          newsletterName: '𝐙𝐀𝐑𝐘𝐀𝐁𝐎𝐓-𝐕𝟏',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
