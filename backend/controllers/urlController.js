const Url = require('../models/url');
const shortid = require('shortid');

// POST /api/shorten
exports.shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ error: 'originalUrl is required' });
    }

    // Basic URL validation
    let urlToStore = originalUrl;
    if (!/^https?:\/\//i.test(urlToStore)) {
      urlToStore = 'https://' + urlToStore;
    }

    let shortId;
    let exists = true;
    while (exists) {
      shortId = shortid.generate();
      exists = await Url.exists({ shortId });
    }

    const url = await Url.create({ shortId, originalUrl: urlToStore });
    res.status(201).json({
      shortUrl: `${req.protocol}://${req.get('host')}/api/${shortId}`,
      originalUrl: url.originalUrl,
      shortId: url.shortId,
    });
  } catch (err) {
    console.error('shortenUrl error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/:shortId  (redirect)
exports.redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    url.clicks += 1;
    await url.save();
    return res.redirect(301, url.originalUrl);
  } catch (err) {
    console.error('redirectUrl error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/stats/:shortId
exports.getUrlStats = async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    res.json({
      shortId: url.shortId,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
    });
  } catch (err) {
    console.error('getUrlStats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};