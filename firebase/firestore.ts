import { db } from "@/firebase/config";
import { User } from "firebase/auth";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
} from "firebase/firestore";
async function createUserProfile(user: User, name: string) {
  const userRef = doc(db, "users", user.uid);
  await setDoc(
    userRef,
    {
      email: user.email,
      name: name,
    },
    { merge: true },
  );
}

async function getUserProfile(uid: string) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  return null;
}

interface ReceiptData {
  userId: string;
  storeName: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  imageUrl?: string | null;
}
async function createReceipt(receipt: ReceiptData) {
  const receiptsRef = collection(db, "receipts");
  const docRef = await addDoc(receiptsRef, {
    ...receipt,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
async function getUserReceipts(uid: string) {
  const receiptsRef = collection(db, "receipts");
  const q = query(
    receiptsRef,
    where("userId", "==", uid),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

export { createReceipt, createUserProfile, getUserProfile, getUserReceipts };
