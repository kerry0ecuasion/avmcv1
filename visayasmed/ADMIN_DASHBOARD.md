# VisayasMed Admin Dashboard

## Overview

The Admin Dashboard is a comprehensive content management system that allows administrators to edit all website content including slideshows, page text, images, doctors, and services. All changes made in the admin panel are immediately reflected on the live website after publishing.

## Features

### 1. **Admin Authentication**
- Secure login system using Firebase Authentication
- Email and password-based authentication
- Session management with localStorage tokens
- Protected routes that redirect unauthorized users to login

### 2. **Slideshow Management**
- Add, edit, delete, and reorder slideshows
- Image upload with preview
- Drag-and-drop style ordering with up/down buttons
- Automatic image storage in Firebase Cloud Storage
- Real-time updates on the main website

### 3. **Content Editors**
- Edit Home page content (hero section, features)
- Edit About page content (title, description, mission, vision)
- Edit Services page content
- Edit Doctors page content
- Save drafts without publishing
- Preview changes before publishing

### 4. **Image Management**
- Upload images for slideshows, doctors, and services
- Automatic optimization and storage
- Secure deletion with cleanup
- Support for all common image formats (JPG, PNG, GIF, WebP)

### 5. **Publishing System**
- Draft/Publish workflow
- One-click publishing to live site
- Automatic synchronization with Firestore
- Real-time updates without page reload

## Technical Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Firebase SDK** - Authentication, Firestore, Storage, Cloud Functions

### Backend
- **Firebase Firestore** - Database
- **Firebase Cloud Storage** - Image storage
- **Firebase Cloud Functions** - Publishing logic
- **Firebase Authentication** - User management

## Project Structure

```
src/
├── components/
│   ├── AdminLogin.tsx              # Login page
│   ├── AdminDashboard.tsx          # Main dashboard
│   ├── ProtectedAdminRoute.tsx     # Route protection
│   └── AdminComponents/
│       ├── SlideshowManager.tsx    # Slideshow CRUD
│       └── ContentEditor.tsx       # Page content editor
├── contexts/
│   ├── AdminAuthContext.tsx        # Admin auth context
│   └── ThemeContext.tsx             # Dark/Light mode
├── utils/
│   ├── adminAuth.ts                # Auth utilities
│   └── dataService.ts              # Firestore services
├── styles/
│   └── admin.css                   # Admin styling
└── firebase.ts                     # Firebase config
```

## Firestore Database Structure

### Collections

#### `slideshows`
```typescript
{
  id: string
  title: string
  description: string
  image: string (URL)
  order: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `pages`
```typescript
{
  // home.json
  {
    hero: { heading, subheading, ctaText, ctaLink },
    features: [{ title, description }]
  }
  
  // about.json
  {
    title: string
    description: string
    mission: string
    vision: string
  }
  
  // services.json
  {
    title: string
    description: string
  }
  
  // doctors.json
  {
    title: string
    description: string
  }
}
```

#### `doctors`
```typescript
{
  id: string
  name: string
  specialization: string
  bio: string
  image: string (URL)
  education: string
  experience: string
  order: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `services`
```typescript
{
  id: string
  name: string
  description: string
  icon: string (URL)
  price: string
  duration: string
  order: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `public` (Published content)
```typescript
{
  slideshows: { data: [], updatedAt: timestamp }
  page_home: { data: {}, updatedAt: timestamp }
  page_about: { data: {}, updatedAt: timestamp }
  doctors: { data: [], updatedAt: timestamp }
  services: { data: [], updatedAt: timestamp }
}
```

## Usage Guide

### Accessing the Admin Dashboard

1. Navigate to `http://localhost:5173/admin/login`
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to `/admin/dashboard`

### Managing Slideshows

1. Click "Manage Slideshows" in the sidebar
2. View all current slideshows
3. **Add New:**
   - Click "+ Add New Slide"
   - Enter title and description
   - Upload image
   - Click "Save"
4. **Edit:**
   - Click "Edit" on a slideshow
   - Make changes
   - Click "Save"
5. **Delete:**
   - Click "Delete" on a slideshow
   - Confirm deletion
6. **Reorder:**
   - Use Up (↑) and Down (↓) buttons to reorder
7. **Publish:**
   - Click "Publish Changes" button
   - Changes appear on live site immediately

### Editing Page Content

1. Select a page from the sidebar (Home, About, Services, Doctors)
2. Edit the content in the form
3. Click "Save Draft" to save without publishing
4. Click "Publish" to publish changes to the live site

### Publishing Changes

The dashboard has a two-step workflow:

1. **Save Draft:**
   - Saves content to your admin database
   - Keeps draft status
   - Doesn't affect live site

2. **Publish:**
   - Publishes draft to live site
   - Updates the public collection
   - Triggers Cloud Functions
   - Changes visible immediately

## Cloud Functions

The backend uses Firebase Cloud Functions to handle publishing:

### `publishSlideshows`
- Publishes all slideshows to the public collection
- Called when publishing slideshow changes
- Returns count of published slides

### `publishPageContent`
- Publishes page content to public collection
- Called when publishing page changes
- Takes `page` parameter (home, about, services, doctors)

### `publishDoctors`
- Publishes all doctors to public collection
- Maintains ordering

### `publishServices`
- Publishes all services to public collection
- Maintains ordering

## Authentication Flow

```
1. User enters credentials
2. Firebase Authentication verifies
3. Auth token stored in localStorage
4. User redirected to dashboard
5. ProtectedAdminRoute checks token
6. Access to admin pages allowed
7. On logout: token cleared
```

## Data Flow

```
Admin Panel (React)
    ↓
Firestore (Draft Collection)
    ↓
Publish Button
    ↓
Cloud Functions
    ↓
Firestore (Public Collection)
    ↓
Main Website (Reads from public)
```

## API Endpoints (Cloud Functions)

All endpoints require admin authentication token in Authorization header.

### POST `/api/publish/slideshows`
Publishes all slideshows
```bash
curl -X POST http://localhost:5001/PROJECT_ID/us-central1/publishSlideshows \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### POST `/api/publish/{page}`
Publishes page content
```bash
curl -X POST http://localhost:5001/PROJECT_ID/us-central1/publishPageContent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"page":"home"}'
```

### POST `/api/publish/doctors`
Publishes all doctors
```bash
curl -X POST http://localhost:5001/PROJECT_ID/us-central1/publishDoctors \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### POST `/api/publish/services`
Publishes all services
```bash
curl -X POST http://localhost:5001/PROJECT_ID/us-central1/publishServices \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Styling

The admin dashboard uses the same design system as the main website:

- **Colors:** Matches main site color scheme (Sky blue primary color)
- **Dark Mode:** Supports light/dark theme toggle
- **Responsive:** Fully responsive design
- **Theme:** Automatic light/dark mode based on system preferences or user selection

## Error Handling

- **Network errors:** User-friendly error messages
- **Authentication errors:** Redirect to login
- **File upload errors:** Validation and error messages
- **Database errors:** Logged to console and user notified

## Optimization Tips

### For Best Performance:
1. **Compress images** before uploading
2. **Use smaller file sizes** for slideshows
3. **Batch updates** when making multiple changes
4. **Publish once** after all changes are complete

### Best Practices:
1. **Save drafts** frequently
2. **Preview** before publishing
3. **Test on live site** after publishing
4. **Keep descriptions** concise
5. **Use consistent naming** for assets

## Security

### Protected by:
1. **Firebase Authentication** - Secure login
2. **Custom Auth Context** - Session management
3. **Protected Routes** - Authorization checks
4. **Firestore Security Rules** - Database access control
5. **Cloud Functions** - Server-side validation

### Admin Firestore Rules:
```typescript
// Only authenticated admins can read/write
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

// Public collection can be read by anyone
match /public/{document=**} {
  allow read: if true;
  allow write: if request.auth.uid != null;
}
```

## Deployment

### Firebase Deployment

1. **Ensure Cloud Functions are deployed:**
   ```bash
   cd functions
   npm install
   firebase deploy --only functions
   ```

2. **Configure Firestore Security Rules:**
   - Deploy rules via Firebase Console
   - Or use: `firebase deploy --only firestore:rules`

3. **Set up Storage Rules:**
   - Allow authenticated users to upload
   - Allow public read access for images

### Environment Variables

Create `.env` file:
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Troubleshooting

### Login Issues
- Clear browser cache
- Check Firebase project settings
- Verify auth provider is enabled
- Check admin's email is registered

### Publishing Not Working
- Verify Cloud Functions are deployed
- Check Firestore security rules
- Ensure admin token is valid
- Check browser console for errors

### Images Not Uploading
- Check file size (max usually 10MB)
- Verify file format (JPG, PNG, GIF, WebP)
- Check Cloud Storage bucket exists
- Verify storage rules allow uploads

### Changes Not Appearing
- Verify publish was successful
- Check main site is reading from public collection
- Clear browser cache
- Check main site's data loading logic

## Future Enhancements

- [ ] Bulk upload for multiple images
- [ ] Advanced scheduling for content
- [ ] Content versioning and history
- [ ] User roles and permissions
- [ ] Analytics and preview statistics
- [ ] SEO optimization tools
- [ ] Rich text editor for content
- [ ] Media library management
- [ ] Automatic backups
- [ ] Collaborative editing

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Firestore console for data
3. Check Cloud Functions logs
4. Check browser console for errors
5. Review Firebase project settings

## License

© 2025 VisayasMed Hospital. All rights reserved.
