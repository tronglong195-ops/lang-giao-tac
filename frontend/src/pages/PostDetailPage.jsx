import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  User,
  Eye,
  MessageSquare,
  ArrowLeft,
  Share2,
  Send,
  Trash2,
  MapPin,
  Heart,
  CornerDownRight,
} from 'lucide-react';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { ShareModal } from '../components/common/ShareModal';

export const PostDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const data = await postService.getPostBySlug(slug);
      if (data) {
        setPost(data);
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const newComment = await postService.addComment(post.id, commentText.trim());
      if (newComment) {
        setPost((prev) => ({
          ...prev,
          comments: [newComment, ...(prev.comments || [])],
        }));
        setCommentText('');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Không thể gửi bình luận.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này không?')) return;
    try {
      await postService.deleteComment(commentId);
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c.id !== commentId),
      }));
    } catch (error) {
      alert('Không thể xóa bình luận.');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-ink-muted">
        Đang tải bài viết...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-surface rounded-2xl border border-warmBorder text-center space-y-4 shadow-warm">
        <h2 className="text-xl font-bold text-ink">Không tìm thấy bài viết</h2>
        <p className="text-sm text-ink-muted">
          Bài viết có thể đang chờ duyệt, bị gỡ hoặc không tồn tại.
        </p>
        <Link
          to="/bai-viet"
          className="inline-block px-5 py-2.5 rounded-xl bg-primary text-surface font-medium text-sm"
        >
          Quay lại danh sách bài viết
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-sm font-medium text-ink-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <button
          onClick={() => setShowShareModal(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-secondary/15 hover:bg-secondary/25 text-accent font-semibold text-xs transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Chia sẻ bài viết</span>
        </button>
      </div>

      {/* Main Post Article */}
      <article className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-10 shadow-warm space-y-8">
        {/* Post Header */}
        <div className="space-y-4 border-b border-warmBorder pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-primary-subtle text-primary font-bold">
              {post.category}
            </span>
            <span className="text-ink-light">•</span>
            <span className="flex items-center space-x-1 text-ink-muted font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
            </span>
            <span className="text-ink-light">•</span>
            <span className="flex items-center space-x-1 text-ink-muted font-medium">
              <Eye className="w-3.5 h-3.5" />
              <span>{post.viewCount} lượt xem</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-primary-dark tracking-tight leading-snug">
            {post.title}
          </h1>

          {/* Author Meta Header */}
          <div className="flex items-center space-x-3 pt-2">
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.fullName}
                className="w-10 h-10 rounded-full object-cover border border-primary/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary text-surface flex items-center justify-center font-bold text-sm">
                {post.author.fullName.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-ink">{post.author.fullName}</p>
              <div className="flex items-center space-x-2 text-xs text-accent">
                {post.author.hometownGroup && <span>{post.author.hometownGroup}</span>}
                {post.author.currentLocation && (
                  <>
                    <span>•</span>
                    <span>Đang ở: {post.author.currentLocation}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="rounded-2xl overflow-hidden shadow-warm">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full max-h-[450px] object-cover"
            />
          </div>
        )}

        {/* Rich Text Body */}
        <div
          className="tiptap-content text-base sm:text-lg leading-relaxed text-ink/90"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Author Bio Card */}
        <div className="mt-10 p-6 rounded-2xl bg-paper border border-warmBorder flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {post.author.avatarUrl ? (
            <img
              src={post.author.avatarUrl}
              alt={post.author.fullName}
              className="w-14 h-14 rounded-2xl object-cover shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-primary text-surface flex items-center justify-center font-bold text-xl shrink-0">
              {post.author.fullName.charAt(0)}
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-base text-ink">{post.author.fullName}</h4>
              <span className="text-xs text-primary bg-primary-subtle px-2 py-0.5 rounded-full font-medium">
                Tác giả
              </span>
            </div>
            {post.author.bio && (
              <p className="text-xs text-ink-muted leading-relaxed">{post.author.bio}</p>
            )}
            <p className="text-xs text-accent">
              Quê quán: {post.author.hometownGroup || 'Làng Giao Tác (Hà Tĩnh)'}
            </p>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-warm space-y-6">
        <div className="flex items-center space-x-2 border-b border-warmBorder pb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg text-ink">
            Bình luận & Tâm tình ({post.comments ? post.comments.length : 0})
          </h3>
        </div>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleAddComment} className="space-y-3">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Gửi lời chia sẻ, cảm nghĩ của bạn tới tác giả..."
              className="w-full input-warm text-sm resize-none"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-primary text-surface text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>{submittingComment ? 'Đang gửi...' : 'Gửi bình luận'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-paper border border-warmBorder text-center space-y-2">
            <p className="text-xs sm:text-sm text-ink-muted">
              Vui lòng đăng nhập để gửi lời bình luận và tâm tình cùng bà con quê hương.
            </p>
            <Link
              to="/dang-nhap"
              className="inline-block px-4 py-2 rounded-xl bg-primary text-surface text-xs font-semibold hover:bg-primary-dark"
            >
              Đăng nhập ngay
            </Link>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4 pt-2">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => {
              const canDelete =
                user &&
                (user.id === comment.userId || user.role === 'admin' || user.role === 'moderator');

              return (
                <div
                  key={comment.id}
                  className="p-4 rounded-xl bg-paper border border-warmBorder/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      {comment.user?.avatarUrl ? (
                        <img
                          src={comment.user.avatarUrl}
                          alt={comment.user.fullName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary text-surface flex items-center justify-center font-bold text-xs">
                          {comment.user?.fullName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-bold text-ink">
                          {comment.user?.fullName}
                        </span>
                        {comment.user?.hometownGroup && (
                          <span className="text-[10px] text-accent ml-2">
                            ({comment.user.hometownGroup})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-ink-light">
                        {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 text-ink-light hover:text-red-600 rounded"
                          title="Xóa bình luận"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-ink leading-relaxed pl-9">
                    {comment.content}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-center py-6 text-xs text-ink-muted">
              Chưa có bình luận nào. Hãy là người đầu tiên để lại lời tâm tình!
            </p>
          )}
        </div>
      </section>

      {/* Share Modal */}
      {post && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={post.title}
          url={`/bai-viet/${post.slug}`}
          description={post.title}
        />
      )}
    </div>
  );
};
