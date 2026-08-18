import React, { useState } from 'react';
import { User, Award, MapPin, Calendar, Heart, ChevronDown, ChevronRight, Plus, Info } from 'lucide-react';

const TreeNode = ({ node, onSelectMember, onAddChild, isAdmin }) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Member Card */}
      <div className="relative group p-3 sm:p-4 rounded-2xl bg-surface border-2 border-warmBorder hover:border-primary shadow-sm hover:shadow-warm transition-all duration-200 w-56 sm:w-64 text-center cursor-pointer">
        {/* Generation Badge */}
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-primary text-surface text-[10px] font-bold uppercase tracking-wider shadow-xs">
          Đời thứ {node.generation}
        </div>

        <div onClick={() => onSelectMember(node)} className="space-y-1.5 pt-1">
          {/* Avatar or Icon */}
          <div className="w-12 h-12 mx-auto rounded-full bg-primary-subtle text-primary flex items-center justify-center font-bold text-base border border-primary/20 overflow-hidden">
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
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const FamilyTreeCanvas = ({ tree = [], onSelectMember, onAddChild, isAdmin }) => {
  const [zoom, setZoom] = useState(1);

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
      {/* Zoom Control Bar */}
      <div className="flex items-center justify-between bg-surface/80 backdrop-blur-sm p-3 rounded-2xl border border-warmBorder">
        <span className="text-xs font-semibold text-ink-muted">Sơ Đồ Phả Hệ Phân Nhánh</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
            className="px-2.5 py-1 rounded-lg bg-paper border border-warmBorder text-xs font-bold hover:bg-primary-subtle"
          >
            -
          </button>
          <span className="text-xs font-medium text-ink min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
            className="px-2.5 py-1 rounded-lg bg-paper border border-warmBorder text-xs font-bold hover:bg-primary-subtle"
          >
            +
          </button>
          <button
            onClick={() => setZoom(1)}
            className="px-2.5 py-1 rounded-lg bg-paper border border-warmBorder text-xs font-medium hover:bg-primary-subtle"
          >
            Mặc định
          </button>
        </div>
      </div>

      {/* Tree Canvas Wrapper with Horizontal Scroll */}
      <div className="bg-paper/50 rounded-3xl border border-warmBorder p-6 sm:p-10 overflow-x-auto min-h-[450px] flex justify-center items-start shadow-inner">
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150 flex items-start space-x-12"
        >
          {tree.map((rootNode) => (
            <TreeNode
              key={rootNode.id}
              node={rootNode}
              onSelectMember={onSelectMember}
              onAddChild={onAddChild}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
