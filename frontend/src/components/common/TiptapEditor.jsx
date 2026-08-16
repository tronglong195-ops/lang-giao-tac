import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link2,
  Image as ImageIcon,
  Undo,
  Redo,
} from 'lucide-react';

export const TiptapEditor = ({ content = '', onChange, placeholder = 'Viết nội dung bài viết của bạn tại đây...' }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline font-medium',
        },
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-4 shadow-warm mx-auto',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'tiptap-content min-h-[300px] p-4 sm:p-6 bg-surface focus:outline-none rounded-b-2xl prose max-w-none text-ink',
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  if (!editor) {
    return (
      <div className="h-64 rounded-2xl bg-surface border border-warmBorder animate-pulse flex items-center justify-center text-ink-muted text-sm">
        Đang tải trình soạn thảo...
      </div>
    );
  }

  const handleAddImage = (e) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      editor.chain().focus().setImage({ src: imageUrlInput.trim() }).run();
      setImageUrlInput('');
      setShowImageModal(false);
    }
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (linkUrlInput.trim()) {
      editor.chain().focus().setLink({ href: linkUrlInput.trim() }).run();
      setLinkUrlInput('');
      setShowLinkModal(false);
    }
  };

  return (
    <div className="rounded-2xl border border-warmBorder bg-surface shadow-warm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2.5 bg-paper border-b border-warmBorder select-none">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
            editor.isActive('bold')
              ? 'bg-primary text-surface'
              : 'text-ink hover:bg-surface hover:text-primary'
          }`}
          title="In đậm (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
            editor.isActive('italic')
              ? 'bg-primary text-surface'
              : 'text-ink hover:bg-surface hover:text-primary'
          }`}
          title="In nghiêng (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
            editor.isActive('strike')
              ? 'bg-primary text-surface'
              : 'text-ink hover:bg-surface hover:text-primary'
          }`}
          title="Gạch ngang"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-warmBorder mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-primary text-surface'
              : 'text-ink hover:bg-surface hover:text-primary'
          }`}
          title="Tiêu đề lớn (H1)"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-primary text-surface'
              : 'text-ink hover:bg-surface hover:text-primary'
          }`}
          title="Tiêu đề vừa (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-primary text-surface'
              : 'text-ink hover:bg-surface hover:text-primary'
          }`}
          title="Tiêu đề nhỏ (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-warmBorder mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-primary text-surface'
              : 'text-ink hover:bg-surface hover:text-primary'
          }`}
          title="Danh sách gạch đầu dòng"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-primary text-surface'
              : 'text-ink hover:bg-surface hover:text-primary'
          }`}
          title="Danh sách số"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-primary text-surface'
              : 'text-ink hover:bg-surface hover:text-primary'
          }`}
          title="Trích dẫn"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded-lg text-xs text-ink hover:bg-surface hover:text-primary transition-colors"
          title="Đường phân cách ngang"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-warmBorder mx-1"></div>

        {/* Link Button */}
        <button
          type="button"
          onClick={() => setShowLinkModal(true)}
          className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
            editor.isActive('link')
              ? 'bg-primary text-surface'
              : 'text-ink hover:bg-surface hover:text-primary'
          }`}
          title="Chèn liên kết"
        >
          <Link2 className="w-4 h-4" />
        </button>

        {/* Image Button */}
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="p-2 rounded-lg text-xs text-ink hover:bg-surface hover:text-primary transition-colors"
          title="Chèn hình ảnh (Cloudinary / URL)"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-warmBorder mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-lg text-xs text-ink hover:bg-surface disabled:opacity-40 transition-colors"
          title="Hoàn tác (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-lg text-xs text-ink hover:bg-surface disabled:opacity-40 transition-colors"
          title="Làm lại (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />

      {/* Image URL Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl border border-warmBorder max-w-md w-full p-6 space-y-4 shadow-warmHover">
            <h3 className="font-bold text-lg text-ink">Chèn hình ảnh vào bài viết</h3>
            <p className="text-xs text-ink-muted">
              Dán URL hình ảnh từ Cloudinary hoặc các dịch vụ lưu trữ ảnh trực tuyến:
            </p>
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://res.cloudinary.com/... hoặc link ảnh"
              className="w-full input-warm text-sm"
              autoFocus
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-ink hover:bg-paper"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 rounded-xl bg-primary text-surface text-sm font-semibold hover:bg-primary-dark shadow-sm"
              >
                Chèn ảnh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link URL Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl border border-warmBorder max-w-md w-full p-6 space-y-4 shadow-warmHover">
            <h3 className="font-bold text-lg text-ink">Chèn liên kết trang web</h3>
            <input
              type="url"
              value={linkUrlInput}
              onChange={(e) => setLinkUrlInput(e.target.value)}
              placeholder="https://example.com"
              className="w-full input-warm text-sm"
              autoFocus
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-ink hover:bg-paper"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddLink}
                className="px-4 py-2 rounded-xl bg-primary text-surface text-sm font-semibold hover:bg-primary-dark shadow-sm"
              >
                Gắn liên kết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
