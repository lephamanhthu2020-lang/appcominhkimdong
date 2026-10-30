import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  Target,
  Zap,
  Award,
  Gamepad2,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Users,
  Search,
} from 'lucide-react';

interface LandingPageProps {
  onOpenDemoGuide: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenDemoGuide }) => {
  const { loginAsTeacher, loginAsStudent, students } = useApp();
  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showStudentModal, setShowStudentModal] = useState(false);

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCodeInput.trim()) {
      setLoginError('Vui lòng nhập Mã học sinh của em (Ví dụ: HS-DEMO-01)');
      return;
    }
    const success = loginAsStudent(studentCodeInput.trim());
    if (!success) {
      setLoginError(`Không tìm thấy mã học sinh "${studentCodeInput}". Em hãy kiểm tra lại hoặc thử mã mẫu HS-DEMO-01.`);
    } else {
      setShowStudentModal(false);
    }
  };

  const handleQuickDemoStudent = (code: string) => {
    loginAsStudent(code);
    setShowStudentModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Soft Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-linear-to-b from-blue-100/60 via-indigo-50/40 to-transparent pointer-events-none -z-10 blur-2xl" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-teal-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 left-10 w-72 h-72 bg-amber-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6 shadow-xs animate-bounce-subtle">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Cuộc thi Ứng dụng AI trong Giáo dục Việt Nam 2026</span>
          </div>

          {/* Logo Emblem */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-linear-to-tr from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 ring-4 ring-white">
                <Compass className="w-14 h-14 animate-spin-slow" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shadow-md font-bold text-xs ring-2 ring-white">
                <BookOpen className="w-5 h-5 text-slate-900" />
              </div>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
            AI LA BÀN <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-teal-600 bg-clip-text text-transparent">5/3</span>
          </h1>

          <p className="mt-3 text-lg sm:text-xl font-bold text-slate-700 font-heading">
            Khám phá năng lực – Cá nhân hóa học tập – Cùng em tiến bộ
          </p>

          <div className="mt-4 flex flex-col items-center justify-center gap-1.5 text-xs text-slate-600">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="font-bold text-slate-800">Giáo viên: Cô Diêm Nhật Minh</span>
              <span>•</span>
              <span className="font-bold text-blue-700 font-mono">ĐT: 0917014180</span>
              <span>•</span>
              <span className="font-bold text-slate-800">Trường Tiểu học Kim Đồng – Lớp 5/3</span>
              <span>•</span>
              <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded">GDPT 2018</span>
            </div>
            <div className="text-[11px] text-slate-500">
              📍 Địa chỉ: 207 Nguyễn Trung Trực, phường Rạch Giá, tỉnh An Giang
            </div>
          </div>

          {/* Central Call to Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <button
              onClick={loginAsTeacher}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 hover:-translate-y-0.5 transition-all cursor-pointer group text-base"
            >
              <GraduationCap className="w-5 h-5 text-blue-200 group-hover:scale-110 transition-transform" />
              <span>KHÔNG GIAN GIÁO VIÊN</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-80 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setShowStudentModal(true)}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 hover:-translate-y-0.5 transition-all cursor-pointer group text-base"
            >
              <Brain className="w-5 h-5 text-amber-200 group-hover:scale-110 transition-transform" />
              <span>GÓC HỌC TẬP CỦA EM</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-80 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick Demo for Judges button */}
          <div className="mt-5">
            <button
              onClick={onOpenDemoGuide}
              className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-xl text-sm border border-emerald-300 shadow-xs hover:border-emerald-400 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>TRẢI NGHIỆM BẢN DEMO (DÀNH CHO BAN GIÁM KHẢO)</span>
            </button>
          </div>

          {/* Key Message */}
          <div className="mt-12 p-4 bg-white/80 backdrop-blur-xs rounded-2xl border border-slate-200 shadow-xs max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-slate-700 italic">
              "AI không thay thế người thầy – AI giúp người thầy thấu hiểu và đồng hành cùng từng học sinh."
            </p>
          </div>
        </div>
      </div>

      {/* 3 Personalized Learning Paths Showcase */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold font-heading text-slate-900">
            Mô Hình 3 Lộ Trình Cá Nhân Hóa Linh Hoạt
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Không dán nhãn cố định học sinh – Chuyển đổi linh hoạt theo từng Yêu cầu cần đạt (GDPT 2018)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Path 1: Khoi dong */}
          <div className="bg-white rounded-2xl p-6 border-2 border-amber-200/80 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/50 rounded-bl-full -z-10" />
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              LỘ TRÌNH 1
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">KHỞI ĐỘNG</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Dành cho nội dung học sinh cần củng cố</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Giải thích kiến thức bằng ví dụ trực quan</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Bài tập cơ bản có giàn giáo từng bước</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Phản hồi khích lệ, tạo dựng sự tự tin</span>
              </li>
            </ul>
          </div>

          {/* Path 2: Tang toc */}
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-200/80 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-bl-full -z-10" />
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              LỘ TRÌNH 2
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">TĂNG TỐC</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Dành cho nội dung đã nắm kiến thức nền</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Bài tập thực hành rèn luyện thành thạo</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Tình huống vận dụng thực tế đời sống</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Trò chơi củng cố và thi đua tích cực</span>
              </li>
            </ul>
          </div>

          {/* Path 3: Chinh phuc */}
          <div className="bg-white rounded-2xl p-6 border-2 border-teal-200/80 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-100/50 rounded-bl-full -z-10" />
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              LỘ TRÌNH 3
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">CHINH PHỤC</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Dành cho học sinh nắm vững xuất sắc</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Bài toán mở rộng, vận dụng đa bước</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Câu hỏi giải thích lập luận và phản biện</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Nhiệm vụ sáng tạo đề bài và dự án học tập</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Student Login Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <Compass className="w-8 h-8 animate-spin-slow" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Góc Học Tập Của Em
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Nhập Mã học tập do Cô Diêm Nhật Minh cấp để vào không gian cá nhân.
              </p>
            </div>

            <form onSubmit={handleStudentLogin} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã học sinh của em:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentCodeInput}
                    onChange={(e) => {
                      setStudentCodeInput(e.target.value);
                      setLoginError('');
                    }}
                    placeholder="Ví dụ: HS-DEMO-01 hoặc HS-05"
                    className="w-full uppercase font-mono px-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                    autoFocus
                  />
                </div>
                {loginError && (
                  <p className="text-xs text-rose-600 mt-1.5 font-medium">{loginError}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition-all"
                >
                  Vào học ngay
                </button>
              </div>
            </form>

            {/* Quick Demo Access Buttons */}
            <div className="mt-5 pt-4 border-t border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Hoặc trải nghiệm nhanh 3 học sinh mẫu:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleQuickDemoStudent('HS-DEMO-01')}
                  className="p-2 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 text-left transition-colors"
                >
                  <div className="text-[11px] font-bold text-amber-900 truncate">Gia Huy</div>
                  <div className="text-[10px] text-amber-700 font-mono">HS-DEMO-01</div>
                  <span className="text-[9px] text-slate-500">Khởi động</span>
                </button>
                <button
                  onClick={() => handleQuickDemoStudent('HS-DEMO-02')}
                  className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 text-left transition-colors"
                >
                  <div className="text-[11px] font-bold text-blue-900 truncate">Mai Anh</div>
                  <div className="text-[10px] text-blue-700 font-mono">HS-DEMO-02</div>
                  <span className="text-[9px] text-slate-500">Tăng tốc</span>
                </button>
                <button
                  onClick={() => handleQuickDemoStudent('HS-DEMO-03')}
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 text-left transition-colors"
                >
                  <div className="text-[11px] font-bold text-emerald-900 truncate">Quốc Bảo</div>
                  <div className="text-[10px] text-emerald-700 font-mono">HS-DEMO-03</div>
                  <span className="text-[9px] text-slate-500">Chinh phục</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>AI LA BÀN 5/3 • Bản quyền đề tài © 2026 Cô Diêm Nhật Minh (ĐT: 0917014180)</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-slate-400 text-[11px]">
            <span>Trường Tiểu học Kim Đồng (207 Nguyễn Trung Trực, P. Rạch Giá, T. An Giang)</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">Bảo vệ an toàn dữ liệu trẻ em</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
