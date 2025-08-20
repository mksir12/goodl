/**
 * Nsfwhub NSFW API - Image → GIF Converter
 * • Creator: JerryCoder
 * • Telegram: https://t.me/oggy_workshop
 * • Copyright © 2025 by JerryCoder
 */

const axios = require("axios");
const GIFEncoder = require("gifencoder");
const { createCanvas, loadImage } = require("canvas");

module.exports = function (app) {
  // 🔥 Convert fetched image to GIF
  async function fetchAsGif() {
    try {
      const response = await axios.get(
        "https://jerryproxy.vercel.app/api/proxy?url=https://api.nekorinn.my.id/nsfwhub/cum",
        { responseType: "arraybuffer" }
      );

      const buffer = Buffer.from(response.data);
      const img = await loadImage(buffer);

      // Setup encoder
      const encoder = new GIFEncoder(img.width, img.height);
      encoder.start();
      encoder.setRepeat(0);   // loop forever
      encoder.setDelay(1000); // 1 second per frame
      encoder.setQuality(10);

      // Draw frame
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      encoder.addFrame(ctx);

      encoder.finish();

      return encoder.out.getData(); // final GIF buffer
    } catch (err) {
      throw new Error("❌ Failed to fetch or convert image → gif: " + err.message);
    }
  }

  // 📦 API Route
  app.get("/nsfw/cum", async (req, res) => {
    try {
      const gifBuffer = await fetchAsGif();

      res.writeHead(200, {
        "Content-Type": "image/gif",
        "Content-Length": gifBuffer.length,
        "Content-Disposition": "inline; filename=nsfw.gif",
      });

      res.end(gifBuffer);
    } catch (error) {
      res.status(500).send("❌ JerryCoder GIF Route Error: " + error.message);
    }
  });
};
