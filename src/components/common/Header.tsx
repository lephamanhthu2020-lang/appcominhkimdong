import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, GraduationCap, User, Sparkles, RefreshCw, LogOut, ShieldCheck, PlayCircle } from 'lucide-react';

interface HeaderProps {
  onOpenDemoGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDemoGuide }) => {
  const {
    userRole,
    currentStudent,
    logout,
    loginAsTeacher,
    isDemoMode,
    resetDemoData,
    hasServerAI,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Simulation Banner if demo mode */}
      {isDemoMode && (
        <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
          <span className="bg-black/20 px-2 py-0.5 rounded text-[11px] tracking-wide uppercase">DỮ LIỆU MÔ PHỎNG</span>
          <span>Dữ liệu phục vụ kiểm thử và thuyết trình cuộc thi – Tách biệt với hồ sơ thực tế.</span>
          <button
            onClick={resetDemoData}
            title="Đặt lại dữ liệu mẫu Toán lớp 5"
            className="ml-2 inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-white text-[11px] transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Đặt lại mẫu
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-100">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg text-slate-900 tracking-tight">
                AI LA BÀN <span className="text-blue-600">5/3</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                <Sparkles className="w-3 h-3 text-blue-500" /> GDPT 2018
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-md">
              TH Kim Đồng • 207 Nguyễn Trung Trực, P. Rạch Giá, An Giang • ĐT: 0917014180
            </p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenDemoGuide && (
            <button
              onClick={onOpenDemoGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer shadow-xs"
            >
              <PlayCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Kịch bản</span> Demo BGK
            </button>
          )}

          {/* AI Connection Status Badge */}
          <div
            title={hasServerAI ? 'AI Gemini 3.8-flash đang hoạt động' : 'Chế độ sư phạm nội bộ (Có thể kết nối GEMINI_API_KEY trên server)'}
            className={`hidden md:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
              hasServerAI
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${hasServerAI ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span>{hasServerAI ? 'AI Trực Tuyến' : 'Sư Phạm Chuẩn'}</span>
          </div>

          {/* Current identity badge */}
          {userRole === 'teacher' && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div
                title="Giáo viên: Diêm Nhật Minh - ĐT: 0917014180 - TH Kim Đồng, 207 Nguyễn Trung Trực, P. Rạch Giá, T. An Giang"
                className="flex items-center gap-2 bg-blue-50 text-blue-900 px-3 py-1.5 rounded-xl border border-blue-100"
              >
                <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="text-left text-xs">
                  <span className="font-bold block leading-none">Thầy Diêm Nhật Minh</span>
                  <span className="text-[10px] text-blue-600 leading-none">GVCN 5/3 • 0917014180</span>
                </div>
              </div>
              <button
                onClick={logout}
                title="Đăng xuất / Về trang chủ"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {userRole === 'student' && currentStudent && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2 bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200">
                <span className="text-lg">{currentStudent.avatar}</span>
                <div className="text-left text-xs">
                  <span className="font-bold block leading-none">{currentStudent.name}</span>
                  <span className="text-[10px] text-amber-700 font-mono leading-none">{currentStudent.code}</span>
                </div>
              </div>
              <button
                onClick={logout}
                title="Đăng xuất / Về trang chủ"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {userRole === 'guest' && (
            <div className="flex items-center gap-2">
              <button
                onClick={loginAsTeacher}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Không gian GV</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
