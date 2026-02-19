# Admin Panel Setup Guide

## Overview
This Admin Panel allows you to manage:
- Doctor profile (photo, name, specialty, bio)
- Create, edit, and delete posts
- All changes appear on the public website in real-time

## Prerequisites
- Firebase Project (free tier works)
- Firebase Authentication enabled
- Firestore Database enabled
- Firebase Storage enabled

## Setup Steps

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Follow the setup wizard and select "Google Analytics" (optional)

### 2. Enable Authentication
1. In Firebase Console, go to Authentication
2. Click "Get Started"
3. Click "Email/Password" provider and enable it
4. Go to "Users" tab and click "Add user"
5. Create an admin account with email and password
   - Example: admin@visayasmed.com

### 3. Create Firestore Database
1. In Firebase Console, go to Firestore Database
2. Click "Create database"
3. Choose "Start in production mode"
4. Select your region
5. Click "Create"

### 6. Setup Firebase Storage
1. In Firebase Console, go to Storage
2. Click "Get Started"
3. Choose default security rules and click "Done"

### 7. Get Firebase Credentials
1. In Firebase Console, click your project settings (gear icon)
2. Go to "Service accounts" tab
3. Click "Generate new private key" or just copy the config
4. You need these values:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

### 8. Configure Your App
1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 9. Install Dependencies
```bash
cd visayasmed
npm install
```

### 10. Run Development Server
```bash
npm run dev
```

## Accessing Admin Panel

### URL Routes
- **Admin Login**: http://localhost:5173/admin/login
- **Admin Dashboard**: http://localhost:5173/admin/dashboard (after login)

### First Login
1. Go to http://localhost:5173/admin/login
2. Enter the admin email and password you created in Firebase
3. You'll be redirected to the admin dashboard

## Admin Features

### Doctor Profile Management
1. Go to "Doctor Profile" tab in dashboard
2. Upload doctor photo (click file input or drag-drop area)
3. Preview the image
4. Click "Save Photo"
5. Edit doctor name, specialty, and bio
6. Click "Save Profile"
7. Changes appear on public website immediately

### Posts Management
1. Go to "Posts" tab in dashboard
2. Click "+ Create New Post" button
3. Fill in post title, content, and optional image
4. Click "Create Post"
5. Post appears on public website immediately

### Editing a Post
1. Find the post in the Posts list
2. Click "Edit" button
3. Update title, content, or image
4. Click "Update Post"

### Deleting a Post
1. Find the post in the Posts list
2. Click "Delete" button
3. Confirm deletion in popup
4. Post is removed immediately from dashboard and public website
5. Associated image is deleted from storage

## Firestore Database Rules

Use these security rules for development (⚠️ Make these stricter for production):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated admin users
    match /admin/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Allow anyone to read posts
    match /posts/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

1. Go to Firestore > Rules
2. Replace the default rules with above
3. Click "Publish"

## Firebase Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

1. Go to Storage > Rules
2. Replace default rules with above
3. Click "Publish"

## Public Website Integration

The public website automatically displays:
- Doctor profile from Firestore
- All posts from Firestore
- Updates happen in real-time

Components:
- `DoctorProfileDisplay.tsx` - Shows doctor profile
- `PostsDisplay.tsx` - Shows all posts

Add these to your public pages to display the doctor and posts.

## Troubleshooting

### Admin login not working
- Verify Firebase credentials in `.env.local`
- Check that user exists in Firebase Authentication
- Check browser console for errors

### Changes not appearing on public site
- Verify Firestore security rules allow reads
- Check browser console for errors
- Refresh the page

### Images not uploading
- Check Firebase Storage security rules
- Verify image file size (max 5MB)
- Check browser console for errors

### Database not found
- Make sure Firestore Database is initialized
- Check that you selected the correct region

## Production Deployment

Before deploying to production:

1. ⚠️ **Update Security Rules** - Make Firestore and Storage rules more restrictive
2. Use environment variables for Firebase config
3. Enable 2FA for admin account
4. Consider adding email verification
5. Set up Firebase backup rules
6. Monitor Firestore usage and costs

## Support & Documentation

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Storage Docs](https://firebase.google.com/docs/storage)
