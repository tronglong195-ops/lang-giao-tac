import api from './api';

export const postService = {
  async getPosts(params = {}) {
    const res = await api.get('/posts', { params });
    return res.data?.data;
  },

  async getPostBySlug(slug) {
    const res = await api.get(`/posts/${slug}`);
    return res.data?.data?.post;
  },

  async createPost(data) {
    const res = await api.post('/posts', data);
    return res.data;
  },

  async updatePost(id, data) {
    const res = await api.put(`/posts/${id}`, data);
    return res.data;
  },

  async deletePost(id) {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  },

  async getMyPosts(params = {}) {
    const res = await api.get('/posts/my/posts', { params });
    return res.data?.data;
  },

  async addComment(postId, content) {
    const res = await api.post('/comments', { postId, content });
    return res.data?.data?.comment;
  },

  async deleteComment(commentId) {
    const res = await api.delete(`/comments/${commentId}`);
    return res.data;
  },
};
