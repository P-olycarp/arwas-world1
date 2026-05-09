# Admin Home Page Settings - Complete Feature Guide

## Overview
Admins can now fully customize the home page including hero section, welcome section, and upload images for both. The "Start Your Design" button is now fully functional.

## Backend Features

### New Route: `/api/settings`

**Endpoints:**

1. **GET /api/settings** - Retrieve all settings
   - Returns hero, welcome, and services configurations
   - Auto-creates defaults if none exist

2. **PUT /api/settings/:section** - Update specific section
   - Sections: `hero`, `welcome`, `services`
   - Example: `PUT /api/settings/hero`

3. **POST /api/settings/upload** - Upload generic image
   - Returns image URL for manual insertion

4. **POST /api/settings/upload/:section** - Upload and auto-save image
   - Sections: `hero`, `welcome`
   - Auto-saves to correct field
   - For hero: saves to `backgroundImage`
   - For welcome: saves to `featuredImage`

5. **POST /api/settings/reset** - Reset to defaults

### File Storage
- Uploads stored in: `/backend/public/uploads/`
- Static directory served at: `/uploads/`
- Unique filenames generated with timestamp + random ID
- Supported formats: JPEG, PNG, GIF, WebP

## Frontend Features

### Admin Home Settings Page (`/admin/home-settings`)

**Features:**
- Tabbed interface for Hero and Welcome sections
- Live preview mode
- Direct text editing for all fields
- Two image input methods:
  1. URL input (paste external links)
  2. File upload (drag & drop or browse)

**Hero Section Editable Fields:**
- Tagline (small text above title)
- Main Title (large headline)
- Subtitle (description)
- Button Text
- Background Image (URL or upload)

**Welcome Section Editable Fields:**
- Section Title
- Description (supports emoji)
- Button Text
- Featured Image (URL or upload)

### Components Affected

1. **Home.jsx**
   - Now fetches welcome data from settings
   - Displays featured image if available
   - Responsive and dynamic

2. **Hero.jsx**
   - Now fetches hero data from settings
   - Loading state with spinner
   - Background image is fully customizable

3. **Checkout.jsx & Orders.jsx**
   - "Start Your Design" button removed (no longer needed)
   - All ordering goes to WhatsApp only

### API Service (`api.js`)

New functions added:
- `getSettings()` - Fetch all settings
- `updateSettings(data)` - Update all settings
- `updateSettingsSection(section, data)` - Update single section
- `uploadSettingsImage(file, section)` - Upload image
- `resetSettings()` - Reset to defaults

## Usage Guide

### For Admins

1. **Access Settings**
   - Navigate to `/admin/home-settings`
   - Or click "Home Settings" in admin sidebar

2. **Edit Hero Section**
   - Click "Hero Section" tab
   - Modify text fields (tagline, title, subtitle, button)
   - Upload background image or paste URL
   - Click "Save Changes"

3. **Edit Welcome Section**
   - Click "Welcome Section" tab
   - Modify title and description
   - Upload featured image or paste URL
   - Click "Save Changes"

4. **Preview Changes**
   - Click "Preview" button to see live preview
   - Click "Edit Mode" to return to editing

5. **Upload Images**
   - Click blue "Choose Image File" button
   - Select image from computer
   - Auto-saves to database and displays
   - Uploaded images are stored on server

### For Users

**Home Page Updates:**
- Hero section displays custom image, text, and button
- "Start Your Design" button links to `/shop`
- Welcome section displays custom content
- Featured image displays below welcome text (if set)

## Technical Details

### Database Schema (Settings Model)

```javascript
{
  hero: {
    tagline: String,
    title: String,
    subtitle: String,
    buttonText: String,
    backgroundImage: String (URL)
  },
  welcome: {
    title: String,
    description: String,
    buttonText: String,
    featuredImage: String (URL)
  },
  services: {
    title: String,
    description: String,
    items: Array
  },
  updatedAt: Date,
  updatedBy: String,
  timestamps: true
}
```

### File Upload Configuration
- Max file size: 50MB (inherited from express.json limit)
- Storage: Disk storage in `public/uploads/`
- File naming: `[timestamp]-[randomId].[extension]`
- MIME type validation: Only images allowed

## Browser Compatibility

Works with:
- Firefox (file upload)
- Chrome/Chromium (file upload)
- Safari (file upload)
- Edge (file upload)

## Error Handling

- Invalid sections return 400 error
- Missing files return 400 error
- Non-image files rejected at upload
- All errors logged to console
- User-friendly error messages in admin UI

## Testing

### Test Upload
```bash
curl -X POST -F "image=@image.png" http://localhost:5000/api/settings/upload/hero
```

### Test Settings Fetch
```bash
curl http://localhost:5000/api/settings
```

### Test Update
```bash
curl -X PUT http://localhost:5000/api/settings/hero \
  -H "Content-Type: application/json" \
  -d '{"title": "New Title"}'
```

## Future Enhancements

- Add more sections (hero variants, featured products)
- Implement image cropping/resizing
- Add scheduled publishing
- Version history for settings
- Multi-language support
- Social media integration
