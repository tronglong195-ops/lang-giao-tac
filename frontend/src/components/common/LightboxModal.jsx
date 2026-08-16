import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LightboxModal = ({
  photos = [],
  currentIndex = 0,
  isOpen = false,
  onClose,
  onIndexChange,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onIndexChange((currentIndex - 1 + photos.length) % photos.length);
      }
      if (e.key === 'ArrowRight') {
        onIndexChange((currentIndex + 1) % photos.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length, onClose, onIndexChange]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const handlePrev = (e) => {
    e.stopPropagation();
    onIndexChange((currentIndex - 1 + photos.length) % photos.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    onIndexChange((currentIndex + 1) % photos.length);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 backdrop-blur-md p-4 sm:p-6"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-surface/10 hover:bg-surface/20 text-surface flex items-center justify-center transition-colors border border-surface/20"
          aria-label="Đóng ảnh"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Counter */}
        <div className="absolute top-5 left-5 z-50 px-3.5 py-1.5 rounded-full bg-surface/10 text-surface text-xs font-semibold backdrop-blur-md border border-surface/20">
          {currentIndex + 1} / {photos.length}
        </div>

        {/* Previous Button */}
        {photos.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-6 z-50 w-12 h-12 rounded-full bg-surface/10 hover:bg-surface/25 text-surface flex items-center justify-center transition-transform hover:scale-105 border border-surface/20"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* Next Button */}
        {photos.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-6 z-50 w-12 h-12 rounded-full bg-surface/10 hover:bg-surface/25 text-surface flex items-center justify-center transition-transform hover:scale-105 border border-surface/20"
            aria-label="Ảnh sau"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}

        {/* Main Image Container */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="max-w-5xl max-h-[85vh] flex flex-col items-center select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentPhoto.imageUrl}
            alt={currentPhoto.caption || 'Ảnh làng Giao Tác'}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
          />

          {/* Caption & Metadata bar */}
          <div className="mt-4 w-full max-w-2xl bg-surface/10 backdrop-blur-md border border-surface/15 rounded-xl p-4 text-surface text-center space-y-1.5">
            {currentPhoto.caption && (
              <p className="text-sm sm:text-base font-medium text-surface">
                {currentPhoto.caption}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-paper/80 pt-1">
              {currentPhoto.takenYear && (
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-secondary" />
                  <span>Năm chụp: {currentPhoto.takenYear}</span>
                </span>
              )}

              {currentPhoto.uploader?.fullName && (
                <span className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-primary-light" />
                  <span>Đăng bởi: {currentPhoto.uploader.fullName}</span>
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
