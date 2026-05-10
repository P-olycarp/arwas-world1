const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { persistSanitizedMarketingIfNeeded } = require('../utils/marketingCopyDefaults');

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Protect all settings routes (admin only)
router.use(authenticateToken, requireAdmin);

// Get all settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // Create default settings if they don't exist
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    const payload = await persistSanitizedMarketingIfNeeded(settings);
    res.json(payload);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update specific setting section
router.put('/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const updateData = req.body;

    // Validate section
    const validSections = [
      'hero', 'welcome', 'services', 'customApparel', 'designServices', 'shopCustomApparel', 'shopDesignServices', 'collections'
    ];
    if (!validSections.includes(section)) {
      return res.status(400).json({ error: 'Invalid section' });
    }

    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    // Update the specific section
    settings[section] = {
      ...settings[section],
      ...updateData
    };

    settings.updatedAt = new Date();
    settings.updatedBy = 'admin'; // This should come from auth token in production
    
    await settings.save();

    res.json({ 
      success: true, 
      message: `${section} settings updated successfully`,
      settings 
    });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Update entire settings
router.put('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    settings.updatedAt = new Date();
    settings.updatedBy = 'admin';
    
    await settings.save();

    res.json({ 
      success: true, 
      message: 'Settings updated successfully',
      settings 
    });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Reset settings to defaults
router.post('/reset', async (req, res) => {
  try {
    await Settings.deleteMany({});
    const settings = new Settings();
    await settings.save();

    res.json({ 
      success: true, 
      message: 'Settings reset to defaults',
      settings 
    });
  } catch (err) {
    console.error('Error resetting settings:', err);
    res.status(500).json({ error: 'Failed to reset settings' });
  }
});

// Upload image
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      imageUrl,
      message: 'Image uploaded successfully'
    });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: err.message || 'Failed to upload image' });
  }
});

// Upload image for specific section (hero, welcome, customApparel, or designServices)
router.post('/upload/:section', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { section } = req.params;
    const validSections = ['hero', 'welcome', 'customApparel', 'designServices', 'shopCustomApparel', 'shopDesignServices'];
    if (!validSections.includes(section)) {
      return res.status(400).json({ error: 'Invalid section' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Update the settings with the new image
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    // Map section to correct image field
    let imageField = 'image'; // default for customApparel and designServices
    if (section === 'hero') {
      imageField = 'backgroundImage';
    } else if (section === 'welcome') {
      imageField = 'featuredImage';
    }

    settings[section][imageField] = imageUrl;
    settings.updatedAt = new Date();
    settings.updatedBy = 'admin';

    await settings.save();

    res.json({
      success: true,
      imageUrl,
      message: `${section} image uploaded successfully`,
      settings
    });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: err.message || 'Failed to upload image' });
  }
});

module.exports = router;
