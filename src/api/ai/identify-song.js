const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

module.exports = function (app) {

    // Identify song from either URL or file upload
    app.post("/ai/identify-song", async (req, res) => {
        try {
            const link = req.query.link || req.body?.link;

            // If link provided, just call identify directly
            if (link) {
                const identifyUrl = `https://jerrycoderr.onrender.com/identify?url=${encodeURIComponent(link)}`;
                const { data } = await axios.get(identifyUrl);
                return res.json(data);
            }

            // Otherwise check file upload
            if (!req.files || !req.files.file) {
                return res.status(400).json({ 
                    status: false, 
                    error: "Provide either ?link=URL or upload a file as 'file'", 
                    creator: "JerryCoder"
                });
            }

            const filePath = req.files.file.tempFilePath || req.files.file.path;
            const fileName = req.files.file.name;
            const mimeType = req.files.file.mimetype;

            // Step 1: Upload file to temp
            const formData = new FormData();
            formData.append("file", fs.createReadStream(filePath), {
                filename: fileName,
                contentType: mimeType
            });

            const uploadRes = await axios.post(
                "https://jerrycoderr.onrender.com/upload_to_temp",
                formData,
                { headers: formData.getHeaders() }
            );

            if (!uploadRes.data || uploadRes.data.status !== "success") {
                return res.status(500).json({
                    status: false,
                    step: "upload_to_temp",
                    error: uploadRes.data || "Upload failed",
                    creator: "JerryCoder"
                });
            }

            const fileUrl = uploadRes.data.file_url;

            // Step 2: Identify song from file_url
            const identifyRes = await axios.get(
                `https://jerrycoderr.onrender.com/identify?url=${encodeURIComponent(fileUrl)}`
            );

            return res.json(identifyRes.data);

        } catch (error) {
            return res.status(500).json({ 
                status: false, 
                error: error.message,
                creator: "JerryCoder"
            });
        }
    });

};
