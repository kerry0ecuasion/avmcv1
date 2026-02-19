const CTABanner = () => {
  return (
    <section className="py-12 lg:py-16 bg-linear-to-r from-sky-600 to-blue-700 dark:from-sky-700 dark:to-blue-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <h2 className="text-3xl lg:text-4xl font-light mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-lg font-light text-sky-100 mb-6 leading-relaxed">
              Join thousands of patients who trust VisayasMed for their healthcare needs. Our experienced team is ready to provide you with compassionate, world-class medical care.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "✓ Experienced specialists available 24/7",
                "✓ State-of-the-art facilities and technology",
                "✓ Personalized treatment plans for your needs",
              ].map((item, idx) => (
                <li key={idx} className="text-sky-100 font-light flex items-center gap-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right CTA Buttons */}
          <div className="space-y-4 flex flex-col">
            <a
              href="#find-doctor"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-sky-700 font-semibold rounded-lg hover:bg-sky-50 transition-all duration-300 hover:shadow-lg hover:scale-105 text-lg"
            >
              Schedule Appointment
              <span className="ml-2">→</span>
            </a>
            <a
              href="tel:+63322531901"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:scale-105 text-lg"
            >
              Call Us Now
              <span className="ml-2">📞</span>
            </a>
            <p className="text-center text-sky-100 font-light text-sm pt-2">
              Emergency? Call 911 for immediate assistance
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
