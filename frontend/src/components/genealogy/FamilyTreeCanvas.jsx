import React, { useState, useRef } from 'react';
import {
  Calendar,
  Heart,
  ChevronDown,
  ChevronRight,
  Plus,
  Info,
  Search,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Award,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// --- HỌA TIẾT CUNG ĐÌNH VIỆT NAM (DRAGON & LOTUS EMBELLISHMENTS) ---

/**
 * Mái Chóp Bài Vị Cổ Phong (Lưỡng Long / Hoa Sen Thếp Vàng)
 */
const AncestralTabletHeader = ({ isRoot, generation }) => (
  <div className="w-full flex items-center justify-center -mt-3 mb-1">
    <svg className="w-48 h-8 text-amber-500 drop-shadow-sm" viewBox="0 0 200 32" fill="currentColor">
      {/* Khung chóp uốn lượn phong cách cung đình triều Nguyễn */}
      <path
        d="M 10 28 C 30 18, 60 12, 100 8 C 140 12, 170 18, 190 28 L 196 32 C 160 18, 130 12, 100 12 C 70 12, 40 18, 4 32 Z"
        fill="#B45309"
      />
      <path
        d="M 20 26 C 45 16, 70 10, 100 6 C 130 10, 155 16, 180 26 C 150 14, 125 9, 100 9 C 75 9, 50 14, 20 26 Z"
        fill="#F59E0B"
      />
      {/* Ngọc châu / Hoa sen chính giữa */}
      <circle cx="100" cy="8" r="6" fill="#FDE047" stroke="#9A3412" strokeWidth="1.5" />
      <circle cx="100" cy="8" r="3" fill="#DC2626" />
      {/* Đôi rồng / hoa văn mây hai bên */}
      <path
        d="M 85 10 C 75 4, 60 8, 50 12 C 60 10, 75 8, 85 10 Z"
        fill="#FCD34D"
      />
      <path
        d="M 115 10 C 125 4, 140 8, 150 12 C 140 10, 125 8, 115 10 Z"
        fill="#FCD34D"
      />
    </svg>
  </div>
);

/**
 * Đế Bài Vị Cổ Điển
 */
const AncestralTabletFooter = () => (
  <div className="w-full flex justify-center -mb-2 mt-1">
    <svg className="w-40 h-4 text-amber-600/80" viewBox="0 0 160 16" fill="currentColor">
      <path
        d="M 10 0 L 150 0 C 140 8, 120 12, 80 14 C 40 12, 20 8, 10 0 Z"
        fill="#78350F"
      />
      <path
        d="M 20 2 L 140 2 C 125 7, 105 10, 80 11 C 55 10, 35 7, 20 2 Z"
        fill="#D97706"
      />
    </svg>
  </div>
);

/**
 * Chuyển số đời sang chữ số La Mã cổ phong
 */
const getGenerationRoman = (gen) => {
  const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
  return romans[gen - 1] || gen;
};

const TreeNode = ({ node, onSelectMember, onAddChild, isAdmin, searchQuery }) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isRoot = node.generation === 1;

  const isMatched =
    searchQuery &&
    searchQuery.trim().length > 0 &&
    (node.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.branchName && node.branchName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (node.spouseName && node.spouseName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (node.careerHonor && node.careerHonor.toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <div className="flex flex-col items-center relative">
      {/* Node Card theo phong cách Bài Vị Sơn Son Thếp Vàng */}
      <div
        className={`relative group p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-300 w-60 sm:w-72 text-center cursor-pointer select-none shadow-md ${
          isRoot
            ? 'bg-gradient-to-b from-[#7F1D1D] via-[#991B1B] to-[#581C87]/90 border-amber-400 text-amber-100 ring-4 ring-amber-400/40 shadow-xl'
            : isMatched
            ? 'bg-gradient-to-b from-amber-900 to-amber-950 border-amber-300 text-amber-50 ring-4 ring-amber-400 shadow-2xl scale-105'
            : 'bg-gradient-to-b from-[#831843] via-[#7F1D1D] to-[#450A0A] border-amber-600/80 hover:border-amber-400 text-amber-50 shadow-lg hover:shadow-2xl'
        }`}
        style={{
          boxShadow: isRoot
            ? '0 10px 25px -5px rgba(180, 83, 9, 0.4), 0 8px 10px -6px rgba(180, 83, 9, 0.4)'
            : '0 8px 20px -4px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Chóp rồng thếp vàng */}
        <AncestralTabletHeader isRoot={isRoot} generation={node.generation} />

        {/* Khung viền chỉ vàng kép kiểu Cung Đình */}
        <div className="border border-amber-400/40 rounded-lg p-2.5 bg-black/20 backdrop-blur-xs relative space-y-1.5">
          {/* Góc triện cổ 4 phía */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-amber-400/80" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-amber-400/80" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-amber-400/80" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-amber-400/80" />

          {/* Huy hiệu thế hệ */}
          <div className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-stone-900 font-extrabold text-[10px] uppercase tracking-widest shadow-xs border border-amber-200">
            <span>{isRoot ? 'Cụ Thủy Tổ • Tiên Khởi' : `Thế Hệ Đời Thứ ${getGenerationRoman(node.generation)}`}</span>
          </div>

          {isMatched && (
            <div className="absolute -top-3 right-1 px-2 py-0.5 rounded-md bg-amber-400 text-red-950 text-[10px] font-black tracking-wider flex items-center space-x-1 shadow-md animate-pulse">
              <Sparkles className="w-3 h-3" />
              <span>Khớp</span>
            </div>
          )}

          <div onClick={() => onSelectMember(node)} className="space-y-1 pt-1">
            {/* Tên chữ thư pháp thếp vàng */}
            <h4
              className={`font-serif font-black tracking-wide leading-tight transition-colors drop-shadow-sm ${
                isRoot
                  ? 'text-base sm:text-lg text-yellow-300'
                  : 'text-sm sm:text-base text-yellow-200 group-hover:text-yellow-100'
              }`}
            >
              {node.fullName}
            </h4>

            {/* Chi phái / Phân nhánh */}
            {node.branchName && (
              <p className="text-[11px] font-medium text-amber-200/90 tracking-wide">
                ⚜️ {node.branchName}
              </p>
            )}

            {/* Năm sinh / Năm mất */}
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-amber-200/80 font-mono pt-0.5">
              <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
              <span>
                {node.birthYear || 'Tích niên'} — {node.deathYear || (node.careerHonor ? 'Hiện diện' : 'Hưởng thọ ?')}
              </span>
            </div>

            {/* Phối ngẫu / Chính thất */}
            {node.spouseName && (
              <div className="flex items-center justify-center space-x-1 text-[11px] text-rose-200 bg-rose-950/60 rounded-md py-0.5 px-2 border border-rose-500/30 truncate">
                <Heart className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                <span className="truncate">Chính thất: {node.spouseName}</span>
              </div>
            )}

            {/* Tước vị / Công đức / Phẩm hàm */}
            {node.careerHonor && (
              <div className="flex items-center justify-center space-x-1 text-[10px] text-yellow-100 bg-amber-950/70 border border-amber-400/40 rounded-md py-0.5 px-2 truncate">
                <Award className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate font-serif italic">{node.careerHonor}</span>
              </div>
            )}
          </div>

          {/* Nút thêm con cháu (Admin/Mod) */}
          {isAdmin && (
            <div className="pt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddChild(node);
                }}
                className="w-full py-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-yellow-300 hover:text-yellow-100 text-[10px] font-bold border border-amber-400/40 flex items-center justify-center space-x-1 transition-all"
                title="Khởi tạo thêm con cháu / thế hệ kế tục"
              >
                <Plus className="w-3 h-3 text-amber-300" />
                <span>Thêm Hậu Duệ (Đời {node.generation + 1})</span>
              </button>
            </div>
          )}
        </div>

        {/* Chân đế bài vị */}
        <AncestralTabletFooter />
      </div>

      {/* Nút thu gọn / mở rộng con cháu */}
      {hasChildren && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="my-2.5 px-3 py-1 rounded-full bg-[#581C87] hover:bg-[#6B21A8] text-amber-200 hover:text-amber-100 text-[11px] font-bold border border-amber-400/60 flex items-center space-x-1.5 transition-all shadow-md"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{node.children.length} Phân Nhánh Hậu Duệ</span>
        </button>
      )}

      {/* Dây nối phả hệ hoàng triều (Cung Đình Chỉ Vàng) */}
      {hasChildren && !collapsed && (
        <div className="relative pt-4 flex items-start space-x-8 sm:space-x-14">
          {/* Đường chỉ đỏ viền vàng nối cha với các con */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-amber-400 shadow-sm" />
          
          {node.children.map((child) => (
            <div key={child.id} className="relative flex flex-col items-center">
              <TreeNode
                node={child}
                onSelectMember={onSelectMember}
                onAddChild={onAddChild}
                isAdmin={isAdmin}
                searchQuery={searchQuery}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const FamilyTreeCanvas = ({
  tree = [],
  clanName = 'Phả Hệ Dòng Họ',
  onSelectMember,
  onAddChild,
  isAdmin,
}) => {
  const [zoom, setZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [exporting, setExporting] = useState(false);

  // Pan / Dragging state
  const containerRef = useRef(null);
  const printAreaRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setStartY(e.pageY - containerRef.current.offsetTop);
    setScrollLeft(containerRef.current.scrollLeft);
    setScrollTop(containerRef.current.scrollTop);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = (x - startX) * 1.2;
    const walkY = (y - startY) * 1.2;
    containerRef.current.scrollLeft = scrollLeft - walkX;
    containerRef.current.scrollTop = scrollTop - walkY;
  };

  // Đếm số kết quả tìm kiếm
  const countMatches = (nodes, query) => {
    if (!query || query.trim().length === 0) return 0;
    let count = 0;
    const traverse = (nodeList) => {
      for (const n of nodeList) {
        if (
          n.fullName.toLowerCase().includes(query.toLowerCase()) ||
          (n.branchName && n.branchName.toLowerCase().includes(query.toLowerCase())) ||
          (n.spouseName && n.spouseName.toLowerCase().includes(query.toLowerCase())) ||
          (n.careerHonor && n.careerHonor.toLowerCase().includes(query.toLowerCase()))
        ) {
          count++;
        }
        if (n.children && n.children.length > 0) {
          traverse(n.children);
        }
      }
    };
    traverse(nodes);
    return count;
  };

  const matchCount = countMatches(tree, searchQuery);

  // Xuất file PDF khổ A3 cổ điển hoàng gia
  const handleExportPDF = async () => {
    if (!printAreaRef.current) return;
    setExporting(true);
    try {
      const originalZoom = zoom;
      setZoom(1);

      await new Promise((res) => setTimeout(res, 350));

      const canvas = await html2canvas(printAreaRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#2D0A0A',
        logging: false,
      });

      setZoom(originalZoom);

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a3',
      });

      const pdfWidth = 420;
      const pdfHeight = 297;
      const margin = 12;
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = pdfHeight - margin * 2;

      // Nền đỏ son cung đình trên PDF
      pdf.setFillColor(69, 10, 10);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      // Khung viền mạ vàng kép
      pdf.setDrawColor(217, 119, 6);
      pdf.setLineWidth(1.5);
      pdf.rect(6, 6, pdfWidth - 12, pdfHeight - 12);
      pdf.setLineWidth(0.5);
      pdf.rect(8, 8, pdfWidth - 16, pdfHeight - 16);

      // Đại tự tiêu đề
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(253, 224, 71); // Vàng kim
      pdf.text(`PHA HE CO TRUYEN: ${clanName.toUpperCase()}`, pdfWidth / 2, 18, { align: 'center' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(254, 240, 138);
      pdf.text(
        `Lang Giao Tac • TDP 9 Thuan Loc, Phuong Nam Hong Linh, Tinh Ha Tinh | An ban ngay: ${new Date().toLocaleDateString('vi-VN')}`,
        pdfWidth / 2,
        24,
        { align: 'center' }
      );

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(contentWidth / (imgWidth * 0.264583), (contentHeight - 20) / (imgHeight * 0.264583));

      const renderedW = (imgWidth * 0.264583) * ratio;
      const renderedH = (imgHeight * 0.264583) * ratio;
      const posX = (pdfWidth - renderedW) / 2;
      const posY = 30 + ((contentHeight - 20) - renderedH) / 2;

      pdf.addImage(imgData, 'JPEG', posX, posY, renderedW, renderedH);
      pdf.save(`Pha_He_Cung_Dinh_${clanName.replace(/[^a-zA-Z0-9]/g, '_')}_A3.pdf`);
    } catch (err) {
      console.error('Lỗi khi xuất PDF phả hệ:', err);
      alert('Không thể xuất file PDF. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
  };

  if (!tree || tree.length === 0) {
    return (
      <div className="text-center py-20 bg-gradient-to-b from-[#3E1414] to-[#250808] rounded-3xl border-2 border-amber-600/80 text-amber-200 text-sm space-y-4 shadow-xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300">
          <Info className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-serif font-bold text-yellow-300">Chưa Khởi Lập Phả Hệ Cho Dòng Tộc Này</h3>
          <p className="text-xs text-amber-200/70 max-w-md mx-auto">
            Dữ liệu phả hệ của dòng họ đang được Ban khánh tiết và các bậc cao niên biên soạn.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => onAddChild(null)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 text-stone-950 font-bold text-xs shadow-lg hover:from-amber-500 hover:to-yellow-500 transition-all border border-yellow-300"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Cụ Thủy Tổ Tiền Khai</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Thanh Điều Khiển Phong Cách Tráp Gỗ Khảm Trai & Cuốn Thư */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-[#450A0A] via-[#5B1313] to-[#450A0A] p-4 rounded-2xl border-2 border-amber-500/80 shadow-xl">
        {/* Tìm kiếm con cháu trên phả hệ */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tra cứu tiên tổ, hậu duệ, phối ngẫu, phẩm hàm..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-amber-500/60 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-xs text-yellow-100 outline-none transition-all placeholder:text-amber-300/40"
          />
          {searchQuery && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-400 text-stone-950 shadow-xs">
              {matchCount} vị khớp
            </span>
          )}
        </div>

        {/* Bộ Phím Thu Phóng & Ấn Bản PDF A3 */}
        <div className="flex items-center space-x-2.5 self-end md:self-auto">
          <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-xl border border-amber-500/50">
            <button
              onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(1))))}
              className="p-2 rounded-lg hover:bg-amber-500/20 text-amber-300 hover:text-yellow-200 transition-colors"
              title="Thu nhỏ phả đồ"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-yellow-300 px-2 min-w-[48px] text-center select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.6, Number((z + 0.1).toFixed(1))))}
              className="p-2 rounded-lg hover:bg-amber-500/20 text-amber-300 hover:text-yellow-200 transition-colors"
              title="Phóng to phả đồ"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-2 rounded-lg hover:bg-amber-500/20 text-amber-300 hover:text-yellow-200 transition-colors"
              title="Khôi phục góc nhìn chuẩn (100%)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Nút Xuất PDF Khổ A3 Hoàng Cung */}
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-yellow-400 text-stone-950 text-xs font-black shadow-lg transition-all border border-yellow-200 disabled:opacity-50"
            title="Xuất bản in Gia Phả Khổ A3 Landscape"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Đang Khắc Bản PDF...' : 'Ấn Bản PDF A3'}</span>
          </button>
        </div>
      </div>

      {/* Khung Phả Hệ Kéo Thả Tráng Lệ (Canvas Giấy Dó / Vải Gấm Cung Đình) */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className={`rounded-3xl border-4 border-amber-600/90 p-8 sm:p-14 overflow-auto min-h-[550px] max-h-[800px] shadow-2xl relative flex justify-center items-start ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          backgroundColor: '#2A0808',
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(180, 83, 9, 0.15) 0%, transparent 60%),
            linear-gradient(to right, rgba(217, 119, 6, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(217, 119, 6, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 30px 30px, 30px 30px',
        }}
      >
        {/* Khung Triện Hoa Văn Rồng Phượng Trang Trí 4 Góc Canvas */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-amber-500/80 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-amber-500/80 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-amber-500/80 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-amber-500/80 rounded-br-lg pointer-events-none" />

        <div
          ref={printAreaRef}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          className="transition-transform duration-100 flex items-start space-x-14 sm:space-x-20 p-6"
        >
          {tree.map((rootNode) => (
            <TreeNode
              key={rootNode.id}
              node={rootNode}
              onSelectMember={onSelectMember}
              onAddChild={onAddChild}
              isAdmin={isAdmin}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
