import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Compass,
  FileQuestion,
  Database,
  Gamepad2,
  TrendingUp,
  Bot,
  Send,
  BarChart3,
  Award,
  Settings,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children }) => {
  const { activeTeacherTab, setActiveTeacherTab, isDemoMode } = useApp();

  const menuItems = [
    { id: 'dashboard', label: '1. Tổng quan lớp học', icon: LayoutDashboard },
    { id: 'students', label: '2. Hồ sơ học sinh', icon: Users },
    { id: 'diagnostic', label: '3. Khảo sát năng lực AI', icon: Compass },
    { id: 'workshop', label: '4. Thiết kế bài học AI', icon: FileQuestion },
    { id: 'bank', label: '5. Ngân hàng bài tập', icon: Database },
    { id: 'games', label: '6. Trò chơi học tập', icon: Gamepad2 },
    { id: 'paths', label: '7. Lộ trình cá nhân hóa', icon: TrendingUp, highlight: true },
    { id: 'assistant', label: '8. Trợ lý AI (Bạn La Bàn)', icon: Bot },
    { id: 'assignments', label: '9. Giao bài và chấm bài', icon: Send },
    { id: 'analytics', label: '10. Thống kê – Báo cáo', icon: BarChart3 },
    { id: 'evidence', label: '11. Minh chứng dự thi', icon: Award },
    { id: 'settings', label: '12. Cài đặt hệ thống', icon: Settings },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 shrink-0 hidden lg:flex flex-col justify-between">
        <div className="p-4">
          <div className="px-3 py-2 mb-3 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">TRUNG TÂM GIÁO VIÊN</span>
            </div>
            <div className="text-xs font-bold text-slate-800 mt-1">Lớp 5/3 • TH Kim Đồng</div>
            <div className="text-[11px] font-semibold text-blue-700">GVCN: Cô Diêm Nhật Minh • 0917014180</div>
            <div className="text-[10px] text-slate-500 truncate" title="207 Nguyễn Trung Trực, P. Rạch Giá, T. An Giang">
              207 Nguyễn Trung Trực, P. Rạch Giá, An Giang
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTeacherTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTeacherTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : item.highlight
                      ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/80'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200 shrink-0" />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200 text-xs text-slate-500">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-slate-700">Dự án Giáo dục AI 2026</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Ứng dụng sư phạm phân hóa theo chuẩn GDPT 2018
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Mobile Horizontal Tabs */}
        <div className="lg:hidden mb-4 overflow-x-auto pb-2 flex items-center gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTeacherTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTeacherTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label.split('.')[1]?.trim() || item.label}</span>
              </button>
            );
          })}
        </div>

        {children}
      </main>
    </div>
  );
};
