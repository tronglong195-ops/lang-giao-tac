import api from './api';

export const uploadService = {
  uploadImage: async (image, folder = 'giaotac_uploads') => {
    const res = await api.post('/upload/image', { image, folder });
    return res.data?.data?.imageUrl;
  },

  uploadBatchImages: async (images, folder = 'giaotac_albums') => {
    const res = await api.post('/upload/images-batch', { images, folder });
    return res.data?.data?.imageUrls || [];
  },
};
