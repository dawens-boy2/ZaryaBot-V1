const { cmd } = require("../command");
const config = require("../config");
const fs = require("fs");
const path = require("path");

const reportFile = path.join(__dirname, "../data/reports.json");

cmd({
    pattern: "report",
    alias: ["ask", "bug", "request"],
    desc: "Report a bug or request a feature",
    category: "utility",
    react: ["👨‍💻"],
    filename: __filename
}, async (conn, m, msg, { args, reply }) => {
    try {
        if (!args.length) {
            return reply(`❌ Example: ${config.PREFIX}report Play command not working`);
        }

        const devNumbers = ["50942241547", "13058962443", "50936865031"];
        const messageId = m.key?.id;
        const sender = m.sender;
        const time = new Date().toLocaleString("en-US", { timeZone: "UTC" });

        // Empêche le double envoi
        global.reportedMessages = global.reportedMessages || {};
        if (global.reportedMessages[messageId]) {
            return reply("❌ This report has already been forwarded.");
        }
        global.reportedMessages[messageId] = true;

        const reportText = `*| REQUEST / BUG REPORT |*\n\n*User*: @${sender.split("@")[0]}\n*Time:* ${time}\n*Message:* ${args.join(" ")}`;
        const confirmation = `✅ Thanks ${msg.pushName || "user"}, your report has been sent to the developers.`;

        // Sauvegarde dans le fichier
        const reports = fs.existsSync(reportFile) ? JSON.parse(fs.readFileSync(reportFile)) : [];
        reports.push({
            user: sender.split("@")[0],
            message: args.join(" "),
            time
        });
        fs.writeFileSync(reportFile, JSON.stringify(reports, null, 2));

        // Envoie aux développeurs
        for (const number of devNumbers) {
            await conn.sendMessage(`${number}@s.whatsapp.net`, {
                text: reportText,
                mentions: [sender]
            });
        }

        reply(confirmation);
    } catch (error) {
        console.error("Report Error:", error);
        reply("❌ Failed to send your report.");
    }
});

//reportlist

cmd({
    pattern: "reportlist",
    desc: "Show all bug reports/requests",
    category: "utility",
    filename: __filename
}, async (conn, m, _m, { reply }) => {
    try {
        const filePath = "./data/reports.json";

        if (!fs.existsSync(filePath)) return reply("No reports found.");
        const data = JSON.parse(fs.readFileSync(filePath));

        if (!data.length) return reply("Report list is empty.");

        let text = "*📋 Report List:*\n\n";
        data.forEach((item, i) => {
            text += `*${i + 1}. From:* @${item.user}\n*Message:* ${item.message}\n*Date:* ${new Date(item.timestamp).toLocaleString()}\n\n`;
        });

        await conn.sendMessage(m.chat, { text, mentions: data.map(x => x.user + "@s.whatsapp.net") }, { quoted: m });
    } catch (err) {
        console.error(err);
        reply("❌ Error reading the report list.");
    }
});
