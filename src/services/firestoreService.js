

import {
  doc,              
  getDoc,           
  setDoc,           
  deleteDoc,        
  collection,       
  addDoc,           
  updateDoc,        
  query,            
  where,            
  getDocs,          
  orderBy,          
  serverTimestamp,  
} from "firebase/firestore";

import { db, secondaryAuth } from "../firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";

export const createUserDocument = async (uid, data) => {
  await setDoc(doc(db, "users", uid), {
    uid,                                      
    name: data.name,                          
    email: data.email,                        
    phone: data.phone || "",                  
    role: data.role || "client",              
    serviceType: data.serviceType || "starter", 
    createdAt: serverTimestamp(),              
  });
};

export const getUserDocument = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

export const getAllPentesters = async () => {
  const q = query(collection(db, "users"), where("role", "==", "pentester"));
  const snap = await getDocs(q);
  
  return snap.docs.map((d) => d.data());
};

export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
};

export const requestAudit = async (clientId, clientName, formData) => {
  return addDoc(collection(db, "audits"), {
    clientId,                    
    clientName,                  
    title: formData.title,       
    description: formData.description, 
    scope: formData.scope,       
    status: "pending",           
    pentesterId: null,           
    pentesterName: null,
    requestedAt: serverTimestamp(), 
    assignedAt: null,            
    completedAt: null,           
  });
};

export const getAllAudits = async () => {
  const snap = await getDocs(collection(db, "audits"));
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  
  return docs.sort((a, b) => {
    const ta = a.requestedAt?.toDate?.() ?? new Date(0); 
    const tb = b.requestedAt?.toDate?.() ?? new Date(0);
    return tb - ta; 
  });
};

export const getClientAudits = async (clientId) => {
  const q = query(
    collection(db, "audits"),
    where("clientId", "==", clientId) 
  );
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  
  return docs.sort((a, b) => {
    const ta = a.requestedAt?.toDate?.() ?? new Date(0);
    const tb = b.requestedAt?.toDate?.() ?? new Date(0);
    return tb - ta;
  });
};

export const getPentesterAudits = async (pentesterId) => {
  const q = query(
    collection(db, "audits"),
    where("pentesterId", "==", pentesterId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const assignAudit = async (auditId, pentesterId, pentesterName) => {
  await updateDoc(doc(db, "audits", auditId), {
    pentesterId,                   
    pentesterName,                 
    status: "assigned",            
    assignedAt: serverTimestamp(), 
  });
};

export const updateAuditStatus = async (auditId, status) => {
  await updateDoc(doc(db, "audits", auditId), { status });
};

export const markAuditCompleted = async (auditId) => {
  await updateDoc(doc(db, "audits", auditId), {
    status: "completed",
    completedAt: serverTimestamp(),
  });
};

export const deleteAudit = async (auditId) => {
  await deleteDoc(doc(db, "audits", auditId));
};

export const adminCreateUser = async ({ name, email, password, role, phone, serviceType }) => {
  const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
  const uid = cred.user.uid;
  await signOut(secondaryAuth);
  await createUserDocument(uid, { name, email, phone, role, serviceType });
  return uid;
};

export const submitVulnerability = async (auditId, pentesterId, formData) => {
  return addDoc(collection(db, "audits", auditId, "vulnerabilities"), {
    title: formData.title,                        
    description: formData.description,             
    severity: formData.severity,                   
    cvssScore: parseFloat(formData.cvssScore) || 0, 
    affectedAssets: formData.affectedAssets || "",  
    evidence: formData.evidence || "",             
    status: "open",                                
    pentesterId,                                   
    discoveredAt: serverTimestamp(),               
  });
};

export const getVulnerabilities = async (auditId) => {
  const q = query(
    collection(db, "audits", auditId, "vulnerabilities"),
    orderBy("discoveredAt", "desc") 
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateVulnerabilityStatus = async (auditId, vulnId, status) => {
  await updateDoc(doc(db, "audits", auditId, "vulnerabilities", vulnId), { status });
};

export const submitScanResult = async (auditId, pentesterId, formData) => {
  return addDoc(collection(db, "audits", auditId, "scanResults"), {
    scanType: formData.scanType,     
    findings: formData.findings,     
    pentesterId,                     
    timestamp: serverTimestamp(),    
  });
};

export const getScanResults = async (auditId) => {
  const q = query(
    collection(db, "audits", auditId, "scanResults"),
    orderBy("timestamp", "desc") 
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
