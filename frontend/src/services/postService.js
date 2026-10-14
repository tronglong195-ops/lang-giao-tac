import api from './api';
import { firestoreDb } from './firestoreDb';
import { emailAlertService } from './emailAlertService';

const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

export const postService = {
  async getPosts(params = {}) {
    if (firestoreDb.isAvailable()) {
      try {
        const conditions = [];
        if (params.category && params.category !== 'all') {
          conditions.push(['category', '==', params.category]);
        }
        if (params.status && params.status !== 'all') {
          conditions.push(['status', '==', params.status]);
        } else if (!params.status) {
          conditions.push(['status', '==', 'published']);
        }

        let posts = await firestoreDb.getAll('posts', {
          conditions,
          orderField: 'createdAt',
          orderDir: 'desc',
          maxLimit: params.limit ? Number(params.limit) : 20,
        });

        posts = posts.map((p) => ({
          ...p,
          author: p.author || {
            id: p.authorId || 'admin_default',
            fullName: p.authorName || 'Ban Cán sự TDP 9 Thuận Lộc',
            avatarUrl: p.authorAvatar || '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
            hometownGroup: 'TDP 9 Thuận Lộc',
            currentLocation: 'Hà Tĩnh',
            bio: 'Ban Cán sự TDP 9 Thuận Lộc',
          },
        }));

        if (params.search) {
          const q = params.search.toLowerCase();
          posts = posts.filter(
            (p) =>
              p.title?.toLowerCase().includes(q) ||
              p.contentHtml?.toLowerCase().includes(q)
          );
        }

        return {
          posts,
          pagination: {
            page: Number(params.page || 1),
            limit: Number(params.limit || 10),
            total: posts.length,
            totalPages: Math.ceil(posts.length / (params.limit || 10)) || 1,
          },
        };
      } catch (err) {
        console.warn('[Firestore] Lỗi tải bài viết:', err.message);
      }
    }

    try {
      const res = await api.get('/posts', { params });
      return res.data?.data;
    } catch (e) {
      console.warn('Lỗi tải bài viết từ API:', e);
      return { posts: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } };
    }
  },

  async getPostBySlug(slug) {
    if (firestoreDb.isAvailable()) {
      const post = await firestoreDb.getOneByField('posts', 'slug', slug);
      if (post) {
        // Tải kèm comments
        const comments = await firestoreDb.getAll('comments', {
          conditions: [['postId', '==', post.id]],
          orderField: 'createdAt',
          orderDir: 'asc',
        });
        return {
          ...post,
          author: post.author || {
            id: post.authorId || 'admin_default',
            fullName: post.authorName || 'Ban Cán sự TDP 9 Thuận Lộc',
            avatarUrl: post.authorAvatar || '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
            hometownGroup: 'TDP 9 Thuận Lộc',
            currentLocation: 'Hà Tĩnh',
            bio: 'Ban Cán sự TDP 9 Thuận Lộc',
          },
          comments,
        };
      }
    }

    try {
      const res = await api.get(`/posts/${slug}`);
      return res.data?.data?.post;
    } catch (e) {
      console.warn('Lỗi tải bài viết chi tiết từ API:', e);
      return null;
    }
  },

  async createPost(data) {
    if (firestoreDb.isAvailable()) {
      const slug = slugify(data.title) + '-' + Date.now();
      const payload = {
        ...data,
        slug,
        status: data.status || 'pending',
        viewCount: 0,
      };
      const created = await firestoreDb.create('posts', payload);

      // Gửi email cảnh báo bài viết mới chờ duyệt
      emailAlertService.sendNewPostAlert({
        post: { ...payload, id: created.id },
        author: {
          fullName: data.authorName || data.author?.fullName || 'Bà con Làng',
          email: data.authorEmail || data.author?.email || '',
        },
      }).catch((err) => console.warn('Lỗi gửi email alert bài viết mới:', err));

      return { status: 'success', data: { post: created } };
    }

    const res = await api.post('/posts', data);
    return res.data;
  },

  async updatePost(id, data) {
    if (firestoreDb.isAvailable()) {
      const updated = await firestoreDb.update('posts', id, data);
      return { status: 'success', data: { post: updated } };
    }

    const res = await api.put(`/posts/${id}`, data);
    return res.data;
  },

  async deletePost(id) {
    if (firestoreDb.isAvailable()) {
      await firestoreDb.delete('posts', id);
      return { status: 'success', message: 'Đã xóa bài viết' };
    }

    const res = await api.delete(`/posts/${id}`);
    return res.data;
  },

  async getMyPosts(params = {}) {
    if (firestoreDb.isAvailable() && params.authorId) {
      const posts = await firestoreDb.getAll('posts', {
        conditions: [['authorId', '==', params.authorId]],
        orderField: 'createdAt',
        orderDir: 'desc',
      });
      return { posts, pagination: { total: posts.length } };
    }

    try {
      const res = await api.get('/posts/my/posts', { params });
      return res.data?.data;
    } catch (e) {
      console.warn('Lỗi tải bài viết của tôi từ API:', e);
      return { posts: [] };
    }
  },

  async addComment(postId, content, user = {}) {
    if (firestoreDb.isAvailable()) {
      const created = await firestoreDb.create('comments', {
        postId,
        content,
        userId: user.id || 'anonymous',
        userName: user.fullName || 'Bà con Làng Giao Tác',
        userAvatar: user.avatarUrl || '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
      });
      return created;
    }

    const res = await api.post('/comments', { postId, content });
    return res.data?.data?.comment;
  },

  async deleteComment(commentId) {
    if (firestoreDb.isAvailable()) {
      await firestoreDb.delete('comments', commentId);
      return { status: 'success' };
    }

    const res = await api.delete(`/comments/${commentId}`);
    return res.data;
  },
};
