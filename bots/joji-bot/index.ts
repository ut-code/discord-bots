import Parser from 'rss-parser';

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const CHANNEL_ID = 'UCGxzWLH1_1ABKKfSiy2WIAw';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const LAST_ID_FILE = process.env.LAST_ID_FILE || 'last_video_id.txt';

async function main() {
    const parser = new Parser();
    const response = await fetch(RSS_URL);
    const feedText = await response.text();
    const feed = await parser.parseString(feedText);
    if (!feed.items || feed.items.length === 0) {
        console.log('No entries found in RSS feed');
        return;
    }

    const latestVideo = feed.items[0];
    const latestId = latestVideo.id?.split(':').pop();
    const videoUrl = latestVideo.link;
    const videoTitle = latestVideo.title;
    console.log(`Latest video: ${videoTitle} (ID: ${latestId})`);

    let lastId = '';
    try {
        lastId = await Bun.file(LAST_ID_FILE).text();
    } catch {}
    if (lastId === latestId) {
        console.log(`No new video (last ID: ${lastId})`);
        return;
    }

    const message = {
        content: `**${videoTitle}**\nNew video uploaded!\n${videoUrl}`
    };
    const res = await fetch(WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
    });
    console.log(`Discord response: ${res.status}`);

    if (res.status === 204) {
        await Bun.write(LAST_ID_FILE, latestId!);
        console.log('Notification sent successfully!');
    } else {
        const errorText = await res.text();
        console.log(`Failed to send notification: ${errorText}`);
    }
}

main()

