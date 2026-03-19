import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Import the Firebase configuration directly from the root
import firebaseConfig from '../firebase-applet-config.json';

console.log("Firebase Config (from JSON):", { ...firebaseConfig, apiKey: "REDACTED" });

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use the named database ID from the config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection to Firestore
async function testConnection() {
  try {
    console.log("Testing connection to database:", firebaseConfig.firestoreDatabaseId);
    // Using getDocFromServer to bypass cache and test real connection
    const testDoc = doc(db, 'test', 'connection');
    await getDocFromServer(testDoc);
    console.log("Firestore connection successful (document might not exist, but no permission error)");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('the client is offline')) {
        console.error("Firestore connection failed: the client is offline. Please check your Firebase configuration.");
      } else if (error.message.includes('permission')) {
        console.error("Firestore connection failed: Missing or insufficient permissions. Current rules might not be applied to this database instance.");
      } else {
        console.error("Firestore connection test error:", error.message);
      }
    } else {
      console.error("Firestore connection test error:", error);
    }
  }
}

testConnection();
