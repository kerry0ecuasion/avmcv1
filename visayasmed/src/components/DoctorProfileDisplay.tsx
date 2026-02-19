import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface DoctorProfile {
  name: string;
  specialty: string;
  photoUrl: string;
  bio: string;
}

const DoctorProfileDisplay: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'admin', 'doctorProfile');
    
    // Real-time listener for instant updates
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data() as DoctorProfile);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading doctor profile...</div>;
  }

  if (!profile) {
    return null;
  }

  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-sky-600 mb-8 text-center">Meet Our Doctor</h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Photo */}
          <div className="flex justify-center">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="w-full max-w-sm h-96 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full max-w-sm h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No photo available</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-3xl font-bold text-gray-800">{profile.name}</h3>
              <p className="text-lg text-sky-600 font-semibold">{profile.specialty}</p>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </p>
            </div>

            <div className="pt-4">
              <a 
                href="#contact" 
                className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Contact Doctor
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorProfileDisplay;
