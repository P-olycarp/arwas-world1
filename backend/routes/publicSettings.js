const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { persistSanitizedMarketingIfNeeded } = require('../utils/marketingCopyDefaults');

// Public settings read-only endpoint
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    const payload = await persistSanitizedMarketingIfNeeded(settings);
    res.json(payload);
  } catch (err) {
    console.error('Error fetching public settings:', err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

module.exports = router;
