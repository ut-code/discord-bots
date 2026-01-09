const { google } = require('googleapis');
const { WebhookClient } = require('discord.js');
const dayjs = require('dayjs');
const dotenv = require('dotenv')
dotenv.config({path: process.env.ENV_FILE});

const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  credentials: {
  	client_email: process.env.GOOGLE_CLIENT_EMAIL,
  	private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }
});

const endDate = dayjs().format('YYYY-MM-DD');
const startDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD');

async function getSearchPerformance() {
  const client = await auth.getClient();
  const searchconsole = google.searchconsole({ version: 'v1', auth: client });

  const res = await searchconsole.searchanalytics.query({
    siteUrl: "sc-domain:utcode.net",
    requestBody: {
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: 25000,
    },
  });

  const grouped = {};

  for (const row of res.data.rows || []) {
    const url = row.keys[0];
    const subdomain = new URL(url).hostname.split('.').slice(0, -2).join('.') || 'utcode.net';

    if (!grouped[subdomain]) {
      grouped[subdomain] = { clicks: 0, impressions: 0 };
    }

    grouped[subdomain].clicks += row.clicks;
    grouped[subdomain].impressions += row.impressions;
  }

  return grouped;
}

async function sendToDiscord(data) {
  const webhook = new WebhookClient({ url: process.env.WEBHOOK_URL });

  const fields = Object.entries(data)
    .filter(([sub, stats]) => stats.clicks > 0)
    .sort(([sub1, stats1], [sub2, stats2]) => stats2.clicks - stats1.clicks)
    .slice(0, 10)
    .map(([sub, stats], i) => {
      let name;
      if (sub.startsWith("kf")) {
        name = `${sub} (駒場祭${2000 + parseInt(sub.slice(2)) - 51})`;
      } else if (sub.startsWith("mf")) {
        name = `${sub} (五月祭${2000 + parseInt(sub.slice(2)) - 73})`;
      } else if (channelIds[sub]) {
        name = `${sub} ${channelIds[sub]}`;
      } else {
        name = sub;
      }
      return {
        name: `${i + 1}: ${name}`,
        value: `クリック数: ${stats.clicks}`,
        inline: true,
      };
    });

  await webhook.send({
    embeds: [{
      title: "1週間の検索パフォーマンス",
      description: `${startDate} 〜 ${endDate}`,
      fields
    }],
  });
}

const channelIds = {
  "utcode.net": "<#1347510096044883988>",
  "syllabus": "<#1356879628907712572>",
  "create-cpu": "<#1354435873323876462>",
  "coursemate": "<#1352695487056052366>",
  "learn": "<#1368523267911974912>",
  "ut-bridge": "<#1346690984217677864>",
  "extra": "<#1353557111052828716>",
  "itsuhima": "<#1356806556297072793>",
  "shortcut-game": "<#1364040140850462741>",
  "mf98": "<#1353342238477783172>",
  "kf76": "<#1373908089794985984>",
};

(async () => {
  const data = await getSearchPerformance();
  await sendToDiscord(data);
})();
