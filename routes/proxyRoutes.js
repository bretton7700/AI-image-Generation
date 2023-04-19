const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/image', async (req, res) => {
  try {
    const imageUrl = req.query.url;

    if (!imageUrl) {
      return res.status(400).send('URL is required');
    }

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    res.set('Content-Type', response.headers['content-type']);
    res.set('Access-Control-Allow-Origin', '*');
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching image');
  }
});

module.exports = router;
