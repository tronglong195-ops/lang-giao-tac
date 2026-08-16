import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Maximize2, X, Disc } from 'lucide-react';

export const VillageMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const iframeRef = useRef(null);

  const videoId = 'pcKfUACFd_o'; // Ca khúc: Hà Tĩnh Nhớ Về

  // Tự động kích hoạt phát nhạc khi người dùng tương tác lần đầu (Click/Chạm trên trang)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setIsPlaying(true);
        // Gửi lệnh play tới iframe YouTube
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
            '*'
          );
        }
      }
    };

    // Lắng nghe tương tác đầu tiên trên trình duyệt
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [hasInteracted]);

  const togglePlay = () => {
    if (!iframeRef.current?.contentWindow) return;

    if (isPlaying) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
        '*'
      );
      setIsPlaying(false);
    } else {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
        '*'
      );
      setIsPlaying(true);
      setHasInteracted(true);
    }
  };

  const toggleMute = () => {
    if (!iframeRef.current?.contentWindow) return;

    if (isMuted) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'unMute', args: '' }),
        '*'
      );
      setIsMuted(false);
    } else {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'mute', args: '' }),
        '*'
      );
      setIsMuted(true);
    }
  };

  return (
    <>
      {/* Ẩn YouTube IFrame phát nhạc nền trong chế độ background */}
      <div className="hidden">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&loop=1&playlist=${videoId}&origin=${window.location.origin}`}
          title="Nhạc nền Hà Tĩnh Nhớ Về"
          allow="autoplay; encrypted-media"
        ></iframe>
      </div>

      {/* Floating Music Player Widget ở góc dưới bên trái */}
      <div className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 z-40 flex items-center select-none group max-w-[calc(100vw-24px)]">
        <div className="bg-surface/95 backdrop-blur-md border border-warmBorder shadow-warmHover rounded-full p-1 sm:p-1.5 pr-2.5 sm:pr-4 flex items-center space-x-2 sm:space-x-3 transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 max-w-full">
          {/* Đĩa nhạc xoay tròn khi đang phát */}
          <button
            onClick={togglePlay}
            className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-secondary-light flex items-center justify-center shadow-md overflow-hidden shrink-0 group-hover:bg-primary-dark transition-colors"
            title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc quê hương'}
          >
            <Disc
              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              ) : (
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white ml-0.5" />
              )}
            </div>
          </button>

          {/* Thông tin bài hát & Equalizer sóng nhạc */}
          <div className="flex flex-col cursor-pointer min-w-0" onClick={() => setShowVideoModal(true)}>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="text-[11px] sm:text-xs font-bold text-primary-dark tracking-tight hover:underline flex items-center space-x-1 truncate max-w-[100px] xs:max-w-[140px] sm:max-w-none">
                <Music className="w-3 h-3 text-primary inline mr-1 shrink-0" />
                <span className="truncate">Hà Tĩnh Nhớ Về</span>
              </span>

              {/* Equalizer thanh sóng âm thanh */}
              {isPlaying && (
                <div className="flex items-end space-x-0.5 h-3 shrink-0">
                  <span className="w-0.5 bg-secondary rounded-full animate-bounce h-2" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-0.5 bg-primary rounded-full animate-bounce h-3" style={{ animationDelay: '0.3s' }}></span>
                  <span className="w-0.5 bg-accent rounded-full animate-bounce h-2.5" style={{ animationDelay: '0.2s' }}></span>
                </div>
              )}
            </div>

            <span className="text-[9px] sm:text-[10px] text-ink-muted leading-tight truncate max-w-[95px] xs:max-w-[130px] sm:max-w-[180px]">
              {isPlaying ? 'Giai điệu quê hương...' : 'Nhấp để nghe khúc tâm tình'}
            </span>
          </div>

          {/* Nút điều khiển âm lượng và xem video */}
          <div className="flex items-center space-x-1 pl-2 border-l border-warmBorder/80">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-paper transition-colors"
              title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowVideoModal(true)}
              className="p-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-paper transition-colors"
              title="Mở xem toàn màn hình video ca nhạc"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Xem Video Ca Nhạc Full Screen */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-surface rounded-3xl border border-warmBorder max-w-3xl w-full p-6 sm:p-8 space-y-4 shadow-warmHover relative">
            <div className="flex items-center justify-between border-b border-warmBorder pb-3">
              <div className="flex items-center space-x-2">
                <Music className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg text-primary-dark">
                  Ca Khúc: Hà Tĩnh Nhớ Về
                </h3>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-paper transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden shadow-warm border border-warmBorder">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="Hà Tĩnh Nhớ Về"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            <p className="text-xs text-ink-muted italic text-center">
              Khúc hát quê hương da diết gửi tặng bà con Làng Giao Tác — TDP 9 Thuận Lộc và những người con xa xứ.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
