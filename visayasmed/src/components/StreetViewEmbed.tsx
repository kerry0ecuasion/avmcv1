const StreetViewEmbed = () => {
  // VisayasMed Hospital coordinates in Cebu, Philippines - Exact location from Street View
  const latitude = 10.3060057;
  const longitude = 123.8945397;
  const heading = 39.44; // Direction the camera should face (39.44° = optimal building entrance view)
  const pitch = -7.63; // Vertical angle (-90 to 90, -7.63° looking slightly upward)
  const fov = 90; // Field of view (25-120, 90 = optimal building and context view)

  // Google Maps Embed API Street View URL
  // Format: https://www.google.com/maps/embed?pb=!4v{PARAMETERS}
  const streetViewUrl = `https://www.google.com/maps/embed?pb=!4v1707500000000!6m8!1m7!1s${encodeURIComponent(
    `VisayasMed Hospital, Cebu`
  )}!2m2!1d${latitude}!2d${longitude}!3f${heading}!4f${pitch}!5f${fov}`;

  return (
    <div className="flex flex-col">
      <h3 className="text-2xl font-bold text-sky-400 mb-2">Visit Us - Our Exact Location</h3>
      <p className="text-sm text-gray-400 mb-4">
        Explore the entrance and surrounding area of VisayasMed Hospital. Pan, zoom, and rotate to get a better sense of our location and building facade.
      </p>
      
      {/* Interactive Street View Embed */}
      <div className="relative w-full rounded-lg overflow-hidden shadow-lg" style={{ aspectRatio: '16/9' }}>
        <iframe
          src={streetViewUrl}
          width="100%"
          height="100%"
          style={{
            border: 0,
            borderRadius: '8px',
            minHeight: '400px',
          }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="VisayasMed Hospital Street View"
          allowFullScreen={true}
        />
      </div>

      {/* Helper Text */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>💡 <span className="text-gray-400">Tip: Use your mouse to drag and explore | Scroll to zoom | Right-click to rotate</span></p>
        <p>📍 <span className="text-gray-400">Location: VisayasMed Hospital, Cebu, Philippines</span></p>
      </div>

      {/* Link to Full Map */}
      <a
        href="https://www.google.com/maps/@10.3060057,123.8945397,3a,90y,39.44h,97.63t"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
      >
        📍 View on Google Maps
      </a>
    </div>
  );
};

export default StreetViewEmbed;
