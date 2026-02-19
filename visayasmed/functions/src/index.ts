import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";

admin.initializeApp();
const corsHandler = cors({ origin: true });

// Cloud Function to handle file uploads
export const uploadDoctorProfilePhoto = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST" && req.method !== "OPTIONS") {
      res.status(405).send("Method not allowed");
      return;
    }

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.status(200).send("");
      return;
    }

    try {
      // Verify authentication token
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: "Unauthorized: No auth token" });
        return;
      }

      const token = authHeader.split(" ")[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Verify admin status (optional - add custom claims in Firebase Console)
      // if (!decodedToken.admin) {
      //   res.status(403).json({ error: "Forbidden: Admin access required" });
      //   return;
      // }

      // Get file data from request body
      const fileBuffer = req.body;
      if (!fileBuffer || fileBuffer.length === 0) {
        res.status(400).json({ error: "No file provided" });
        return;
      }

      // Upload to Storage
      const bucket = admin.storage().bucket();
      const timestamp = Date.now();
      const fileName = `doctor-profile-${timestamp}.jpg`;
      const file = bucket.file(`doctor-profile/${fileName}`);

      await file.save(fileBuffer, {
        metadata: {
          contentType: "image/jpeg",
          cacheControl: "public, max-age=3600",
        },
      });

      // Generate download URL
      const downloadURL = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });

      // Update Firestore admin/doctorProfile with the new photo URL (server-side write)
      try {
        const docRef = admin.firestore().doc('admin/doctorProfile');
        await docRef.set({ photoUrl: downloadURL[0] }, { merge: true });
      } catch (fsErr) {
        console.error('Failed to update Firestore with photo URL:', fsErr);
        // proceed; client will still receive downloadURL
      }

      res.status(200).json({
        success: true,
        downloadURL: downloadURL[0],
        fileName: fileName,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
});

// Helper function to generate signed URLs for existing files
export const generateSignedUrl = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }

    try {
      const { filePath } = req.body as { filePath: string };

      if (!filePath) {
        res.status(400).json({ error: "filePath is required" });
        return;
      }

      const bucket = admin.storage().bucket();
      const file = bucket.file(filePath);

      const signedUrl = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        url: signedUrl[0],
      });
    } catch (error) {
      console.error("Error generating signed URL:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
});

// Cloud Function to update doctor profile fields in Firestore
export const updateDoctorProfile = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST' && req.method !== 'OPTIONS') {
      res.status(405).send('Method not allowed');
      return;
    }

    if (req.method === 'OPTIONS') {
      res.status(200).send('');
      return;
    }

    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: 'Unauthorized: No auth token' });
        return;
      }

      const token = authHeader.split(' ')[1];
      await admin.auth().verifyIdToken(token);

      const profile = req.body;
      if (!profile || typeof profile !== 'object') {
        res.status(400).json({ error: 'Invalid profile payload' });
        return;
      }

      const docRef = admin.firestore().doc('admin/doctorProfile');
      await docRef.set(profile, { merge: true });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  });
});

// ========== ADMIN PUBLISHING FUNCTIONS ==========

/**
 * Publish slideshows data to be accessible by the main website
 */
export const publishSlideshows = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST" && req.method !== "OPTIONS") {
      res.status(405).send("Method not allowed");
      return;
    }

    if (req.method === "OPTIONS") {
      res.status(200).send("");
      return;
    }

    try {
      // Get all slideshows from Firestore
      const slideshowsSnapshot = await admin.firestore().collection("slideshows").orderBy("order", "asc").get();
      const slideshows = slideshowsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Store in a public collection for the main site to access
      await admin.firestore().collection("public").doc("slideshows").set({
        data: slideshows,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({
        success: true,
        message: "Slideshows published successfully",
        count: slideshows.length
      });
    } catch (error) {
      console.error("Error publishing slideshows:", error);
      res.status(500).json({
        error: "Failed to publish slideshows",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
});

/**
 * Publish page content to be accessible by the main website
 */
export const publishPageContent = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST" && req.method !== "OPTIONS") {
      res.status(405).send("Method not allowed");
      return;
    }

    if (req.method === "OPTIONS") {
      res.status(200).send("");
      return;
    }

    try {
      const { page } = req.body;

      if (!page) {
        res.status(400).json({ error: "Page name is required" });
        return;
      }

      // Get page content
      const pageSnapshot = await admin.firestore().collection("pages").doc(page).get();
      
      if (!pageSnapshot.exists) {
        res.status(404).json({ error: "Page not found" });
        return;
      }

      // Store in public collection
      await admin.firestore().collection("public").doc(`page_${page}`).set({
        data: pageSnapshot.data(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({
        success: true,
        message: `${page} page published successfully`
      });
    } catch (error) {
      console.error("Error publishing page content:", error);
      res.status(500).json({
        error: "Failed to publish page content",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
});

/**
 * Publish all doctors
 */
export const publishDoctors = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST" && req.method !== "OPTIONS") {
      res.status(405).send("Method not allowed");
      return;
    }

    if (req.method === "OPTIONS") {
      res.status(200).send("");
      return;
    }

    try {
      // Get all doctors
      const doctorsSnapshot = await admin.firestore().collection("doctors").orderBy("order", "asc").get();
      const doctors = doctorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Store in public collection
      await admin.firestore().collection("public").doc("doctors").set({
        data: doctors,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({
        success: true,
        message: "Doctors published successfully",
        count: doctors.length
      });
    } catch (error) {
      console.error("Error publishing doctors:", error);
      res.status(500).json({
        error: "Failed to publish doctors",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
});

/**
 * Publish all services
 */
export const publishServices = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST" && req.method !== "OPTIONS") {
      res.status(405).send("Method not allowed");
      return;
    }

    if (req.method === "OPTIONS") {
      res.status(200).send("");
      return;
    }

    try {
      // Get all services
      const servicesSnapshot = await admin.firestore().collection("services").orderBy("order", "asc").get();
      const services = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Store in public collection
      await admin.firestore().collection("public").doc("services").set({
        data: services,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({
        success: true,
        message: "Services published successfully",
        count: services.length
      });
    } catch (error) {
      console.error("Error publishing services:", error);
      res.status(500).json({
        error: "Failed to publish services",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
});
