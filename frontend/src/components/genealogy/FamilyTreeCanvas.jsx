import React, { useState, useRef } from 'react';
import {
  User,
  Award,
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
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const TreeNode = ({ node, onSelectMember, onAddChild, isAdmin, searchQuery }) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const isMatched =
    searchQuery &&
    searchQuery.trim().length > 0 &&
    (node.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.branchName && node.branchName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (node.spouseName && node.spouseName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (node.careerHonor && node.careerHonor.toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <div className="flex flex-col items-center">
      {/* Member Card */}
      <div
        className={`relative group p-3 sm:p-4 rounded-2xl bg-surface border-2 transition-all duration-200 w-56 sm:w-64 text-center cursor-pointer select-none ${
          isMatched
            ? 'border-amber-500 ring-4 ring-amber-300/50 shadow-lg scale-105 bg-amber-50/20'
            : 'border-warmBorder hover:border-primary shadow-sm hover:shadow-warm'
        }`}
      >
        {/* Generation Badge */}
        <div
          className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-surface text-[10px] font-bold uppercase tracking-wider shadow-xs ${
            isMatched ? 'bg-amber-600' : 'bg-primary'
          }`}
        >
          Đời thứ {node.generation}
        </div>

        {isMatched && (
          <div className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-bold flex items-center space-x-0.5 animate-bounce">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Khớp</span>
          </div>
        )}

        <div onClick={() => onSelectMember(node)} className="space-y-1.5 pt-1">
          {/* Avatar or Icon */}
          <div
            className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold text-base border overflow-hidden ${
              isMatched
                ? 'bg-amber-100 text-amber-900 border-amber-400'
                : 'bg-primary-subtle text-primary border-primary/20'
            }`}
          >
            {node.avatarUrl ? (
              <img src={node.avatarUrl} alt={node.fullName} className="w-full h-full object-cover" />
            ) : (
              node.fullName.charAt(0)
            )}
          </div>

          <h4 className="font-bold text-sm text-ink group-hover:text-primary transition-colors line-clamp-1">
            {node.fullName}
          </h4>

          {node.branchName && (
            <p className="text-[11px] font-medium text-accent truncate">{node.branchName}</p>
          )}

          <div className="flex items-center justify-center space-x-1 text-[11px] text-ink-muted">
            <Calendar className="w-3 h-3 text-ink-light" />
            <span>
              {node.birthYear || '?'} — {node.deathYear || (node.careerHonor ? 'Hiện diện' : '?')}
            </span>
          </div>

          {node.spouseName && (
            <div className="flex items-center justify-center space-x-1 text-[11px] text-rose-600 bg-rose-50/80 rounded-md py-0.5 px-1.5 mt-1 truncate">
              <Heart className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">Phối ngẫu: {node.spouseName}</span>
            </div>
          )}

          {node.careerHonor && (
            <div className="flex items-center justify-center space-x-1 text-[10px] text-amber-700 bg-amber-50 rounded-md py-0.5 px-1 mt-1 truncate">
              <Award className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{node.careerHonor}</span>
            </div>
          )}
        </div>

        {/* Action button: add child (Admin only) */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(node);
            }}
            className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary hover:bg-primary-dark text-surface flex items-center justify-center shadow-xs transition-transform hover:scale-110"
            title="Thêm con / thế hệ kế tiếp"
          >
            <Plus className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Collapse/Expand Toggle for Children */}
      {hasChildren && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="my-2 px-2 py-0.5 rounded-full bg-paper hover:bg-primary-subtle text-ink-muted hover:text-primary text-[10px] font-semibold border border-warmBorder flex items-center space-x-1 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          <span>{node.children.length} hậu duệ</span>
        </button>
      )}

      {/* Child Nodes */}
      {hasChildren && !collapsed && (
        <div className="relative pt-3 flex items-start space-x-6 sm:space-x-10">
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

  // Xuất file PDF khổ A3
  const handleExportPDF = async () => {
    if (!printAreaRef.current) return;
    setExporting(true);
    try {
      // Lưu lại scale tạm thời về 1 để chụp canvas nét nhất
      const originalZoom = zoom;
      setZoom(1);

      // Chờ React re-render ở scale 1
      await new Promise((res) => setTimeout(res, 300));

      const canvas = await html2canvas(printAreaRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FAF8F5',
        logging: false,
      });

      setZoom(originalZoom);

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      // Tạo PDF khổ A3 nằm ngang (A3 Landscape: 420 x 297 mm)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a3',
      });

      const pdfWidth = 420;
      const pdfHeight = 297;
      const margin = 15;
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = pdfHeight - margin * 2;

      // Header trên PDF
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.setTextColor(45, 90, 39); // Primary green
      pdf.text(`PHA HE: ${clanName.toUpperCase()}`, pdfWidth / 2, 12, { align: 'center' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Lang Giao Tac - TDP 9 Thuan Loc, Nam Hong Linh, Ha Tinh | Ngay xuat: ${new Date().toLocaleDateString('vi-VN')}`,
        pdfWidth / 2,
        17,
        { align: 'center' }
      );

      // Tính toán tỷ lệ ảnh
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(contentWidth / (imgWidth * 0.264583), contentHeight / (imgHeight * 0.264583));

      const renderedW = (imgWidth * 0.264583) * ratio;
      const renderedH = (imgHeight * 0.264583) * ratio;
      const posX = (pdfWidth - renderedW) / 2;
      const posY = 22 + (contentHeight - renderedH) / 2;

      pdf.addImage(imgData, 'JPEG', posX, posY, renderedW, renderedH);
      pdf.save(`Pha_He_${clanName.replace(/[^a-zA-Z0-9]/g, '_')}_A3.pdf`);
    } catch (err) {
      console.error('Lỗi khi xuất PDF:', err);
      alert('Không thể xuất file PDF. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
  };

  if (!tree || tree.length === 0) {
    return (
      <div className="text-center py-16 bg-surface rounded-3xl border border-warmBorder text-ink-muted text-sm space-y-3">
        <Info className="w-10 h-10 mx-auto text-ink-light" />
        <p className="font-medium">Chưa có dữ liệu cây phả hệ cho dòng họ này.</p>
        {isAdmin && (
          <p className="text-xs text-primary">Hãy bấm nút "Thêm cụ Thủy tổ / Tiên tổ" phía trên để bắt đầu lập phả hệ.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Action Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-surface/90 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl border border-warmBorder shadow-xs">
        {/* Search member in tree */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ink-light absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên con cháu, phối ngẫu, vinh danh..."
            className="w-full pl-9.5 pr-4 py-1.5 rounded-xl bg-paper border border-warmBorder focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none transition-all placeholder:text-ink-light"
          />
          {searchQuery && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
              {matchCount} khớp
            </span>
          )}
        </div>

        {/* Zoom & PDF Export Controls */}
        <div className="flex items-center space-x-2 self-end md:self-auto">
          <div className="flex items-center space-x-1 bg-paper p-1 rounded-xl border border-warmBorder">
            <button
              onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(1))))}
              className="p-1.5 rounded-lg hover:bg-surface text-ink-muted hover:text-primary transition-colors"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-ink px-1.5 min-w-[42px] text-center select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.6, Number((z + 0.1).toFixed(1))))}
              className="p-1.5 rounded-lg hover:bg-surface text-ink-muted hover:text-primary transition-colors"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 rounded-lg hover:bg-surface text-ink-muted hover:text-primary transition-colors"
              title="Đặt lại góc nhìn (100%)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export PDF Button */}
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-dark text-surface text-xs font-bold shadow-xs transition-all disabled:opacity-50"
            title="Xuất bản in PDF khổ A3"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exporting ? 'Đang xuất PDF...' : 'Xuất PDF A3'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Draggable Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className={`bg-paper/60 rounded-3xl border border-warmBorder p-6 sm:p-12 overflow-auto min-h-[500px] max-h-[750px] shadow-inner relative flex justify-center items-start ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div
          ref={printAreaRef}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          className="transition-transform duration-100 flex items-start space-x-12 sm:space-x-16 p-4"
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
