import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Calendar, Sparkles, MapPin, Award } from 'lucide-react';
import { historyService } from '../services/historyService';
import { SectionDivider } from '../components/layout/SectionDivider';

export const HistoryPage = () => {
  const [timelines, setTimelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimelines = async () => {
      try {
        const data = await historyService.getTimelines();
        if (data) {
          setTimelines(data);
        }
      } catch (error) {
        console.error('Lỗi khi tải lịch sử làng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelines();
  }, []);

  return (
    <div className="space-y-12">
      {/* 1. Header Banner */}
      <section className="relative bg-primary-dark text-surface py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFFDF7_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-surface/15 text-secondary-light text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Landmark className="w-4 h-4" />
            <span>Trang Sử Vàng Quê Hương</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Lịch Sử Làng Giao Tác — TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh
          </h1>
          <p className="text-paper/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Hơn 300 năm khai hoang lập ấp dưới chân dãy núi Hồng Lĩnh hùng vĩ, bảo vệ quê hương và xây dựng Tổ dân phố 9 Thuận Lộc văn minh, ấm no, nghĩa tình.
          </p>
        </div>
      </section>

      {/* Decorative Wave */}
      <SectionDivider variant="tiles" fill="#FBF6EC" bg="#2F4F3A" />

      {/* 2. Timeline Dọc Scroll-Reveal */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="text-center py-20 text-ink-muted">Đang tải dòng thời gian lịch sử...</div>
        ) : (
          <div className="relative border-l-2 border-primary/30 ml-4 sm:ml-32 space-y-12 py-4">
            {timelines.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="relative pl-6 sm:pl-8 group"
                >
                  {/* Pin Node on the line */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-secondary border-4 border-surface shadow-md group-hover:scale-125 transition-transform duration-300"></div>

                  {/* Year Label on left for desktop */}
                  <div className="sm:absolute sm:-left-32 sm:top-0 text-left sm:text-right w-24">
                    <span className="inline-block font-extrabold text-sm sm:text-base text-primary-dark bg-secondary-subtle px-2.5 py-1 rounded-lg border border-secondary/30">
                      {item.yearLabel}
                    </span>
                  </div>

                  {/* Content Card */}
                  <div className="mt-2 sm:mt-0 bg-surface rounded-2xl border border-warmBorder p-6 sm:p-8 shadow-warm hover:shadow-warmHover transition-shadow space-y-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-ink leading-snug">
                      {item.title}
                    </h3>

                    {item.imageUrl && (
                      <div className="rounded-xl overflow-hidden max-h-72 shadow-inner">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <p className="text-ink-muted text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
