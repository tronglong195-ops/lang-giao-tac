import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// Kiểm tra xem đã điền thông tin cấu hình Firebase chưa
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY'
);

let app = null;
let auth = null;
let db = null;
let storage = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  // ignoreUndefinedProperties: các form gửi trường tùy chọn để trống (vd. "Năm chụp") dưới dạng undefined;
  // mặc định Firestore từ chối cả bản ghi → bỏ qua trường undefined thay vì báo lỗi.
  db = initializeFirestore(app, { ignoreUndefinedProperties: true });
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} else {
  console.warn(
    '⚠️ [Firebase] Chưa cấu hình VITE_FIREBASE_* trong .env. Ứng dụng sẽ hoạt động ở chế độ dữ liệu cục bộ (Local Fallback).'
  );
}

export { app, auth, db, storage, googleProvider };
