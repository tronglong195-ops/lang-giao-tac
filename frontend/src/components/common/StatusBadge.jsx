import React from 'react';
import { Clock, CheckCircle2, XCircle, FileEdit } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'published':
    case 'approved':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{status === 'published' ? 'Đã xuất bản' : 'Đã duyệt'}</span>
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Chờ duyệt</span>
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Từ chối</span>
        </span>
      );
    case 'draft':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
          <FileEdit className="w-3.5 h-3.5 text-stone-500" />
          <span>Bản nháp</span>
        </span>
      );
    default:
      return null;
  }
};
