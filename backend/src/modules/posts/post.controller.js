const postService = require('./post.service');

class PostController {
  async getPosts(req, res) {
    try {
      const { page, limit, category, search, status } = req.query;
      const result = await postService.getPosts({ page, limit, category, search, status });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tải danh sách bài viết.',
      });
    }
  }

  async getPostBySlug(req, res) {
    try {
      const { slug } = req.params;
      const post = await postService.getPostBySlug(slug, req.user);

      return res.status(200).json({
        success: true,
        data: { post },
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message || 'Không tìm thấy bài viết.',
      });
    }
  }

  async createPost(req, res) {
    try {
      const { title, contentHtml, coverImageUrl, category, status } = req.body;
      const post = await postService.createPost(req.user, {
        title,
        contentHtml,
        coverImageUrl,
        category,
        status,
      });

      return res.status(201).json({
        success: true,
        message:
          post.status === 'pending'
            ? 'Bài viết của bạn đã được gửi và đang chờ Ban quản trị duyệt.'
            : 'Đăng bài viết thành công.',
        data: { post },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tạo bài viết.',
      });
    }
  }

  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { title, contentHtml, coverImageUrl, category, status } = req.body;

      const post = await postService.updatePost(req.user, id, {
        title,
        contentHtml,
        coverImageUrl,
        category,
        status,
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật bài viết thành công.',
        data: { post },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật bài viết.',
      });
    }
  }

  async deletePost(req, res) {
    try {
      const { id } = req.params;
      const result = await postService.deletePost(req.user, id);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi xóa bài viết.',
      });
    }
  }

  async getMyPosts(req, res) {
    try {
      const { page, limit, status } = req.query;
      const result = await postService.getMyPosts(req.user.id, { page, limit, status });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi lấy danh sách bài viết của bạn.',
      });
    }
  }
}

module.exports = new PostController();
