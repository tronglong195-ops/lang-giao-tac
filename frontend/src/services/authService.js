import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateFirebaseProfile,
  updatePassword as updateFirebasePassword,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../config/firebase';
import api, { setAccessToken } from './api';

// Helper: Lấy hoặc tạo hồ sơ người dùng trong Firestore
export const syncUserDoc = async (firebaseUser, additionalData = {}) => {
  if (!db || !firebaseUser) return null;

  const userRef = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(userRef);

  // Xác định vai trò Admin mặc định cho email quản trị viên
  const isAdminEmail =
    firebaseUser.email === 'admin@langgiaotac.vn' ||
    firebaseUser.email === 'tronglong195@gmail.com';

  if (!snap.exists()) {
    const newUserData = {
      id: firebaseUser.uid,
      fullName: additionalData.fullName || firebaseUser.displayName || 'Bà con Làng Giao Tác',
      email: firebaseUser.email,
      avatarUrl: firebaseUser.photoURL || '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
      role: isAdminEmail ? 'admin' : (additionalData.role || 'member'),
      hometownGroup: additionalData.hometownGroup || 'TDP 9 Thuận Lộc (Làng Giao Tác)',
      currentLocation: additionalData.currentLocation || 'Hà Tĩnh',
      bio: additionalData.bio || 'Con em quê hương Làng Giao Tác',
      isVerified: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...additionalData,
    };
    await setDoc(userRef, newUserData);
    return newUserData;
  }

  const existingData = snap.data();
  // Nếu là email admin mà role chưa phải admin thì tự động nâng cấp
  if (isAdminEmail && existingData.role !== 'admin') {
    await updateDoc(userRef, { role: 'admin', updatedAt: serverTimestamp() });
    existingData.role = 'admin';
  }
  return existingData;
};

export const authService = {
  async register(data) {
    if (isFirebaseConfigured && auth && db) {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      if (data.fullName) {
        await updateFirebaseProfile(userCredential.user, {
          displayName: data.fullName,
        });
      }
      const userDoc = await syncUserDoc(userCredential.user, {
        fullName: data.fullName,
        hometownGroup: data.hometownGroup,
        currentLocation: data.currentLocation,
      });
      return { status: 'success', data: { user: userDoc } };
    }

    // Fallback REST API
    const res = await api.post('/auth/register', data);
    if (res.data?.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async login(credentials) {
    if (isFirebaseConfigured && auth && db) {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      const userDoc = await syncUserDoc(userCredential.user);
      return { status: 'success', data: { user: userDoc } };
    }

    // Fallback REST API
    const res = await api.post('/auth/login', credentials);
    if (res.data?.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async loginWithGoogle(googleData = {}) {
    if (isFirebaseConfigured && auth && db) {
      const result = await signInWithPopup(auth, googleProvider);
      const userDoc = await syncUserDoc(result.user);
      return { status: 'success', data: { user: userDoc } };
    }

    // Fallback REST API
    const res = await api.post('/auth/google', googleData);
    if (res.data?.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async loginWithFacebook(facebookData) {
    // Fallback REST API
    const res = await api.post('/auth/facebook', facebookData);
    if (res.data?.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async refreshToken() {
    if (isFirebaseConfigured && auth) {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken(true);
        setAccessToken(token);
        const userDoc = await syncUserDoc(auth.currentUser);
        return { data: { user: userDoc, accessToken: token } };
      }
      return { data: null };
    }

    const res = await api.post('/auth/refresh-token');
    if (res.data?.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async logout() {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      } else {
        await api.post('/auth/logout');
      }
    } finally {
      setAccessToken(null);
    }
  },

  async getMe() {
    if (isFirebaseConfigured && auth && db) {
      if (auth.currentUser) {
        return await syncUserDoc(auth.currentUser);
      }
      return null;
    }

    const res = await api.get('/auth/me');
    return res.data?.data?.user;
  },

  async updateProfile(data) {
    if (isFirebaseConfigured && auth && db && auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      if (data.fullName) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: data.fullName,
        });
      }
      return await syncUserDoc(auth.currentUser);
    }

    const res = await api.put('/auth/profile', data);
    return res.data?.data?.user;
  },

  async changePassword(data) {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      await updateFirebasePassword(auth.currentUser, data.newPassword);
      return { status: 'success', message: 'Đổi mật khẩu thành công' };
    }

    const res = await api.put('/auth/change-password', data);
    return res.data;
  },
};
