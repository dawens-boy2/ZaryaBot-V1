const { cmd } = require('../command');
const fs = require("fs");
const path = require("path");

cmd({
    pattern: "deletereport",
    alias: ["delreport", "delreport"],
    desc: "Delete a specific report by its index",
    category: "owner",
    react: ["🗑"],
    filename: __filename,
    use: "<report number>"
}, async (conn, m, msg, { args, reply }) => {
    try {
        const devNumbers = ["50942241547", "13058962443", "50936865031"];
        const senderId = m.sender.split("@")[0];
        const reportPath = path.join(__dirname, "../data/reports.json");

        if (!devNumbers.includes(senderId)) {
            return reply("❌ Only developers can use this command.");
        }

        if (!fs.existsSync(reportPath)) {
            return reply("❌ No report file found.");
        }

        const index = parseInt(args[0]);
        if (isNaN(index) || index < 1) {
            return reply("❌ Please provide a valid report number (e.g. `.deletereport 2`)");
        }

        const reports = JSON.parse(fs.readFileSync(reportPath));

        if (index > reports.length) {
            return reply(`❌ There are only ${reports.length} reports.`);
        }

        const removed = reports.splice(index - 1, 1)[0];
        fs.writeFileSync(reportPath, JSON.stringify(reports, null, 2));

        reply(`✅ Deleted report #${index}:\n\n@${removed.user}\n🕒 ${removed.time}\n📩 ${removed.message}`, null, {
            mentions: [`${removed.user}@s.whatsapp.net`]
        });

    } catch (err) {
        console.error("Error deleting report:", err);
        reply("❌ Failed to delete the report.");
    }
});
