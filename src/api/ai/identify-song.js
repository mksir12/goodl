const axios = require("axios");

module.exports = function (app) {

    app.get("/ai/identify-song", async (req, res) => {
        try {
            const link = req.query.link;

            if (!link) {
                return res.status(400).send("<h3>❌ Link parameter is required : JerryCoder</h3>");
            }

            const identifyUrl = `https://jerrycoderr.onrender.com/identify?url=${encodeURIComponent(link)}`;
            const { data } = await axios.get(identifyUrl);

            if (data.status !== "success") {
                return res.status(500).send(`<h3>❌ Failed to identify song: ${data.error || "Unknown error"}</h3>`);
            }

            const { title, artist, image } = data.result;

            // HTML response with image + caption
            res.setHeader("Content-Type", "text/html");
            res.send(`
                <div style="text-align:center; font-family:sans-serif;">
                    <img src="${image}" alt="${title}" style="max-width:100%; border-radius:10px;">
                    <h2 style="margin:10px 0 5px 0;">${title}</h2>
                    <p style="color:gray; font-size:16px;">${artist}</p>
                </div>
            `);

        } catch (error) {
            res.status(500).send(`<h3>❌ Server error: ${error.message}</h3>`);
        }
    });

};
