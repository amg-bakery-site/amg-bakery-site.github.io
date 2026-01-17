# 🎥 Video Gallery - User Guide

## Quick Start

### Adding a Video
1. Scroll to the **"🎥 Video Gallery"** section on your website
2. Click **"+ Add Video"** button
3. Fill in the form:
   - **Title** (required): e.g., "How We Make Chocolate Cake"
   - **Description** (optional): e.g., "Watch our chef prepare this delicious cake"
   - **YouTube URL** (required): Paste your video URL
   - **Category**: Choose from dropdown (Tutorial, Behind-the-Scenes, etc.)
4. Click **"Add Video"** button
5. Your video will appear in the gallery with an embedded player!

---

## Supported Video URL Formats

### YouTube URLs
Copy any YouTube URL format:
- ✅ `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- ✅ `https://youtu.be/dQw4w9WgXcQ`
- ✅ `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s` (with timestamp)

The system automatically converts to embed format!

### Other Video Platforms
- Vimeo, Dailymotion, or any platform with iframe embed code
- Paste the embed URL directly

---

## Video Categories

Choose the most appropriate category for your video:

| Category | Best For | Example |
|----------|----------|---------|
| **Tutorial** | How-to videos, recipes, tips | "How to Make Croissants" |
| **Behind-the-Scenes** | Kitchen footage, staff, process | "A Day at A.M.G. Bakery" |
| **Product Showcase** | New items, specials, features | "Introducing Our New Chocolate Cake" |
| **Event** | Grand openings, celebrations, events | "Store Opening Day" |
| **Other** | Testimonials, culture, etc. | Anything else |

---

## Managing Videos

### Edit a Video
1. Find the video you want to edit
2. Click **"✏️ Edit"** button
3. Update the information
4. Click **"Add Video"** (button changes context based on mode)

### Delete a Video
1. Find the video you want to delete
2. Click **"🗑️ Delete"** button
3. Confirm deletion when prompted
4. Video is permanently removed

---

## Video Display Features

### What Viewers See:
- ▶️ **Embedded Video Player**: Full-screen capable, with controls
- 📝 **Title**: Displayed above the player
- 🏷️ **Category Badge**: Shows video type (Tutorial, Behind-the-Scenes, etc.)
- 📄 **Description**: Your video description text
- ⚙️ **Edit/Delete Buttons**: (Admin only)

### Player Controls:
- Play/Pause
- Volume control
- Full-screen mode
- Quality settings (if available on YouTube)
- Autoplay support

---

## Tips & Best Practices

### 1. Video Titles
- ✅ Be descriptive and clear
- ✅ Include product/recipe names if relevant
- ✅ Keep under 60 characters for best display
- ❌ Avoid all caps or special characters

### 2. Descriptions
- ✅ Write 1-2 sentences explaining the video
- ✅ Mention key points or what viewers will learn
- ✅ Include call-to-action if relevant
- ❌ Don't make it too long (show as truncated on mobile)

### 3. Video Quality
- ✅ Use HD quality videos (720p or higher)
- ✅ Ensure good lighting and audio
- ✅ Keep videos under 10 minutes for best engagement
- ✅ Add captions for accessibility

### 4. Organization
- ✅ Use consistent categories for easy browsing
- ✅ Add newest videos regularly (keep content fresh)
- ✅ Mix different categories to engage viewers
- ✅ Consider video order (most recent shows first)

---

## Common Issues & Solutions

### Video Not Embedding?
**Problem**: Video URL doesn't work
- **Solution**: Verify the URL is correct and the video is public
- **Check**: Copy URL directly from YouTube (not shortened links)
- **Try**: Use the full watch?v= format

### Can't See Embedded Player?
**Problem**: Black box instead of video
- **Solution**: Clear browser cache and refresh page
- **Check**: JavaScript is enabled in browser
- **Try**: Use a different browser to test

### Video Description Not Showing?
**Problem**: Description text not visible
- **Solution**: Verify text was entered (not blank)
- **Check**: Text length (very long text might be truncated on mobile)
- **Try**: Refresh the page

---

## Storage & Data

### Where is Video Data Stored?
- All videos stored in browser's **localStorage**
- Key: `amg_videos`
- Format: JSON array

### Data Persistence
- ✅ Videos persist across browser sessions
- ✅ Data survives closing and reopening browser
- ❌ Data lost if browser cache is cleared
- ❌ Data doesn't sync across devices/browsers

### Storage Limits
- Max 5MB per domain
- Each video requires ~1-2KB of storage (just metadata, not video file itself)
- Videos hosted on YouTube, not stored locally

---

## Admin Features

### For Store Administrators:

1. **Add Videos**: Click "+ Add Video" to upload
2. **Manage Videos**: Edit or delete existing videos
3. **Categorize**: Organize by category for better browsing
4. **Track Updates**: See when each video was added

### Admin Restrictions:
- Regular users can only view videos
- Only logged-in admins can add/edit/delete
- Cannot remove admin panel video management

---

## Video Gallery Data Structure

### How Videos are Stored:
```javascript
{
  id: "unique-id-123",
  title: "How We Make Chocolate Cake",
  description: "Watch our chef prepare this delicious cake",
  url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  category: "tutorial",
  date: "2024-01-15T10:30:00.000Z"
}
```

### Available Fields:
- **id**: Unique identifier (auto-generated)
- **title**: Video title
- **description**: Video description
- **url**: Embedded video URL (auto-converted)
- **category**: Video category
- **date**: Upload date/time (auto-set)

---

## API Reference (For Developers)

### Load Videos
```javascript
loadVideos()  // Returns array of video objects
```

### Add Video
```javascript
addVideo(title, description, url, category)
// Returns the created video object
```

### Delete Video
```javascript
deleteVideo(videoId)
// Removes video from localStorage
```

### Update Video
```javascript
updateVideo(videoId, title, description, url, category)
// Updates existing video
```

### Render Videos
```javascript
renderVideos()
// Renders all videos to #videos-grid element
```

### Open Add Modal
```javascript
openAddVideoModal()
// Shows the "Add Video" modal
```

---

## Future Enhancements

Planned features for future updates:

### Week 2-3:
- [ ] Search and filter videos
- [ ] Video playlists/series
- [ ] Recommended videos sidebar
- [ ] Video view counter
- [ ] Like/favorite functionality
- [ ] Comments section
- [ ] Video upload (direct file upload)
- [ ] Auto-generate thumbnails

### Phase 2:
- [ ] Vimeo integration
- [ ] Custom video player
- [ ] Analytics dashboard
- [ ] Social sharing buttons
- [ ] Video SEO optimization

---

## Getting Help

### Troubleshooting Steps:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Perform action (add/edit/delete video)
4. Look for error messages in console
5. Report any errors to bakery manager

### Contact Support:
- 📞 Phone: 9848551921 / 9826542784
- 📍 Location: Pipira chowk, Birendranagar, Surkhet
- ⏰ Business Hours: [Your Operating Hours]

---

## Video Examples

### Recommended Video Ideas:

1. **Tutorial Videos**
   - "5-Minute Chocolate Cake Recipe"
   - "How to Decorate Cup Cakes"
   - "Perfect Icing Techniques"

2. **Behind-the-Scenes**
   - "Morning in the Bakery"
   - "Meet Our Baking Team"
   - "From Dough to Oven"

3. **Product Showcase**
   - "New Wedding Cake Collection"
   - "Seasonal Specials"
   - "Custom Cake Designs"

4. **Events**
   - "Grand Opening Celebration"
   - "Customer Appreciation Day"
   - "Charity Bake Sale"

---

## FAQ

**Q: Can I add videos from my phone?**
A: Yes! Use the same process on mobile. The modal will work on all devices.

**Q: How many videos can I add?**
A: Unlimited! (Until browser storage limit of 5MB is reached)

**Q: Can videos be made private?**
A: Not yet. All videos are public to all visitors. Coming in Phase 2.

**Q: Do videos autoplay?**
A: Not by default. Viewers must click play to watch.

**Q: Can I embed other video platforms?**
A: Yes! Use embed codes from Vimeo, Dailymotion, etc.

**Q: What happens if I delete a video?**
A: It's permanently removed. You'll need to add it again to restore.

**Q: Can I reorder videos?**
A: Not yet. Videos appear in the order they were added (newest first). Coming in Phase 2.

---

## Additional Resources

### Internal Links:
- [Main Website](https://amg-bakery-site.github.io/)
- [Testing Page](test.html)
- [Update Documentation](UPDATES.md)
- [Admin Dashboard](https://amg-bakery-site.github.io/#admin-dashboard)

### External Resources:
- [YouTube Embedding Guide](https://support.google.com/youtube/answer/171780)
- [Responsive Video Embeds](https://css-tricks.com/responsive-iframes/)
- [Video Best Practices](https://www.youtube.com/creator/createbest_practices)

---

**Version**: 2.0  
**Last Updated**: Today  
**Status**: ✅ Production Ready

