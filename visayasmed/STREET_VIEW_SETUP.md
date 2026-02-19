# Google Street View Implementation Guide

## Overview
This guide documents the Google Street View integration added to your VisayasMed Hospital website. The implementation includes two options:

1. **Interactive Street View** (Recommended)
2. **Static Street View** (Lightweight alternative)

---

## Current Implementation

### Files Added
- `src/components/StreetViewEmbed.tsx` - Interactive embed component (ACTIVE)
- `src/components/StreetViewStatic.tsx` - Static image component (Alternative)

### Files Modified
- `src/components/Footer.tsx` - Added Street View section above the map
- `src/components/Contact.tsx` - Complete redesign with Street View section
- `.env.example` - Added Google Maps API key configuration template

---

## Location Details

**Hospital Coordinates:**
- Latitude: `10.30642095`
- Longitude: `123.89249215`
- Address: VisayasMed Hospital, Cebu, Philippines
- Heading: `0°` (North-facing)
- Pitch: `0°` (Horizontal view)
- Field of View: `100°`

---

## Implementation Options

### Option 1: Interactive Street View (Currently Used)

**File:** `src/components/StreetViewEmbed.tsx`

**Features:**
- ✅ Interactive embed using Google Maps Embed API
- ✅ Pan, zoom, and rotate capabilities
- ✅ Users can explore 360° view
- ✅ No API key required
- ✅ Responsive design
- ✅ Accessible and user-friendly

**Pros:**
- Most engaging user experience
- Free to use (no API key needed)
- Full control with mouse/touch gestures
- Shows surrounding landmarks and context

**Cons:**
- Slightly heavier (more bandwidth)
- Requires JavaScript enabled

**Where It's Used:**
1. **Footer Section** - Full-width section at the top
2. **Contact Page** - Dedicated location exploration area

### Option 2: Static Street View (Lightweight Alternative)

**File:** `src/components/StreetViewStatic.tsx`

**Features:**
- 📷 Fixed image snapshot from street level
- 📦 Lightweight (smaller file size)
- ⚡ Fast loading
- Uses Google Street View Static API

**Pros:**
- Minimal bandwidth usage
- Faster page load
- Perfect for mobile-first designs

**Cons:**
- Requires Google Maps API key
- Non-interactive (no panning)
- Fixed angle only

**To Switch to Static Version:**
1. Replace the import in `Footer.tsx`:
   ```tsx
   import StreetViewStatic from './StreetViewStatic';
   // Change <StreetViewEmbed /> to <StreetViewStatic />
   ```
2. Do the same in `Contact.tsx`
3. Add API key to `.env`:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_api_key
   ```

---

## Setup Instructions

### For Interactive Street View (No Setup Needed!)
The interactive version works out of the box with no additional configuration needed. The component uses Google Maps Embed API which doesn't require an API key.

### For Static Street View (Optional)

**Step 1: Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing one)
3. Enable the "Street View Static API"

**Step 2: Create API Key**
1. Go to "Credentials" in Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key

**Step 3: Add to Environment**
1. Open `.env` file (create if it doesn't exist)
2. Add: `VITE_GOOGLE_MAPS_API_KEY=your_api_key_here`
3. Save and restart the development server

**Step 4: Configure Billing**
- Google Cloud requires a billing account for production use
- Free tier includes up to 25,000 static street view requests per day

---

## Customization Guide

### Change the Heading (Direction Camera Faces)

In `StreetViewEmbed.tsx`:
```tsx
const heading = 0; // Change this value
// 0° = North
// 90° = East
// 180° = South
// 270° = West
```

### Change the Pitch (Vertical Angle)

```tsx
const pitch = 0; // -90 to 90
// -90 = Looking straight down
// 0 = Horizontal view
// 90 = Looking straight up
```

### Change the Field of View (Zoom Level)

```tsx
const fov = 100; // 25 to 120
// Lower = Zoomed in
// Higher = Zoomed out
```

### Adjust Dimensions

For responsive sizing, modify the aspect ratio:
```tsx
<div style={{ aspectRatio: '16/9' }}> {/* Change ratio */}
```

### Customize Colors & Styling

The component uses Tailwind CSS classes. Customize:
```tsx
// Change heading color
<h3 className="text-2xl font-bold text-sky-400">

// Change border color
<div className="border-b border-gray-700">

// Change button colors
className="bg-sky-600 hover:bg-sky-700"
```

---

## Mobile Responsiveness

The implementation is fully responsive:
- **Desktop:** 16:9 aspect ratio, full width
- **Tablet:** Adjusts automatically
- **Mobile:** Maintains aspect ratio, touch-friendly

To adjust mobile behavior, modify the Container in `StreetViewEmbed.tsx`:
```tsx
<div style={{ aspectRatio: '16/9' }}>
  {/* Adjust min-height for mobile */}
  <iframe style={{ minHeight: '300px' }} />
</div>
```

---

## Performance Optimization

### Tips to Improve Loading:
1. **Lazy Loading:** Already implemented with `loading="lazy"`
2. **Compress Images:** If using static version
3. **Cache:** Browser automatically caches Google Maps resources
4. **CDN:** Google's infrastructure handles distribution

### Best Practices:
- Keep aspect ratio consistent
- Use descriptive alt text (already implemented)
- Position above the fold for engagement
- Test on mobile devices

---

## Troubleshooting

### Interactive Street View Not Showing?
- Check browser console for errors
- Verify internet connection
- Ensure JavaScript is enabled
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Static Street View Not Showing but Interactive Works?
- Verify `VITE_GOOGLE_MAPS_API_KEY` is set correctly
- Check that Street View Static API is enabled in Google Cloud Console
- Ensure billing is configured for your project
- Check browser console for API errors

### Embedded Map/Street View Blocked?
- Some ad blockers may block Google Maps
- Inform users to whitelist the site
- Consider alternative display if visitors use strict blockers

### Poor Image Quality (Static Version)?
- Increase cache time in headers
- Use higher resolution size parameter
- Check zoom level (heading/pitch/fov settings)

---

## Content & Messaging

### Current Messages:

**Interactive Version:**
- "Virtual Tour - Our Location"
- "Explore the entrance and surrounding area"
- Tip about mouse controls
- "View on Google Maps" call-to-action

### Customizing Messages:

Edit text in `StreetViewEmbed.tsx`:
```tsx
<h3>Your Custom Heading</h3>
<p>Your custom description</p>
```

---

## Integration Points

### Footer (`Footer.tsx`)
- Positioned as a full-width section above map
- Separated by border for visual hierarchy
- Maintains dark theme styling

### Contact Page (`Contact.tsx`)
- Prominent section at top
- Next to contact information form
- Easy access for visitors planning a visit

---

## SEO & Accessibility

### Already Implemented:
- ✅ Proper semantic HTML
- ✅ Descriptive alt text
- ✅ Accessibility attributes
- ✅ Schema markup compatible
- ✅ Mobile-friendly

### Further Optimization:
- Add structured data (Schema.org) for location
- Update meta descriptions mentioning street view
- Add Schema markup for LocalBusiness

---

## Future Enhancements

Potential improvements:
1. Add 3D tour capabilities
2. Integrate with booking system
3. Add multiple location views
4. Create interactive hotspots
5. Custom markers for entrance/parking/features

---

## Support & Resources

**Google Maps Documentation:**
- [Embed API](https://developers.google.com/maps/documentation/embed/get-started)
- [Street View Static API](https://developers.google.com/maps/documentation/streetview)
- [API Pricing](https://developers.google.com/maps/billing-and-pricing)

**Troubleshooting:**
- Google Maps API Documentation
- Stack Overflow: `google-maps-api` tag
- GitHub Issues in your project

---

## Quick Reference

### Change Location:
1. Update latitude/longitude in component
2. Update address text
3. Update Google Maps link URL

### Switch View Type:
1. Change import from `StreetViewEmbed` to `StreetViewStatic`
2. Update `.env` with API key (for static version)

### Customize Appearance:
1. Modify Tailwind classes for colors/sizing
2. Adjust heading/pitch/fov values
3. Change container dimensions/aspect ratio

---

**Last Updated:** February 12, 2026  
**Status:** ✅ Implementation Complete
