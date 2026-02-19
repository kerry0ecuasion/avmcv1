# File Upload Solutions - Setup Guide

This project implements two solutions for handling file uploads to Firebase Storage, addressing CORS issues and improving security.

## Solution Overview

### Solution 2: Cloud Function (Recommended for Production)
- **Pros**: Secure, CORS-safe, better error handling, authentication enforced
- **Cons**: Requires Firebase Functions setup and deployment
- **Best for**: Production applications

### Solution 3: Direct Upload with CORS Proxy (Development Fallback)
- **Pros**: Works immediately for development
- **Cons**: Less secure, CORS proxy may be unreliable
- **Best for**: Development and prototyping

The implementation uses a hybrid approach: tries Cloud Function first, falls back to direct upload with CORS proxy if needed.

---

## Setup Instructions

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Authenticated with Firebase: `firebase login`

### Step 1: Install Cloud Functions Dependencies

```bash
cd functions
npm install
cd ..
```

### Step 2: Deploy Cloud Functions

```bash
firebase deploy --only functions
```

After deployment, you'll see URLs for each function:
```
✔  Deploy complete!

Function URL (uploadDoctorProfilePhoto): 
https://us-central1-visayasmed-53bbc.cloudfunctions.net/uploadDoctorProfilePhoto

Function URL (generateSignedUrl): 
https://us-central1-visayasmed-53bbc.cloudfunctions.net/generateSignedUrl
```

### Step 3: Update Environment Variables

Add the Cloud Function URL to your `.env` file:

```
VITE_CLOUD_FUNCTION_URL=https://us-central1-visayasmed-53bbc.cloudfunctions.net/uploadDoctorProfilePhoto
```

### Step 4: Configure Firebase Security Rules (Optional but Recommended)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /doctor-profile/{allPaths=**} {
      // Only authenticated users can write
      allow write: if request.auth != null;
      // Everyone can read
      allow read: if true;
    }
    
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## How It Works

### File Upload Flow

1. **User selects file** → Component preview shows selected image
2. **User clicks "Save Photo"** → `handleSavePhoto()` is called

3. **Attempt Cloud Function Upload (Solution 2)**
   - Gets authentication token from Firebase Auth
   - Sends file to Cloud Function with Bearer token
   - Cloud Function validates auth and uploads to Storage
   - Returns signed download URL

4. **Fallback to Direct Upload (Solution 3)** (if Cloud Function fails)
   - Uploads directly to Firebase Storage
   - Attempts CORS proxy if direct access fails
   - Returns download URL

5. **Update Firestore** → Save download URL to doctor profile document
6. **Update UI** → Display success message with upload method used

---

## Cloud Functions Details

### uploadDoctorProfilePhoto
- **Type**: HTTPS Cloud Function
- **Method**: POST (or OPTIONS for CORS preflight)
- **Auth**: Required (Firebase Auth token in Authorization header)
- **Input**: Binary file data in request body
- **Output**: JSON with `downloadURL` and `fileName`
- **Security**: Verifies authentication token before uploading

### generateSignedUrl (Utility)
- **Type**: HTTPS Cloud Function
- **Method**: POST
- **Input**: `{ filePath: string }`
- **Output**: JSON with signed URL
- **Use Case**: Generate temporary download URLs for existing files

---

## Environment Variables

```env
# Required for Firebase
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID

# Optional - Cloud Function URL (auto-detected if not provided)
VITE_CLOUD_FUNCTION_URL
```

---

## Troubleshooting

### Cloud Function Deployment Fails
```bash
# Check if Firebase is initialized
firebase projects:list

# Verify Node version (use Node 18+)
node --version

# Check function logs
firebase functions:log
```

### Upload Still Fails After Setup
1. **Check Firebase Auth** - Ensure user is authenticated
2. **Check Cloud Function URL** - Verify correct URL in `.env`
3. **Check CORS rules** - Ensure CORS is properly configured
4. **Check Storage Permissions** - Verify Firestore rules allow writes

### CORS Proxy Not Working
- The CORS Anywhere proxy (`cors-anywhere.herokuapp.com`) is free-tier and may be rate-limited
- For production, implement your own CORS proxy or use Solution 2 exclusively

---

## Local Testing with Emulator

To test against Firebase Emulator Suite:

```bash
# Start emulator
firebase emulators:start

# In a separate terminal, set environment variables to use emulator
# Then run your app
npm run dev
```

---

## Production Deployment

1. Deploy Cloud Functions: `firebase deploy --only functions`
2. Update environment variables in your hosting platform
3. Enable only necessary Firebase services
4. Review and enforce Firebase Security Rules
5. Set appropriate CORS headers in Cloud Function
6. Consider adding rate limiting to Cloud Functions

---

## Security Considerations

✅ **What we've implemented:**
- Authentication verification in Cloud Function
- HTTPS-only communication
- Signed URLs for temporary file access
- Security Rules for Firebase Storage

⚠️ **What you should add:**
- File size limits in Cloud Function
- File type validation (MIME type check)
- Rate limiting on upload function
- Admin-only upload verification (add custom claims)
- Virus scanning for uploaded files
- User quota management

---

## File Structure

```
visayasmed/
├── functions/
│   ├── src/
│   │   └── index.ts           # Cloud Functions code
│   ├── package.json           # Functions dependencies
│   ├── tsconfig.json          # TypeScript config
│   └── .gitignore
├── src/
│   ├── components/
│   │   └── DoctorProfileEditor.tsx  # Updated with both solutions
│   └── firebase.ts            # Firebase initialization
├── firebase.json              # Firebase functions config
├── cors.json                  # CORS configuration (for gsutil)
└── .env.example               # Environment template
```

---

## References

- [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Firebase Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [CORS Policy Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
