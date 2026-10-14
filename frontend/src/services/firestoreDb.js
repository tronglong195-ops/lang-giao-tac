import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

/**
 * Tiện ích truy vấn tập hợp (Collection) Firestore
 */
export const firestoreDb = {
  isAvailable() {
    return isFirebaseConfigured && Boolean(db);
  },

  async getAll(colName, { conditions = [], orderField = 'createdAt', orderDir = 'desc', maxLimit } = {}) {
    if (!this.isAvailable()) return [];

    try {
      const colRef = collection(db, colName);
      const queryConstraints = [];

      conditions.forEach(([field, op, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryConstraints.push(where(field, op, value));
        }
      });

      if (orderField) {
        queryConstraints.push(orderBy(orderField, orderDir));
      }

      if (maxLimit) {
        queryConstraints.push(limit(maxLimit));
      }

      const q = query(colRef, ...queryConstraints);
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error(`[Firestore] Lỗi đọc collection ${colName}:`, err);
      // Fallback không có orderBy nếu thiếu index
      if (err.code === 'failed-precondition' || err.message?.includes('index')) {
        const fallbackSnap = await getDocs(collection(db, colName));
        return fallbackSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
      throw err;
    }
  },

  async getById(colName, id) {
    if (!this.isAvailable() || !id) return null;
    const docRef = doc(db, colName, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },

  async getOneByField(colName, field, value) {
    if (!this.isAvailable()) return null;
    const colRef = collection(db, colName);
    const q = query(colRef, where(field, '==', value), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docData = snap.docs[0];
    return { id: docData.id, ...docData.data() };
  },

  async create(colName, data, customId = null) {
    if (!this.isAvailable()) throw new Error('Firestore chưa được cấu hình.');
    const now = serverTimestamp();
    const payload = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    if (customId) {
      const docRef = doc(db, colName, customId);
      await setDoc(docRef, payload);
      return { id: customId, ...payload };
    }

    const docRef = await addDoc(collection(db, colName), payload);
    return { id: docRef.id, ...payload };
  },

  async update(colName, id, data) {
    if (!this.isAvailable()) throw new Error('Firestore chưa được cấu hình.');
    const docRef = doc(db, colName, id);
    const payload = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(docRef, payload);
    return { id, ...payload };
  },

  async delete(colName, id) {
    if (!this.isAvailable()) throw new Error('Firestore chưa được cấu hình.');
    const docRef = doc(db, colName, id);
    await deleteDoc(docRef);
    return { id, success: true };
  },
};
