const yts = require('yt-search');

module.exports = function (app) {
  // Enable CORS
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
      // Related search terms for broader results
      const relatedQueries = [
        q,
        `${q} song`,
        `${q} lyrics`,
        `${q} slowed reverb`,
        `${q} official video`
      ];

      // Run all searches in parallel for speed
      const resultsArray = await Promise.all(
        relatedQueries.map(query => yts.search({ query, pages: 2 }))
      );

      // Merge all videos
      let allVideos = resultsArray.flatMap(r => r.videos || []);

      // Remove duplicates based on videoId
      const uniqueVideos = Array.from(
        new Map(allVideos.map(v => [v.videoId, v])).values()
      );

      // Limit to 25 results
      const ytTracks = uniqueVideos.slice(0, 25).map(video => ({
        title: video.title,
        channel: video.author?.name || '',
        duration: video.timestamp,
        imageUrl: video.thumbnail,
        link: video.url
      }));

      res.status(200).json({
        status: true,
        creator: 'JerryCoder',
        total: ytTracks.length,
        result: ytTracks
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
