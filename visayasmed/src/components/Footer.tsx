const Footer = () => (
  <footer id="contact" className="bg-gray-900 dark:bg-gray-950 text-white py-12 transition-colors duration-300">
    <div className="max-w-6xl mx-auto px-6">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left: Google Map with Street View */}
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold text-sky-400 mb-4">Visit Us</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m0!3m2!1sen!2sph!4v1234!5m2!1sen!2sph!6m8!1m7!1sqX9m3vqoPlKajP0hvNgC5w!2m2!1d10.3059147!2d123.8945713!3f37.02!4f4.43!5f0.9"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="VisayasMed Hospital - Street View of Hospital Entrance"
            allowFullScreen
          />
          <p className="text-xs text-gray-400 mt-2 font-medium">
            📍 Studio view of VisayasMed Hospital entrance
          </p>
        </div>

        {/* Right: Contact Information & Form */}
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold text-sky-400 mb-4">Contact Us</h3>
          
          {/* Contact Details */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col">
              <label className="text-sky-300 font-semibold">Phone</label>
              <a href="tel:(+32)253-1901" className="text-gray-300 hover:text-sky-400 transition">
                (+32) 253-1901
              </a>
              <a href="tel:09773212615" className="text-gray-300 hover:text-sky-400 transition text-sm">
                0977-321-2615 | 0970-369-5188
              </a>
            </div>

            <div className="flex flex-col">
              <label className="text-sky-300 font-semibold">Email</label>
              <a href="mailto:Info@visayasmed.com.ph" className="text-gray-300 hover:text-sky-400 transition">
                Info@visayasmed.com.ph
              </a>
            </div>

            <div className="flex flex-col">
              <label className="text-sky-300 font-semibold">Address</label>
              <p className="text-gray-300">VisayasMed Hospital, Cebu, Philippines</p>
            </div>
          </div>

          {/* Quick Contact Form */}
          <form className="space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 transition"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 transition"
            />
            <textarea
              placeholder="Message"
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 transition resize-none"
            />
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="pt-6 text-center text-gray-400 text-sm">
        <p>&copy; 2026 VisayasMed Hospital. All rights reserved. | Trusted care across generations.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
