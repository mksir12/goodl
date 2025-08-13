const axios = require("axios");

module.exports = function (app) {

    // Identify song from a pasted link
    app.get("/ai/identify-song", async (req, res) => {
        try {
            const link = req.query.link;

            if (!link) {
                return res.status(400).json({
                    status: false,
                    error: "Link parameter is required : JerryCoder"
                });
            }

            const identifyUrl = `https://jerrycoderr.onrender.com/identify?url=${encodeURIComponent(link)}`;

            const { data } = await axios.get(identifyUrl);

            res.json(data);

        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message,
                creator: "JerryCoder"
            });
        }
    });

};
