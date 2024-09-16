import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, remove, get} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdX4OwIYAJCo6tmPjOzxK0zxaIkLWg4ag",
  authDomain: "orientatree.firebaseapp.com",
  databaseURL: "https://orientatree-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "orientatree",
  storageBucket: "orientatree.appspot.com",
  messagingSenderId: "828863035782",
  appId: "1:828863035782:web:3630e26dbf8a7904a9d407",
  measurementId: "G-CHSG8F2MEK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

// Export the auth and database for use in other files
export { auth, database, signInWithEmailAndPassword, createUserWithEmailAndPassword, ref, set, remove, get };