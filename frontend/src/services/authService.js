import api, { setAccessToken } from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    if (res.data?.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async loginWithGoogle(googleData) {
    const res = await api.post('/auth/google', googleData);
    if (res.data?.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async loginWithFacebook(facebookData) {
    const res = await api.post('/auth/facebook', facebookData);
    if (res.data?.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async refreshToken() {
    const res = await api.post('/auth/refresh-token');
    if (res.data?.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data?.data?.user;
  },

  async updateProfile(data) {
    const res = await api.put('/auth/profile', data);
    return res.data?.data?.user;
  },

  async changePassword(data) {
    const res = await api.put('/auth/change-password', data);
    return res.data;
  },
};
