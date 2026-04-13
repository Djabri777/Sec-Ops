

import React, { createContext, useContext, useEffect, useState } from "react";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "../firebase";

import { getUserDocument, createUserDocument } from "../services/firestoreService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  
  const [currentUser, setCurrentUser] = useState(null);     
  const [userRole, setUserRole] = useState(null);            
  const [userProfile, setUserProfile] = useState(null);      
  const [loading, setLoading] = useState(true);              

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        
        let profile = await getUserDocument(user.uid);

        if (!profile) {
          const defaultData = {
            name: user.displayName || user.email?.split('@')[0] || "User",
            email: user.email,
            phone: "",
            role: "client",  
            serviceType: "starter"
          };
          await createUserDocument(user.uid, defaultData);
          profile = await getUserDocument(user.uid);
        }

        setCurrentUser(user);                    
        setUserProfile(profile);                 
        setUserRole(profile?.role || "client");   
      } else {
        
        setCurrentUser(null);
        setUserProfile(null);
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []); 

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, userRole, userProfile, loading, logout }}>
      {}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
