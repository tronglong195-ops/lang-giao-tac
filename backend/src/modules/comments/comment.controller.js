const commentService = require('./comment.service');

class CommentController {
  async createComment(req, res) {
    try {
      const { postId, photoId, content } = req.body;
      const comment = await commentService.createComment(req.user, {
        postId,
        photoId,
        content,
      });

      return res.status(201).json({
        success: true,
        message: 'Thêm bình luận thành công.',
        data: { comment },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi bình luận.',
      });
    }
  }

  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const result = await commentService.deleteComment(req.user, id);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi xóa bình luận.',
      });
    }
  }
}

module.exports = new CommentController();
