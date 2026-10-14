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
 * Chuyển đổi an toàn các đối tượng Firestore Timestamp thành chuỗi ISO
 */
function sanitizeData(data) {
  if (!data || typeof data !== 'object') return data;
  const out = Array.isArray(data) ? [] : {};
  for (const [key, val] of Object.entries(data)) {
    if (val && typeof val === 'object' && typeof val.toDate === 'function') {
      out[key] = val.toDate().toISOString();
    } else if (
      val &&
      typeof val === 'object' &&
      !Array.isArray(val) &&
      val.seconds !== undefined &&
      val.nanoseconds !== undefined
    ) {
      out[key] = new Date(val.seconds * 1000).toISOString();
    } else if (val && typeof val === 'object') {
      out[key] = sanitizeData(val);
    } else {
      out[key] = val;
    }
  }
  return out;
}

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
      return snap.docs.map((d) => ({ id: d.id, ...sanitizeData(d.data()) }));
    } catch (err) {
      console.warn(`[Firestore] Query collection ${colName} gặp cảnh báo (${err.code || err.message}). Kích hoạt fallback xử lý bộ nhớ:`, err);
      try {
        const fallbackSnap = await getDocs(collection(db, colName));
        let items = fallbackSnap.docs.map((d) => ({ id: d.id, ...sanitizeData(d.data()) }));

        // 1. Áp dụng conditions trong bộ nhớ
        if (conditions && conditions.length > 0) {
          items = items.filter((item) => {
            return conditions.every(([field, op, value]) => {
              if (value === undefined || value === null || value === '') return true;
              if (op === '==') return item[field] === value;
              if (op === '!=') return item[field] !== value;
              if (op === '>') return item[field] > value;
              if (op === '>=') return item[field] >= value;
              if (op === '<') return item[field] < value;
              if (op === '<=') return item[field] <= value;
              if (op === 'array-contains') return Array.isArray(item[field]) && item[field].includes(value);
              return true;
            });
          });
        }

        // 2. Sắp xếp theo orderField trong bộ nhớ
        if (orderField) {
          items.sort((a, b) => {
            const valA = a[orderField] ? (new Date(a[orderField]).getTime() || a[orderField]) : 0;
            const valB = b[orderField] ? (new Date(b[orderField]).getTime() || b[orderField]) : 0;
            if (valA < valB) return orderDir === 'asc' ? -1 : 1;
            if (valA > valB) return orderDir === 'asc' ? 1 : -1;
            return 0;
          });
        }

        // 3. Giới hạn số lượng
        if (maxLimit && items.length > maxLimit) {
          items = items.slice(0, maxLimit);
        }

        return items;
      } catch (fallbackErr) {
        console.error(`[Firestore] Fallback thất bại với ${colName}:`, fallbackErr);
        return [];
      }
    }
  },

  async getById(colName, id) {
    if (!this.isAvailable() || !id) return null;
    const docRef = doc(db, colName, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...sanitizeData(snap.data()) };
  },

  async getOneByField(colName, field, value) {
    if (!this.isAvailable()) return null;
    try {
      const colRef = collection(db, colName);
      const q = query(colRef, where(field, '==', value), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docData = snap.docs[0];
        return { id: docData.id, ...sanitizeData(docData.data()) };
      }
    } catch (e) {
      console.warn(`[Firestore] getOneByField ${colName} query error, trying fallback scan:`, e);
    }
    // Fallback: Quét toàn bộ collection nếu thiếu index
    const all = await this.getAll(colName);
    return all.find((item) => item[field] === value) || null;
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
