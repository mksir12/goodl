const yts = require('yt-search');

module.exports = function (app) {
  // Enable CORS for all requests
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  app.get('/search/youtube', async (req, res) => {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ status: false, error: 'Query is required' });
    }

    try {
      const ytResults = await yts.search(q);

      const ytTracks = (ytResults.videos || []).slice(0, 25).map(video => ({
        title: video.title,
        channel: video.author.name,
        duration: video.timestamp,
        imageUrl: video.thumbnail,
        link: video.url
      }));

      res.status(200).json({
        status: true,
        creator: 'JerryCoder',
        total: ytTracks.length, // 👈 Total number of videos returned
        result: ytTracks
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
