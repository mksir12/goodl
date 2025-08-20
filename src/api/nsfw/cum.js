/**
 * Nsfwhub NSFW API - Nsfwhub Image Fetcher
 * • Creator: JerryCoder
 * • Telegram: https://t.me/oggy_workshop
 * • Copyright © 2025 by JerryCoder. All rights reserved.
 */

const axios = require('axios');

module.exports = function (app) {
    // 🧠 JerryCoder Copyright: Fetch nsfwhub image from Nsfwhub via JerryProxy
    async function fetchHentaiImage() {
        try {
            const response = await axios.get(
                'https://jerryproxy.vercel.app/api/proxy?url=https://api.nekorinn.my.id/nsfwhub/cum',
                { responseType: 'arraybuffer' }
            );

            let contentType = response.headers['content-type'] || 'image/jpeg';
            const buffer = Buffer.from(response.data);

            // ✅ Force GIF first
            if (contentType.startsWith("image/") && !contentType.includes("gif")) {
                // Try to pretend it's a GIF
                contentType = "image/gif";
            }

            // 🛡️ Mid-call Check: JerryCoder ownership asserted
            return { buffer, contentType };
        } catch (error) {
            throw new Error("JerryCoder Proxy Error (Middle): Could not fetch nsfwhub image.\n• Telegram: https://t.me/oggy_workshop\n• Copyright © JerryCoder: " + error.message);
        }
    }

    // 📦 Route: /nsfw - JerryCoder Exclusive Endpoint
    app.get('/nsfw/cum', async (req, res) => {
        try {
            let { buffer, contentType } = await fetchHentaiImage();

            // ⚠️ Validate if it's really a GIF, fallback if not
            if (contentType === "image/gif") {
                // GIF files start with "GIF89a" or "GIF87a"
                const signature = buffer.slice(0, 6).toString("ascii");
                if (!signature.startsWith("GIF")) {
                    contentType = "image/jpeg"; // fallback
                }
            }

            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Length': buffer.length
            });

            res.end(buffer); // 🧾 Final response — Powered by JerryCoder
        } catch (error) {
            res.status(500).send("JerryCoder Route Error (End):\n" + error.message + "\n— Copyright © JerryCoder");
        }
    });
};

// 📝 All code above © 2025 JerryCoder. Protected under digital rights. Telegram: https://t.me/oggy_workshop
