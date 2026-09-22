import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../firebase";
import { updateProfile } from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Send user data to backend
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, {
            company_name: firebaseUser.displayName || "Unknown User",
            email: firebaseUser.email,
            firebase_uid: firebaseUser.uid,
          });
          setUser({ ...firebaseUser, dbId: res.data.id });
        } catch (error) {
          console.error("Error saving user to DB:", error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
      alert(`Login failed: ${error.message}\nMake sure your server is restarted if you just updated .env!`);
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signupWithEmail = async (email, password, company_name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: company_name });
      // To trigger a re-render/re-sync with the updated name
      setUser({ ...userCredential.user, displayName: company_name });
      
      // Also send to backend manually to ensure the correct name is saved immediately
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, {
        company_name: company_name,
        email: email,
        firebase_uid: userCredential.user.uid,
      });
      setUser((prev) => ({ ...prev, dbId: res.data.id }));
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, signupWithEmail, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
