const prisma = require('../../config/db');
const { createSlug } = require('../../utils/slugify');

class PostService {
  async getPosts({ page = 1, limit = 9, category, search, status = 'published' }) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { contentHtml: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              hometownGroup: true,
              role: true,
            },
          },
          _count: {
            select: { comments: true },
          },
        },
      }),
    ]);

    return {
      posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / take) || 1,
      },
    };
  }

  async getPostBySlug(slug, user) {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            hometownGroup: true,
            currentLocation: true,
            bio: true,
            role: true,
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
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
        },
      },
    });

    if (!post) {
      throw new Error('Bài viết không tồn tại.');
    }

    // Nếu bài viết chưa publish, chỉ tác giả hoặc admin/moderator mới được xem
    if (post.status !== 'published') {
      const isAuthor = user && user.id === post.authorId;
      const isAdminOrMod = user && (user.role === 'admin' || user.role === 'moderator');
      if (!isAuthor && !isAdminOrMod) {
        throw new Error('Bài viết này đang chờ duyệt hoặc không ở trạng thái công khai.');
      }
    } else {
      // Tăng lượt xem cho bài viết đã xuất bản
      await prisma.post.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      });
      post.viewCount += 1;
    }

    return post;
  }

  async createPost(user, { title, contentHtml, coverImageUrl, category, status }) {
    if (!title || !contentHtml || !category) {
      throw new Error('Vui lòng điền đầy đủ tiêu đề, nội dung và chuyên mục bài viết.');
    }

    const slug = createSlug(title);

    // Quyền: Thành viên bình thường tạo bài mặc định là pending
    let initialStatus = 'pending';
    if (user.role === 'admin' || user.role === 'moderator') {
      if (status === 'published' || status === 'draft' || status === 'pending') {
        initialStatus = status;
      } else {
        initialStatus = 'published';
      }
    }

    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        title: title.trim(),
        slug,
        contentHtml,
        coverImageUrl: coverImageUrl?.trim() || null,
        category,
        status: initialStatus,
        publishedAt: initialStatus === 'published' ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            hometownGroup: true,
          },
        },
      },
    });

    return post;
  }

  async updatePost(user, postId, { title, contentHtml, coverImageUrl, category, status }) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Không tìm thấy bài viết.');
    }

    const isAuthor = post.authorId === user.id;
    const isAdminOrMod = user.role === 'admin' || user.role === 'moderator';

    if (!isAuthor && !isAdminOrMod) {
      throw new Error('Bạn không có quyền chỉnh sửa bài viết này.');
    }

    const updateData = {};
    if (title) {
      updateData.title = title.trim();
    }
    if (contentHtml) updateData.contentHtml = contentHtml;
    if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl?.trim() || null;
    if (category) updateData.category = category;

    if (isAdminOrMod && status) {
      updateData.status = status;
      if (status === 'published' && !post.publishedAt) {
        updateData.publishedAt = new Date();
      }
    } else if (isAuthor && !isAdminOrMod && post.status === 'rejected') {
      // Khi tác giả sửa lại bài bị từ chối, chuyển về pending để duyệt lại
      updateData.status = 'pending';
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            hometownGroup: true,
          },
        },
      },
    });

    return updated;
  }

  async deletePost(user, postId) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Không tìm thấy bài viết.');
    }

    const isAuthor = post.authorId === user.id;
    const isAdminOrMod = user.role === 'admin' || user.role === 'moderator';

    if (!isAuthor && !isAdminOrMod) {
      throw new Error('Bạn không có quyền xóa bài viết này.');
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return { message: 'Đã xóa bài viết thành công.' };
  }

  async getMyPosts(userId, { page = 1, limit = 10, status }) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = { authorId: userId };
    if (status && status !== 'all') {
      where.status = status;
    }

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { comments: true },
          },
        },
      }),
    ]);

    return {
      posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / take) || 1,
      },
    };
  }
}

module.exports = new PostService();
