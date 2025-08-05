const axios = require('axios');

module.exports = function (app) {
  app.get('/ai/upscale', async (req, res) => {
    try {
      const { image } = req.query;

      if (!image) {
        return res.status(400).json({
          status: false,
          error: 'Image URL is required : JerryCoder'
        });
      }

      // Step 1: Get upscaled image URL from jerryc API
      const apiUrl = `https://jerrycoder.oggyapi.workers.dev/jerryc?img=${encodeURIComponent(image)}`;
      const apiResponse = await axios.get(apiUrl);

      const imageUrl = apiResponse.data?.url;
      if (!imageUrl) {
        return res.status(500).json({ status: false, error: 'Upscaled image URL not found' });
      }

      // Step 2: Fetch the image itself from the returned URL
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

      res.setHeader('Content-Type', imageResponse.headers['content-type'] || 'image/jpeg');
      res.setHeader('Content-Disposition', 'inline; filename="JerryCoder-upscaleimage.jpg"');
      res.send(imageResponse.data);

    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message || 'Unknown error'
      });
    }
  });
};
