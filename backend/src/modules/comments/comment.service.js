const prisma = require('../../config/db');

class CommentService {
  async createComment(user, { postId, photoId, content }) {
    if (!content || !content.trim()) {
      throw new Error('Nội dung bình luận không được để trống.');
    }

    if (!postId && !photoId) {
      throw new Error('Vui lòng chỉ định bài viết hoặc ảnh để bình luận.');
    }

    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        postId: postId || null,
        photoId: photoId || null,
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            hometownGroup: true,
            role: true,
          },
        },
      },
    });

    return comment;
  }

  async deleteComment(user, commentId) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('Bình luận không tồn tại.');
    }

    const isAuthor = comment.userId === user.id;
    const isAdminOrMod = user.role === 'admin' || user.role === 'moderator';

    if (!isAuthor && !isAdminOrMod) {
      throw new Error('Bạn không có quyền xóa bình luận này.');
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return { message: 'Đã xóa bình luận thành công.' };
  }
}

module.exports = new CommentService();
