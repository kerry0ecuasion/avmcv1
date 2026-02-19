/**
 * Static Street View Component
 * Alternative lightweight version using Google Street View Static API
 * Displays a fixed image instead of an interactive embed
 * 
 * Benefits:
 * - Lighter weight, faster loading
 * - Better for performance
 * - Fixed angle view
 * 
 * Requires: Google Maps API Key in environment variable VITE_GOOGLE_MAPS_API_KEY
 * 
 * Usage:
 * Replace StreetViewEmbed with StreetViewStatic in Footer.tsx and Contact.tsx
 */

const StreetViewStatic = () => {
  const latitude = 10.3060057;
  const longitude = 123.8945397;
  const heading = 39; // Direction camera faces (39.44° = optimal building entrance)
  const pitch = -8; // Vertical angle (-90 to 90, -7.63° looking slightly upward)
  const fov = 90; // Field of view (25-120, optimal viewing)
  const size = '600x450'; // Image size {width}x{height}

  // Get API key from environment
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // If no API key is configured, show a message
  if (!apiKey) {
    return (
      <div className="flex flex-col">
        <h3 className="text-2xl font-bold text-sky-400 mb-2">Visit Us - Street View</h3>
        <p className="text-sm text-gray-400 mb-4">
          To enable the street view image, please add your Google Maps API key to the environment variables.
        </p>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
          <p className="text-yellow-400 text-sm font-mono">
            VITE_GOOGLE_MAPS_API_KEY=your_api_key
          </p>
        </div>
        <a
          href="https://www.google.com/maps/@10.3060057,123.8945397,3a,90y,39.44h,97.63t"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
        >
          📍 View on Google Maps
        </a>
      </div>
    );
  }

  // Google Street View Static API URL
  const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${latitude},${longitude}&heading=${heading}&pitch=${pitch}&fov=${fov}&key=${apiKey}`;

  return (
    <div className="flex flex-col">
      <h3 className="text-2xl font-bold text-sky-400 mb-2">Visit Us - Our Location</h3>
      <p className="text-sm text-gray-400 mb-4">
        Street view of VisayasMed Hospital entrance and surrounding area
      </p>

      {/* Static Street View Image */}
      <div className="relative w-full rounded-lg overflow-hidden shadow-lg bg-gray-700">
        <img
          src={streetViewUrl}
          alt="VisayasMed Hospital Street View"
          className="w-full h-auto"
          loading="lazy"
        />
      </div>

      {/* Information */}
      <div className="mt-4 text-sm text-gray-500">
        <p>📍 VisayasMed Hospital, Cebu, Philippines</p>
        <p className="text-xs text-gray-600 mt-2">
          Heading: {heading}° | Pitch: {pitch}° | Field of View: {fov}°
        </p>
      </div>

      {/* Link to Interactive View */}
      <a
        href="https://www.google.com/maps/@10.3060057,123.8945397,3a,90y,39.44h,97.63t"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
      >
        🗺️ View on Google Maps
      </a>
    </div>
  );
};

export default StreetViewStatic;
