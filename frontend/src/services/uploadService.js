import { ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from '../config/firebase';
import api from './api';

export const uploadService = {
  uploadImage: async (image, folder = 'giaotac_uploads') => {
    // 1. Nếu Firebase Storage khả dụng -> Upload trực tiếp lên Cloud Storage của Google
    if (isFirebaseConfigured && storage) {
      try {
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const storageRef = ref(storage, fileName);

        if (typeof image === 'string' && image.startsWith('data:')) {
          // Chuỗi base64 Data URL
          await uploadString(storageRef, image, 'data_url');
        } else if (image instanceof File || image instanceof Blob) {
          // Đối tượng File từ input file
          await uploadBytes(storageRef, image);
        } else {
          throw new Error('Định dạng hình ảnh không hợp lệ.');
        }

        const downloadUrl = await getDownloadURL(storageRef);
        return downloadUrl;
      } catch (err) {
        console.error('[Firebase Storage] Lỗi upload ảnh:', err);
      }
    }

    // 2. Fallback REST API
    const res = await api.post('/upload/image', { image, folder });
    return res.data?.data?.imageUrl;
  },

  uploadBatchImages: async (images, folder = 'giaotac_albums') => {
    if (isFirebaseConfigured && storage && Array.isArray(images)) {
      try {
        const uploadPromises = images.map((img) =>
          uploadService.uploadImage(img, folder)
        );
        return await Promise.all(uploadPromises);
      } catch (err) {
        console.error('[Firebase Storage] Lỗi upload lô ảnh:', err);
      }
    }

    const res = await api.post('/upload/images-batch', { images, folder });
    return res.data?.data?.imageUrls || [];
  },
};
