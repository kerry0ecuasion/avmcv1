import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { db, storage } from '../firebase';

const DoctorProfileEditor: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'Dr. John Doe',
    specialty: 'General Medicine',
    photoUrl: '',
    bio: 'Experienced physician dedicated to patient care',
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'cloud-function' | 'direct'>('cloud-function');

  useEffect(() => {
    loadDoctorProfile();
  }, []);

  const loadDoctorProfile = async () => {
    try {
      // Try to fetch profile via Cloud Function (avoids Firestore client permissions issues)
      const cloudGetUrl = import.meta.env.VITE_CLOUD_FUNCTION_URL_GET ||
        'https://us-central1-visayasmed-53bbc.cloudfunctions.net/getDoctorProfile';

      const auth = getAuth();
      const user = auth.currentUser;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (user) {
        const idToken = await user.getIdToken();
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const resp = await fetch(cloudGetUrl, { method: 'GET', headers });
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.profile) {
          setProfile(data.profile as typeof profile);
          return;
        }
      }

      // Fallback: try direct Firestore read (may fail if rules disallow)
      const docRef = doc(db, 'admin', 'doctorProfile');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as typeof profile);
      }
    } catch (error) {
      console.error('Error loading doctor profile:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Solution 2: Upload using Cloud Function (Recommended for production)
  const uploadPhotoToCloudFunction = async (file: File): Promise<string> => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();
      const fileBuffer = await file.arrayBuffer();

      // Call the Cloud Function
      const cloudFunctionUrl = import.meta.env.VITE_CLOUD_FUNCTION_URL ||
        'https://us-central1-visayasmed-53bbc.cloudfunctions.net/uploadDoctorProfilePhoto';

      const response = await fetch(cloudFunctionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': file.type,
        },
        body: fileBuffer,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Cloud function upload failed');
      }

      const data = await response.json() as { downloadURL: string };
      return data.downloadURL;
    } catch (error) {
      console.error('Cloud Function upload failed:', error);
      throw error;
    }
  };

  // Solution 3: Upload using CORS proxy (Fallback for development)
  const uploadPhotoWithCorsProxy = async (file: File): Promise<string> => {
    try {
      const timestamp = Date.now();
      const fileName = `doctor-profile-${timestamp}.jpg`;
      const storageRef = ref(storage, `doctor-profile/${fileName}`);

      // Upload directly to Firebase Storage
      await uploadBytes(storageRef, file);
      let downloadUrl = await getDownloadURL(storageRef);

      // Add CORS proxy if direct access fails (fallback)
      // This is a temporary solution for development
      const testResponse = await fetch(downloadUrl, { method: 'HEAD' });
      if (!testResponse.ok) {
        downloadUrl = `https://cors-anywhere.herokuapp.com/${downloadUrl}`;
      }

      return downloadUrl;
    } catch (error) {
      console.error('Direct upload failed:', error);
      throw error;
    }
  };

  const handleSavePhoto = async () => {
    if (!selectedFile) {
      setMessage('Please select a file');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      let downloadUrl: string;

      // Try Cloud Function first (Solution 2)
      try {
        downloadUrl = await uploadPhotoToCloudFunction(selectedFile);
        setUploadMethod('cloud-function');
      } catch (cloudError) {
        console.warn('Cloud Function failed, trying direct upload with CORS proxy...', cloudError);
        // Fallback to direct upload with CORS proxy (Solution 3)
        downloadUrl = await uploadPhotoWithCorsProxy(selectedFile);
        setUploadMethod('direct');
      }

      // Server-side function already writes the photo URL to Firestore when uploading.
      // Update local state to reflect the new URL.
      setProfile({ ...profile, photoUrl: downloadUrl });
      // If we fell back to direct upload, attempt to persist the photoUrl via Cloud Function
      if (uploadMethod === 'direct') {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (user) {
            const idToken = await user.getIdToken();
            const cloudProfileUrl = import.meta.env.VITE_CLOUD_FUNCTION_URL_PROFILE ||
              'https://us-central1-visayasmed-53bbc.cloudfunctions.net/updateDoctorProfile';
            await fetch(cloudProfileUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ photoUrl: downloadUrl }),
            });
          }
        } catch (err) {
          console.warn('Failed to persist direct-upload photo URL to server:', err);
        }
      }
      setSelectedFile(null);
      setPreviewUrl(null);
      setMessage(
        `✓ Doctor photo updated successfully! (${uploadMethod === 'cloud-function' ? 'Cloud Function' : 'Direct Upload'})`
      );
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving photo:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      setMessage(`❌ Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      const idToken = await user.getIdToken();

      const cloudFunctionUrl = import.meta.env.VITE_CLOUD_FUNCTION_URL_PROFILE ||
        'https://us-central1-visayasmed-53bbc.cloudfunctions.net/updateDoctorProfile';

      const res = await fetch(cloudFunctionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update profile');
      }

      setMessage('✓ Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      setMessage(`❌ Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Doctor Profile</h2>

      {message && (
        <div className={`p-4 rounded-lg mb-4 ${message.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Photo Section */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xs">
            <img
              src={previewUrl || profile.photoUrl || '/placeholder-doctor.jpg'}
              alt="Doctor"
              className="w-full h-80 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="mt-4 w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {previewUrl && (
              <button
                onClick={handleSavePhoto}
                disabled={loading}
                className="mt-2 w-full bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
              >
                {loading ? 'Saving...' : 'Save Photo'}
              </button>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Doctor Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Specialty</label>
            <input
              type="text"
              value={profile.specialty}
              onChange={(e) => handleProfileChange('specialty', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleProfileChange('bio', e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-600 resize-none"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileEditor;
