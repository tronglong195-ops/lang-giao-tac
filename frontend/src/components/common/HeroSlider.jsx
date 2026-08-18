import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDirectImageUrl } from '../../utils/imageHelper';

export const HeroSlider = ({ slides = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Preload ảnh của các slide tiếp theo để chuyển cảnh tức thì không bị giật/lag
  useEffect(() => {
    if (slides && slides.length > 0) {
      slides.forEach((slide) => {
        if (slide.imageUrl) {
          const img = new Image();
          img.src = getDirectImageUrl(slide.imageUrl);
        }
      });
    }
  }, [slides]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];
  const directImageUrl = getDirectImageUrl(currentSlide.imageUrl);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="relative w-full h-[480px] sm:h-[540px] md:h-[620px] overflow-hidden bg-ink select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Image with Ken Burns & Crossfade Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <div
            className="w-full h-full bg-cover bg-center animate-kenburns"
            style={{
              backgroundImage: `url(${directImageUrl})`,
            }}
          />
          {/* Subtle Warm Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/20"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-3xl space-y-4"
          >
            {/* Tag / Badge */}
            {currentSlide.tag && (
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-secondary/90 text-ink backdrop-blur-sm shadow-sm tracking-wide uppercase">
                {currentSlide.tag}
              </span>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-surface tracking-tight leading-tight drop-shadow-md">
              {currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-paper/90 leading-relaxed drop-shadow">
              {currentSlide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              {currentSlide.link && (
                <Link
                  to={currentSlide.link}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-primary text-surface font-semibold text-sm hover:bg-primary-dark transition-all duration-200 shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
                >
                  <span>{currentSlide.linkText || 'Khám phá ngay'}</span>
                  <Compass className="w-4 h-4" />
                </Link>
              )}
              <Link
                to="/ban-do"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-surface/20 text-surface backdrop-blur-md font-medium text-sm hover:bg-surface/30 transition-colors border border-surface/30"
              >
                <span>Xem bản đồ làng</span>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-surface/20 hover:bg-surface/40 backdrop-blur-md text-surface flex items-center justify-center transition-all border border-surface/20 hover:scale-105"
            aria-label="Slide trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-surface/20 hover:bg-surface/40 backdrop-blur-md text-surface flex items-center justify-center transition-all border border-surface/20 hover:scale-105"
            aria-label="Slide tiếp theo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 bg-secondary'
                  : 'w-2.5 bg-surface/50 hover:bg-surface/80'
              }`}
              aria-label={`Chuyển đến slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
