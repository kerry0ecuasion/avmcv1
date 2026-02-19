# Admin Dashboard Quick Reference

## Access
- **URL:** `http://localhost:5173/admin/login`
- **Dashboard:** `http://localhost:5173/admin/dashboard`

---

## Login
```
Email: admin@visayasmed.com
Password: [your password]
```

---

## Main Menu

| Option | Purpose | Time to Update |
|--------|---------|-----------------|
| Manage Slideshows | Add/Edit/Delete homepage slideshows | 2-5 min |
| Edit Home | Update hero section and features | 2-3 min |
| Edit About | Update about page content | 3-5 min |
| Edit Services | Update services description | 2-3 min |
| Edit Doctors | Manage doctor profiles (CRUD) | 5-10 min |

---

## Common Tasks

### Add a Slideshow (5 min)

1. Click **"Manage Slideshows"**
2. Click **"+ Add New Slide"**
3. Enter: **Title** (e.g., "Summer Health Campaign")
4. Enter: **Description** (e.g., "Join us for health awareness")
5. Click: **"Upload Image"** (JPG or PNG, < 5MB)
6. Click: **"Save"**
7. Click: **"Publish Changes"** ⭐ **IMPORTANT**

### Edit Slideshow (3 min)

1. Click **"Manage Slideshows"**
2. Find the slideshow, click **"Edit"**
3. Modify title, description, or image
4. Click **"Save"**
5. Click **"Publish Changes"**

### Delete Slideshow (1 min)

1. Click **"Manage Slideshows"**
2. Find the slideshow, click **"Delete"**
3. Confirm deletion
4. Click **"Publish Changes"**

### Reorder Slideshows (1 min)

1. Click **"Manage Slideshows"**
2. Use **Up (↑)** and **Down (↓)** buttons
3. Arrange in desired order
4. Order auto-saves

### Edit Home Page (3 min)

1. Click **"Edit Home"** in sidebar
2. Edit **Hero Heading** (main title)
3. Edit **Subheading** (subtitle)
4. Edit **Features** as needed
5. Click **"Publish"** (requires clicking "Publish" button)

### Add Doctor (5 min)

1. Click **"Edit Doctors"**
2. Click **"+ Add Doctor"**
3. Enter: Name, Specialization, Bio
4. Enter: Education, Experience
5. Upload: Doctor photo
6. Click **"Save"**

### Edit About Page (5 min)

1. Click **"Edit About"** in sidebar
2. Edit **Title** and **Description**
3. Edit **Mission** statement
4. Edit **Vision** statement
5. Click **"Publish"**

### Add Service (3 min)

1. Click **"Edit Services"**
2. Click **"+ Add Service"**
3. Enter: Name, Description
4. Enter: Price (optional), Duration (optional)
5. Upload: Service icon
6. Click **"Save"**

---

## Important Buttons

| Button | Action | Effect |
|--------|--------|--------|
| **Save Draft** | Saves content privately | Only visible in admin |
| **Publish** | Makes content live | Changes appear on website |
| **Publish Changes** | Publishes slideshows | Updates homepage |
| **Edit** | Modify existing item | Opens editor |
| **Delete** | Remove item | Permanent (with confirmation) |

---

## WARNING Signs

🔴 **Don't forget to:**
- ✅ Click **"Publish"** after editing pages
- ✅ Click **"Publish Changes"** after modifying slideshows
- ✅ Click **"Logout"** when finished
- ✅ Test changes on live site
- ✅ Save frequently

---

## Image Guidelines

### Requirements:
- **Format:** JPG, PNG, GIF, or WebP
- **Size:** Max 10MB
- **Recommended:** 1200x800px or larger
- **Compression:** Use online tools to compress before uploading

### Where Images Go:
| Content | Size | Example |
|---------|------|---------|
| Slideshows | 1200x800+ | Homepage carousel |
| Doctor Photos | 400x500+ | Doctor profile |
| Service Icons | 100x100+ | Service listing |

---

## FAQ

**Q: I uploaded an image but it's not showing**
A: Wait 30 seconds, then refresh page. Check if publish was clicked.

**Q: Can I undo a publish?**
A: No, but you can edit and republish new content. Keep backups of old content.

**Q: How long do changes take to appear?**
A: Usually instant, but can take up to 1 minute to sync.

**Q: What if I accidentally deleted something?**
A: Firebase may have backups. Contact your administrator immediately.

**Q: Can I schedule content?**
A: Not in current version. Consider for future enhancement.

**Q: How do I see my changes?**
A: Click "View Live Site" in top right corner to open website in new tab.

---

## Error Messages & Solutions

| Error | Solution |
|-------|----------|
| "Login failed" | Check email/password, try again |
| "Cannot upload image" | Check file size < 10MB, format is JPG/PNG |
| "Publish failed" | Check internet connection, try again |
| "Content not appearing" | Click "Publish" button, wait 1 min, refresh |
| "Logout failed" | Hard refresh page (Ctrl+F5) |

---

## Daily Checklist

Before signing off each day:

- [ ] All changes are published (not just saved as draft)
- [ ] Changes appear on live website
- [ ] No error messages in console
- [ ] Clicked "Logout" button
- [ ] Browser tab is closed

---

## Weekly Maintenance

Every week:

- [ ] Review published content for accuracy
- [ ] Update doctor photos if needed
- [ ] Check main website renders correctly
- [ ] Review analytics (if available)
- [ ] Plan content updates

---

## Monthly Tasks

Every month:

- [ ] Backup admin data
- [ ] Review Firestore usage
- [ ] Update seasonal content
- [ ] Archive old slideshows
- [ ] Check for broken links
- [ ] Test all admin features

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save draft (when in form) |
| `Esc` | Close modal/dialog |
| `Tab` | Move between form fields |
| `Enter` | Submit form |

---

## Profile

**Admin Email:** admin@visayasmed.com  
**Dashboard URL:** http://localhost:5173/admin/dashboard  
**Support Contact:** [Your Tech Support Contact]

---

## Version Info

| Component | Version |
|-----------|---------|
| Admin Dashboard | 1.0.0 |
| Updates | Feb 17, 2025 |
| Status | Production Ready |

---

## Need Help?

1. **Check:** This quick reference guide
2. **Read:** [ADMIN_SETUP_GUIDE.md](ADMIN_SETUP_GUIDE.md)
3. **Read:** [ADMIN_DASHBOARD.md](ADMIN_DASHBOARD.md)
4. **Ask:** Your administrator or tech support
5. **Contact:** GitHub Copilot for code issues

---

**Last Updated:** February 17, 2025  
**Print-Friendly:** Yes (optimized for printing)  
**Mobile-Friendly:** Partial (reference on desktop for faster workflow)

---

Remember: **Always Publish after making changes!** 🚀
