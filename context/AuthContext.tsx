"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, signInWithPopup, GoogleAuthProvider, signOut, db, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "@/lib/firebase";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  bookmarks: string[];
  toggleBookmark: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  bookmarks: [],
  toggleBookmark: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Load from local storage initially (for non-logged in users or missing config)
  useEffect(() => {
    const localBM = localStorage.getItem("dalnaru_bookmarks");
    if (localBM) {
      setBookmarks(JSON.parse(localBM));
    }
    
    // Auth listener
    try {
      const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        if (currentUser) {
          // fetch bookmarks from firestore
          try {
            const userRef = doc(db, "users", currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setBookmarks(userSnap.data().bookmarks || []);
            } else {
              await setDoc(userRef, { bookmarks: [] });
            }
          } catch(e) {
            console.warn("Firestore error, falling back to local storage", e);
          }
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firebase Auth is not configured properly", e);
      setLoading(false);
    }
  }, []);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Login failed", e);
      alert("로그인 중 오류가 발생했습니다. (Firebase 설정이 필요할 수 있습니다)");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleBookmark = async (id: string) => {
    const isBookmarked = bookmarks.includes(id);
    const newBookmarks = isBookmarked 
      ? bookmarks.filter(b => b !== id) 
      : [...bookmarks, id];
    
    setBookmarks(newBookmarks);
    localStorage.setItem("dalnaru_bookmarks", JSON.stringify(newBookmarks));

    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        if (isBookmarked) {
          await updateDoc(userRef, { bookmarks: arrayRemove(id) });
        } else {
          await updateDoc(userRef, { bookmarks: arrayUnion(id) });
        }
      } catch (e) {
        console.warn("Could not save to Firestore", e);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, bookmarks, toggleBookmark }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
