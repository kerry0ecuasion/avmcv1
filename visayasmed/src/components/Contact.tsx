const Contact = () => (
  <section className="relative z-10 py-12 px-6 bg-gray-50/90 dark:bg-gray-900/95 backdrop-blur-sm transition-colors duration-300">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-sky-600 dark:text-sky-400 mb-4">Contact Us</h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
        Get in touch with us or visit our hospital. Find our location details and reach out using the information below.
      </p>

      {/* Map and Contact Information Section */}
      <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Google Map with Street View */}
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-sky-600 dark:text-sky-400 mb-4">Visit Us</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m0!3m2!1sen!2sph!4v1234!5m2!1sen!2sph!6m8!1m7!1sqX9m3vqoPlKajP0hvNgC5w!2m2!1d10.3059147!2d123.8945713!3f37.02!4f4.43!5f0.9"
            width="100%"
            height="320"
            style={{ border: 0, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="VisayasMed Hospital - Street View of Hospital Entrance"
            allowFullScreen
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
            📍 Studio view of VisayasMed Hospital entrance - Explore the building and surroundings
          </p>
        </div>

        {/* Right: Contact Information */}
        <div>
          <h3 className="text-xl font-bold text-sky-600 dark:text-sky-400 mb-6">Contact Information</h3>

          {/* Phone */}
          <div className="mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-sky-500 text-xl mt-1">📞</div>
              <div className="flex-1">
                <label className="font-semibold text-gray-900 dark:text-sky-300 block mb-2">Phone</label>
                <a href="tel:(+32)253-1901" className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition block text-sm">
                  (+32) 253-1901
                </a>
                <a href="tel:09773212615" className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition text-sm block">
                  0977-321-2615
                </a>
                <a href="tel:09703695188" className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition text-sm block">
                  0970-369-5188
                </a>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-sky-500 text-xl mt-1">✉️</div>
              <div className="flex-1">
                <label className="font-semibold text-gray-900 dark:text-sky-300 block mb-2">Email</label>
                <a href="mailto:Info@visayasmed.com.ph" className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition text-sm break-all">
                  Info@visayasmed.com.ph
                </a>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-sky-500 text-xl mt-1">📍</div>
              <div className="flex-1">
                <label className="font-semibold text-gray-900 dark:text-sky-300 block mb-2">Address</label>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                  VisayasMed Hospital<br />
                  Cebu, Philippines
                </p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <div className="flex items-start space-x-3">
              <div className="text-sky-500 text-xl mt-1">🕐</div>
              <div className="flex-1">
                <label className="font-semibold text-gray-900 dark:text-sky-300 block mb-2">Hours</label>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  24/7<br />
                  <span className="font-medium">Always Open</span><br />
                  Emergency Services Available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Form - Full Width Below */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-10">
        <h3 className="text-2xl font-bold text-sky-600 dark:text-sky-400 mb-8 text-center">Send us a Message</h3>
        
        <div className="max-w-2xl mx-auto bg-white/90 dark:bg-gray-800/90 p-8 rounded-lg shadow-md backdrop-blur-sm">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number (Optional)</label>
              <input
                type="tel"
                placeholder="+63 (XXX) XXX-XXXX"
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
              <textarea
                placeholder="Please share your message with us..."
                rows={5}
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition resize-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded transition duration-200 transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

export default Contact;
