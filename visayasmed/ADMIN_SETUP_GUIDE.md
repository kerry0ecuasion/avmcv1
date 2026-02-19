# Admin Dashboard Setup & Deployment Guide

## Quick Start

### 1. Access the Admin Dashboard

```
URL: http://localhost:5173/admin/login
```

### 2. Login

Use the admin credentials that were set up in Firebase:
- Email: `admin@visayasmed.com`
- Password: (check with your administrator)

### 3. Start Managing Content

Once logged in, you'll see the admin dashboard with options to:
- Manage Slideshows
- Edit Home Page
- Edit About Page
- Edit Services
- Edit Doctors

---

## Detailed Setup Instructions

### Prerequisites

1. **Firebase Project Configured**
   - Ensure firebase.ts is properly configured
   - Firebase project ID and credentials set

2. **Node.js Installation**
   - Node.js 16+ installed
   - npm or yarn package manager

3. **Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

### Step 1: Create Admin User

1. Go to Firebase Console
2. Navigate to Authentication → Users
3. Click "Add User"
4. Enter admin email and password
5. Create the user

### Step 2: Deploy Cloud Functions

```bash
# Navigate to functions directory
cd functions

# Install dependencies
npm install

# Deploy functions (requires Firebase CLI)
firebase deploy --only functions
```

### Step 3: Configure Firestore Security Rules

In Firebase Console → Firestore Database → Rules:

```typescript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin collections - only authenticated users
    match /pages/{document=**} {
      allow read, write: if request.auth.uid != null;
    }
    match /slideshows/{document=**} {
      allow read, write: if request.auth.uid != null;
    }
    match /doctors/{document=**} {
      allow read, write: if request.auth.uid != null;
    }
    match /services/{document=**} {
      allow read, write: if request.auth.uid != null;
    }
    
    // Public collection - read by all, write by authenticated
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null;
    }
  }
}
```

### Step 4: Configure Cloud Storage Rules

In Firebase Console → Storage → Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload
    match /slideshows/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /doctors/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /services/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 5: Update Main Website

Make sure the main website is configured to read from the `/public` collection:

```typescript
// In your Home.tsx or components that display this data:
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

async function loadPublishedContent() {
  const slideshowsDoc = await getDoc(doc(db, 'public', 'slideshows'));
  const slideshows = slideshowsDoc.data()?.data || [];
  
  const doctorsDoc = await getDoc(doc(db, 'public', 'doctors'));
  const doctors = doctorsDoc.data()?.data || [];
  
  // Use this data to render
}
```

---

## Database Initialization

### Create Initial Collections

If collections don't exist, create them manually or run this setup:

```typescript
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function initializeDatabase() {
  // Create empty pages documents
  const pages = ['home', 'about', 'services', 'doctors'];
  
  for (const page of pages) {
    await setDoc(doc(db, 'pages', page), {
      title: `${page} Page`,
      description: 'Edit this page content',
      updatedAt: new Date()
    });
  }
  
  // Create public collection placeholder
  await setDoc(doc(db, 'public', 'slideshows'), {
    data: [],
    updatedAt: new Date()
  });
  
  console.log('Database initialized successfully');
}

// Call this once during setup
initializeDatabase();
```

---

## Feature Walkthroughs

### Managing Slideshows

1. **Add Slideshow:**
   ```
   Click: "+ Add New Slide"
   Enter: Title, Description
   Upload: Image file
   Click: "Save"
   Click: "Publish Changes" (to push to live site)
   ```

2. **Edit Slideshow:**
   ```
   Click: "Edit" on slideshow card
   Modify: Any field
   Click: "Save"
   Click: "Publish Changes"
   ```

3. **Delete Slideshow:**
   ```
   Click: "Delete" on slideshow card
   Confirm: Delete dialog
   Click: "Publish Changes"
   ```

4. **Reorder Slideshows:**
   ```
   Use: Up (↑) and Down (↓) buttons
   Position: Slides in desired order
   Auto-saves: Order is saved automatically
   ```

### Editing Pages

1. **Home Page:**
   ```
   Click: "Edit Home"
   Edit: Hero section (heading, subheading)
   Edit: Features section
   Click: "Save Draft" (to save without publishing)
   Click: "Publish" (to go live)
   ```

2. **About Page:**
   ```
   Click: "Edit About"
   Edit: Title, Description
   Edit: Mission statement
   Edit: Vision statement
   Click: "Publish"
   ```

3. **Services/Doctors:**
   ```
   Click: "Edit Services" or "Edit Doctors"
   Same save/publish workflow
   ```

### Adding Doctors

1. **Add Doctor:**
   ```
   Click: "+ Add Doctor"
   Enter: Name, Specialization
   Enter: Bio, Education, Experience
   Upload: Doctor photo
   Click: "Save"
   ```

2. **Edit Doctor:**
   ```
   Click: "Edit" on doctor card
   Modify: Any field
   Upload: New photo (optional)
   Click: "Save"
   ```

3. **Delete Doctor:**
   ```
   Click: "Delete" on doctor card
   Confirm: Delete dialog
   ```

### Adding Services

1. **Add Service:**
   ```
   Click: "+ Add Service"
   Enter: Name, Description
   Enter: Price, Duration (optional)
   Upload: Service icon
   Click: "Save"
   ```

2. **Edit/Delete:**
   ```
   Same as doctors
   ```

---

## Publishing Workflow

### Two-Step Process:

**Step 1: Save (Draft)**
- Saves content to admin database
- Only accessible in admin panel
- Doesn't affect live site

**Step 2: Publish**
- Prepares content for live site
- Triggers Cloud Functions
- Copies data to `/public` collection
- Live site automatically syncs

### Publishing Types:

**Individual Entities:**
- Slideshows: Click "Publish Changes" button
- Doctors: Auto-publishes when saved
- Services: Auto-publishes when saved

**Page Content:**
- Click "Publish" button after editing
- Each page publishes independently

---

## Best Practices

### Content Creation:
- ✅ Write clear, concise titles
- ✅ Use descriptive but short descriptions
- ✅ Optimize images (max 2MB recommended)
- ✅ Check spelling and grammar
- ✅ Test on live site after publishing

### Image Management:
- ✅ Use consistent sizes
- ✅ Compress before uploading
- ✅ Use descriptive filenames
- ✅ Keep aspect ratios consistent
- ✅ Upload high-quality images

### Content Organization:
- ✅ Keep doctor list updated
- ✅ Maintain consistent service descriptions
- ✅ Update slideshows seasonally
- ✅ Archive outdated content
- ✅ Date content updates

### Admin Practices:
- ✅ Save frequently
- ✅ Review before publishing
- ✅ Keep admin password secure
- ✅ Logout when done
- ✅ Document major changes

---

## Troubleshooting

### Issue: Can't Login

**Solution:**
1. Verify admin account in Firebase Console
2. Check email spelling
3. Clear browser cookies/cache
4. Reset password if forgotten
5. Check Firebase Authentication is enabled

### Issue: Images Won't Upload

**Solution:**
1. Check file size (< 10MB)
2. Verify file format (JPG, PNG, GIF, WebP)
3. Check Cloud Storage bucket exists
4. Verify storage rules allow uploads
5. Check browser console for error details

### Issue: Changes Don't Appear

**Solution:**
1. Verify "Publish" button was clicked
2. Check main site's data loading logic
3. Clear main site browser cache
4. Wait a few seconds for sync
5. Check Firestore `/public` collection

### Issue: Buttons Not Responding

**Solution:**
1. Check browser console for errors
2. Verify Firebase connection
3. Check admin token in localStorage
4. Try logging out and back in
5. Clear browser cache

### Issue: Database Error

**Solution:**
1. Check Firestore security rules
2. Verify admin token is valid
3. Check Firestore quota limits
4. Review Cloud Functions logs
5. Restart development server

---

## Monitoring & Maintenance

### Daily:
- Check admin panel loads correctly
- Confirm publish operations work
- Monitor error messages

### Weekly:
- Review Firestore usage
- Check Cloud Storage quota
- Test admin operations

### Monthly:
- Review published content
- Update sitemaps/SEO
- Check for broken links
- Backup database
- Review error logs

### Quarterly:
- Update content strategy
- Review user feedback
- Plan new features
- Security audit
- Performance review

---

## Performance Tips

### Optimize Images:
```bash
# Using ImageMagick
convert input.jpg -resize 1200x -quality 85 output.jpg

# Using ImageOptim or similar tools
# Compress before uploading to save storage
```

### Manage Database Size:
- Delete unused slideshows
- Archive old content
- Remove test data
- Monitor collection sizes
- Use Firestore quotas wisely

### Speed Up Publishing:
- Batch updates when possible
- Publish during off-peak hours
- Monitor Cloud Function performance
- Enable Firestore caching
- Use CDN for static assets

---

## Security Reminders

1. **Password Security:**
   - Use strong passwords
   - Change regularly
   - Don't share credentials

2. **Session Management:**
   - Logout when done
   - Don't leave browser open
   - Clear sensitive data

3. **Firestore Data:**
   - Backup regularly
   - Monitor unauthorized access
   - Review security rules

4. **Storage Files:**
   - Verify file sources
   - Remove malicious content
   - Monitor storage quota

---

## Support

For additional help:

1. **Documentation:**
   - See [ADMIN_DASHBOARD.md](ADMIN_DASHBOARD.md)
   - Complete comprehensive guide

2. **Troubleshooting:**
   - Check this section first
   - Review error messages
   - Check browser console

3. **Firebase Help:**
   - [Firebase Documentation](https://firebase.google.com/docs)
   - [Firebase Console](https://console.firebase.google.com)
   - Firebase Support Community

4. **Code Repository:**
   - Check README.md
   - Review component comments
   - Check implementation notes

---

## Next Steps

1. ✅ Setup Firebase project
2. ✅ Create admin user
3. ✅ Deploy Cloud Functions
4. ✅ Configure security rules
5. ✅ Test admin dashboard
6. ✅ Start managing content
7. Monitor performance
8. Plan enhancements

---

**Last Updated:** February 17, 2025  
**Version:** 1.0.0  
**Status:** Production Ready
